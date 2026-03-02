import { formatCurrency, formatPercent } from '@/lib/utils'
import { CHAMBRE_LABELS } from '@/lib/taxRules'
import type { TaxResult, ActivityType } from '@/types'

interface UrssafBreakdownProps {
  result: TaxResult
  activityType: ActivityType
  hasVersementLiberatoire: boolean
  hasACRE: boolean
  annualCA: number
}

export function UrssafBreakdown({
  result,
  activityType,
  hasVersementLiberatoire,
  hasACRE,
  annualCA,
}: UrssafBreakdownProps) {
  const chambreLabel = CHAMBRE_LABELS[activityType]

  return (
    <div className="space-y-0">

      {/* Column headers */}
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <span className="mono-label text-muted-foreground/50">Charge</span>
        <div className="flex gap-6">
          <span className="mono-label text-muted-foreground/50 w-14 text-right">Taux</span>
          <span className="mono-label text-muted-foreground/50 w-20 text-right">Montant</span>
        </div>
      </div>

      {/* Cotisations sociales */}
      <div className="data-row">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground">Cotisations sociales</p>
          {hasACRE && (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-data text-xs text-primary border border-primary/40 px-1.5 py-px leading-none">
                ACRE −50%
              </span>
              <span className="font-data text-xs text-muted-foreground/50 line-through">
                {formatPercent(result.tauxCotisationsBase)}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-6 shrink-0">
          <span className="mono-val text-right w-14 text-foreground">
            {formatPercent(result.tauxCotisationsEffectif)}
          </span>
          <span className="mono-val text-right w-20 font-semibold text-destructive">
            {formatCurrency(result.cotisationsSociales)}
          </span>
        </div>
      </div>

      {/* CFP */}
      <div className="data-row">
        <p className="text-sm text-muted-foreground flex-1">Formation professionnelle (CFP)</p>
        <div className="flex gap-6 shrink-0">
          <span className="mono-val text-right w-14 text-muted-foreground">
            {formatPercent(result.cfp / annualCA)}
          </span>
          <span className="mono-val text-right w-20 text-muted-foreground">
            {formatCurrency(result.cfp)}
          </span>
        </div>
      </div>

      {/* Taxe chambre */}
      {result.tcciTcma > 0 && chambreLabel && (
        <div className="data-row">
          <p className="text-sm text-muted-foreground flex-1">Taxe chambre ({chambreLabel})</p>
          <div className="flex gap-6 shrink-0">
            <span className="mono-val text-right w-14 text-muted-foreground">
              {formatPercent(result.tcciTcma / annualCA)}
            </span>
            <span className="mono-val text-right w-20 text-muted-foreground">
              {formatCurrency(result.tcciTcma)}
            </span>
          </div>
        </div>
      )}

      {/* Versement libératoire */}
      {hasVersementLiberatoire && (
        <div className="data-row">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground">Versement libératoire IR</p>
            <p className="font-data text-xs text-muted-foreground mt-0.5">Impôt sur le revenu — URSSAF</p>
          </div>
          <div className="flex gap-6 shrink-0">
            <span className="mono-val text-right w-14 text-foreground">
              {formatPercent(result.versementLiberatoire / annualCA)}
            </span>
            <span className="mono-val text-right w-20 font-semibold text-foreground">
              {formatCurrency(result.versementLiberatoire)}
            </span>
          </div>
        </div>
      )}

      {/* Total */}
      <div
        className="flex items-center justify-between pt-3 mt-1 border-t-2 border-primary/30"
      >
        <p className="font-data text-sm font-semibold text-primary tracking-wide">TOTAL URSSAF</p>
        <div className="flex gap-6 shrink-0">
          <span className="font-data text-sm font-semibold text-primary w-14 text-right">
            {formatPercent(result.tauxTotalURSSAF)}
          </span>
          <span className="font-display text-xl text-primary leading-none w-20 text-right">
            {formatCurrency(result.totalURSSAF)}
          </span>
        </div>
      </div>

      <p className="font-data text-xs text-muted-foreground/40 text-right mt-3">
        Déclaration :{' '}
        <a
          href="https://www.autoentrepreneur.urssaf.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          autoentrepreneur.urssaf.fr
        </a>
      </p>
    </div>
  )
}
