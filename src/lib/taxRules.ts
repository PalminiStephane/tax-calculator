import type { ActivityType } from "../types";

// ─── Labels & descriptions ────────────────────────────────────────────────────

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  BIC_MARCHANDISES: "BIC — Vente de marchandises / Achat-revente",
  BIC_SERVICES_COMMERCIAUX: "BIC — Prestations de services commerciaux",
  BIC_SERVICES_ARTISANAUX: "BIC — Prestations de services artisanaux",
  BNC_SSI: "BNC — Professions libérales (régime général SSI)",
  BNC_CIPAV: "BNC — Professions libérales (CIPAV)",
};

export const ACTIVITY_DESCRIPTIONS: Record<ActivityType, string> = {
  BIC_MARCHANDISES:
    "Commerce de détail, e-commerce, vente en ligne, achat-revente, fourniture de logement meublé classé.",
  BIC_SERVICES_COMMERCIAUX:
    "Agent commercial, courtier, intermédiaire de commerce, activités de services commerciaux.",
  BIC_SERVICES_ARTISANAUX:
    "Plombier, électricien, menuisier, coiffeur, esthéticien et autres activités artisanales.",
  BNC_SSI:
    "Consultant, développeur, designer, traducteur, formateur, coach et professions libérales non réglementées.",
  BNC_CIPAV:
    "Architecte, ingénieur-conseil, psychologue, ostéopathe et professions libérales réglementées affiliées à la CIPAV.",
};

// ─── Taux de cotisations sociales 2025 (source : URSSAF) ─────────────────────

export const COTISATIONS_TAUX: Record<ActivityType, number> = {
  BIC_MARCHANDISES: 0.123, // 12.30%
  BIC_SERVICES_COMMERCIAUX: 0.212, // 21.20%
  BIC_SERVICES_ARTISANAUX: 0.212, // 21.20%
  BNC_SSI: 0.246, // 24.60% (au 1er janvier 2025)
  BNC_CIPAV: 0.232, // 23.20% (au 1er janvier 2025)
};

// ─── Abattement forfaitaire pour l'IR (source : impots.gouv.fr) ───────────────

export const ABATTEMENT_TAUX: Record<ActivityType, number> = {
  BIC_MARCHANDISES: 0.71, // 71%
  BIC_SERVICES_COMMERCIAUX: 0.5, // 50%
  BIC_SERVICES_ARTISANAUX: 0.5, // 50%
  BNC_SSI: 0.34, // 34%
  BNC_CIPAV: 0.34, // 34%
};

// ─── Taux du versement libératoire de l'IR (source : impots.gouv.fr) ──────────

export const VL_IR_TAUX: Record<ActivityType, number> = {
  BIC_MARCHANDISES: 0.01, // 1.00%
  BIC_SERVICES_COMMERCIAUX: 0.017, // 1.70%
  BIC_SERVICES_ARTISANAUX: 0.017, // 1.70%
  BNC_SSI: 0.022, // 2.20%
  BNC_CIPAV: 0.022, // 2.20%
};

// ─── Contribution à la Formation Professionnelle (source : URSSAF) ────────────

export const CFP_TAUX: Record<ActivityType, number> = {
  BIC_MARCHANDISES: 0.001, // 0.10% — commerçant
  BIC_SERVICES_COMMERCIAUX: 0.001, // 0.10% — commerçant
  BIC_SERVICES_ARTISANAUX: 0.003, // 0.30% — artisan
  BNC_SSI: 0.002, // 0.20% — libéral
  BNC_CIPAV: 0.002, // 0.20% — libéral
};

// ─── Taxe pour frais de chambre consulaire (source : service-public.fr) ───────

export const CHAMBRE_TAUX: Record<ActivityType, number> = {
  BIC_MARCHANDISES: 0.00015, // 0.015% — TCCI vente marchandises
  BIC_SERVICES_COMMERCIAUX: 0.00044, // 0.044% — TCCI services commerciaux
  BIC_SERVICES_ARTISANAUX: 0.0048, // 0.48% — TCMA services artisanaux
  BNC_SSI: 0, // Pas de taxe chambre
  BNC_CIPAV: 0, // Pas de taxe chambre
};

export const CHAMBRE_LABELS: Record<ActivityType, string> = {
  BIC_MARCHANDISES: "TCCI (0.015%)",
  BIC_SERVICES_COMMERCIAUX: "TCCI (0.044%)",
  BIC_SERVICES_ARTISANAUX: "TCMA (0.48%)",
  BNC_SSI: "",
  BNC_CIPAV: "",
};

// ─── Plafonds de CA pour le régime micro-entreprise (2024-2025) ───────────────

export const CA_PLAFONDS: Record<ActivityType, number> = {
  BIC_MARCHANDISES: 188_700,
  BIC_SERVICES_COMMERCIAUX: 77_700,
  BIC_SERVICES_ARTISANAUX: 77_700,
  BNC_SSI: 77_700,
  BNC_CIPAV: 77_700,
};

// ─── Seuils de franchise en base de TVA 2025 (source : portail-autoentrepreneur.fr) ──

export const TVA_SEUILS: Record<
  ActivityType,
  { base: number; majore: number }
> = {
  BIC_MARCHANDISES: { base: 85_000, majore: 93_500 },
  BIC_SERVICES_COMMERCIAUX: { base: 37_500, majore: 41_250 },
  BIC_SERVICES_ARTISANAUX: { base: 37_500, majore: 41_250 },
  BNC_SSI: { base: 37_500, majore: 41_250 },
  BNC_CIPAV: { base: 37_500, majore: 41_250 },
};

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Réduction ACRE : 50% sur les cotisations la 1re année */
export const ACRE_REDUCTION = 0.5;

/** Abattement minimum de 305 € (quel que soit le CA) */
export const ABATTEMENT_MINIMUM = 305;

/** Exonération de la taxe chambre consulaire sous ce seuil de CA */
export const CHAMBRE_EXONERATION_SEUIL = 5_000;

/** Plafond du RFR par part pour le versement libératoire (2025, revenus 2023) */
export const VL_IR_RFR_PLAFOND_PAR_PART = 28_797;
