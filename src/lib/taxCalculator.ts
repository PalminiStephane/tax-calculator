import {
  COTISATIONS_TAUX,
  ABATTEMENT_TAUX,
  VL_IR_TAUX,
  CFP_TAUX,
  CHAMBRE_TAUX,
  CA_PLAFONDS,
  TVA_SEUILS,
  ACRE_REDUCTION,
  ABATTEMENT_MINIMUM,
  CHAMBRE_EXONERATION_SEUIL,
} from "./taxRules";
import type { TaxConfig, TaxResult, TaxWarning } from "../types";
import { formatCurrency } from "./utils";

/**
 * Calcule l'ensemble des charges et taxes d'un auto-entrepreneur français.
 * Taux applicables en 2025 (source : URSSAF, impots.gouv.fr, service-public.fr).
 */
export function calculateTaxes(config: TaxConfig): TaxResult {
  const {
    annualCA,
    activityType,
    hasACRE,
    hasVersementLiberatoire,
    isTvaApplicable,
    tvaRateApplicable,
    purchases,
  } = config;

  // ── 1. Cotisations sociales ──────────────────────────────────────────────────
  const tauxCotisationsBase = COTISATIONS_TAUX[activityType];
  const tauxCotisationsEffectif = hasACRE
    ? tauxCotisationsBase * (1 - ACRE_REDUCTION)
    : tauxCotisationsBase;
  const cotisationsSociales = annualCA * tauxCotisationsEffectif;

  // ── 2. Contribution à la Formation Professionnelle ───────────────────────────
  const cfp = annualCA * CFP_TAUX[activityType];

  // ── 3. Taxe pour frais de chambre consulaire ─────────────────────────────────
  // Exonération si CA < 5 000 €
  const tcciTcma =
    annualCA >= CHAMBRE_EXONERATION_SEUIL
      ? annualCA * CHAMBRE_TAUX[activityType]
      : 0;

  // ── 4. Versement libératoire de l'IR ─────────────────────────────────────────
  const versementLiberatoire = hasVersementLiberatoire
    ? annualCA * VL_IR_TAUX[activityType]
    : 0;

  // ── 5. Total URSSAF ──────────────────────────────────────────────────────────
  const totalURSSAF =
    cotisationsSociales + cfp + tcciTcma + versementLiberatoire;
  const tauxTotalURSSAF = annualCA > 0 ? totalURSSAF / annualCA : 0;

  // ── 6. TVA ───────────────────────────────────────────────────────────────────
  const tvaSeuils = TVA_SEUILS[activityType];
  const isAboveTvaThresholdBase = annualCA > tvaSeuils.base;
  const isAboveTvaThresholdMajore = annualCA > tvaSeuils.majore;

  let tvaCollectee = 0;
  let tvaDeductibleAchats = 0;
  let tvaNette = 0;

  if (isTvaApplicable) {
    tvaCollectee = annualCA * (tvaRateApplicable / 100);
    tvaDeductibleAchats = purchases.reduce(
      (sum, p) => sum + p.amountHT * (p.tvaRate / 100),
      0,
    );
    tvaNette = tvaCollectee - tvaDeductibleAchats;
  } else if (purchases.length > 0) {
    // Afficher les TVA sur achats à titre informatif même en franchise
    tvaDeductibleAchats = purchases.reduce(
      (sum, p) => sum + p.amountHT * (p.tvaRate / 100),
      0,
    );
  }

  // ── 7. Impôt sur le revenu (régime micro, base estimative) ───────────────────
  const abattementTaux = ABATTEMENT_TAUX[activityType];
  const abattementCalcule = annualCA * abattementTaux;
  const abattementMontant = Math.max(abattementCalcule, ABATTEMENT_MINIMUM);
  // Si versement libératoire : IR déjà payé, base imposable = 0 (pour info)
  const baseImposableIR = hasVersementLiberatoire
    ? 0
    : Math.max(annualCA - abattementMontant, 0);

  // ── 8. Revenu net ────────────────────────────────────────────────────────────
  const revenueNet = annualCA - totalURSSAF;
  const revenueNetPercent = annualCA > 0 ? revenueNet / annualCA : 0;

  // ── 9. Plafonds ──────────────────────────────────────────────────────────────
  const caPlafond = CA_PLAFONDS[activityType];
  const isAboveCaPlafond = annualCA > caPlafond;

  // ── 10. Alertes ──────────────────────────────────────────────────────────────
  const warnings: TaxWarning[] = [];

  if (isAboveCaPlafond) {
    warnings.push({
      type: "error",
      message: `Votre CA (${formatCurrency(annualCA)}) dépasse le plafond du régime micro-entreprise (${formatCurrency(caPlafond)}). Vous risquez de perdre ce statut.`,
    });
  }

  if (isAboveTvaThresholdMajore && !isTvaApplicable) {
    warnings.push({
      type: "error",
      message: `Votre CA dépasse le seuil majoré de TVA (${formatCurrency(tvaSeuils.majore)}). Vous êtes obligatoirement assujetti à la TVA dès le dépassement.`,
    });
  } else if (isAboveTvaThresholdBase && !isTvaApplicable) {
    warnings.push({
      type: "warning",
      message: `Votre CA dépasse le seuil de base de franchise TVA (${formatCurrency(tvaSeuils.base)}). Si votre CA de l'année précédente avait également dépassé ce seuil, la TVA s'applique.`,
    });
  }

  if (hasACRE) {
    warnings.push({
      type: "info",
      message: `ACRE active : réduction de 50 % sur les cotisations sociales pendant la 1re année d'activité (${formatPercent(tauxCotisationsBase)} → ${formatPercent(tauxCotisationsEffectif)}).`,
    });
  }

  if (hasVersementLiberatoire) {
    warnings.push({
      type: "info",
      message: `Versement libératoire activé : l'IR est payé directement à l'URSSAF au taux de ${formatPercent(VL_IR_TAUX[activityType])}. Éligible sous condition de RFR (≤ 28 797 €/part en 2025).`,
    });
  } else if (baseImposableIR > 0) {
    warnings.push({
      type: "info",
      message: `Base imposable estimée à l'IR : ${formatCurrency(baseImposableIR)} (après abattement de ${formatPercent(abattementTaux)}). L'impôt réel dépend de votre TMI et situation familiale.`,
    });
  }

  return {
    cotisationsSociales,
    tauxCotisationsBase,
    tauxCotisationsEffectif,
    cfp,
    tcciTcma,
    versementLiberatoire,
    totalURSSAF,
    tauxTotalURSSAF,
    isAboveTvaThresholdBase,
    isAboveTvaThresholdMajore,
    tvaCollectee,
    tvaDeductibleAchats,
    tvaNette,
    tvaThresholdBase: tvaSeuils.base,
    tvaThresholdMajore: tvaSeuils.majore,
    abattementTaux,
    abattementMontant,
    baseImposableIR,
    revenueNet,
    revenueNetPercent,
    caPlafond,
    isAboveCaPlafond,
    warnings,
  };
}

function formatPercent(value: number): string {
  return (value * 100).toFixed(2).replace(".", ",") + " %";
}
