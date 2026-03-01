// ─── Activités ────────────────────────────────────────────────────────────────

export type ActivityType =
  | 'BIC_MARCHANDISES'
  | 'BIC_SERVICES_COMMERCIAUX'
  | 'BIC_SERVICES_ARTISANAUX'
  | 'BNC_SSI'
  | 'BNC_CIPAV'

export type TvaRate = 0 | 5.5 | 10 | 20

// ─── Achats ───────────────────────────────────────────────────────────────────

export interface Purchase {
  id: string
  description: string
  amountHT: number
  tvaRate: TvaRate
}

// ─── Configuration du calculateur ─────────────────────────────────────────────

export interface TaxConfig {
  annualCA: number
  activityType: ActivityType
  hasACRE: boolean
  hasVersementLiberatoire: boolean
  isTvaApplicable: boolean
  tvaRateApplicable: 5.5 | 10 | 20
  purchases: Purchase[]
}

// ─── Résultats du calcul ───────────────────────────────────────────────────────

export interface TaxWarning {
  type: 'error' | 'warning' | 'info'
  message: string
}

export interface TaxResult {
  // Cotisations sociales URSSAF
  cotisationsSociales: number
  tauxCotisationsBase: number
  tauxCotisationsEffectif: number

  // Contributions annexes
  cfp: number
  tcciTcma: number

  // Versement libératoire (option IR)
  versementLiberatoire: number

  // Total charges URSSAF
  totalURSSAF: number
  tauxTotalURSSAF: number

  // TVA
  isAboveTvaThresholdBase: boolean
  isAboveTvaThresholdMajore: boolean
  tvaCollectee: number
  tvaDeductibleAchats: number
  tvaNette: number
  tvaThresholdBase: number
  tvaThresholdMajore: number

  // Impôt sur le revenu
  abattementTaux: number
  abattementMontant: number
  baseImposableIR: number

  // Vue globale
  revenueNet: number
  revenueNetPercent: number

  // Plafonds
  caPlafond: number
  isAboveCaPlafond: boolean

  // Alertes
  warnings: TaxWarning[]
}
