import { formatCurrency, formatPercent } from '@/lib/utils'
import type { TaxResult } from '@/types'

const IR_TRANCHES_2025 = [
  { max: 11_497,   label: '≤ 11 497 €',         rate: 0 },
  { max: 29_315,   label: '11 498 — 29 315 €',  rate: 0.11 },
  { max: 83_823,   label: '29 316 — 83 823 €',  rate: 0.30 },
  { max: 180_294,  label: '83 824 — 180 294 €', rate: 0.41 },
  { max: Infinity, label: '> 180 294 €',         rate: 0.45 },
]

interface IrSectionProps {
  result: TaxResult
  annualCA: number
  hasVersementLiberatoire: boolean
}

export function IrSection({ result, annualCA, hasVersementLiberatoire }: IrSectionProps) {

  if (hasVersementLiberatoire) {
    return (
      <div className="space-y-4">
        <div
          className="flex gap-3 px-4 py-3 border-l-2"
          style={{ borderColor: 'hsl(var(--primary))', background: 'hsla(44,95%,52%,0.05)' }}
        >
          <div className="space-y-1">
            <p className="font-data text-xs font-semibold tracking-widest text-primary">
              VERSEMENT LIBÉRATOIRE ACTIF
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              L'IR sur vos revenus professionnels est payé à l'URSSAF au taux de{' '}
              <span className="text-foreground font-medium">
                {formatPercent(result.versementLiberatoire / annualCA)}
              </span>
              . Vous n'avez pas à le réintégrer dans votre déclaration 2042 C PRO.
            </p>
          </div>
        </div>

        <div className="data-row">
          <p className="text-sm text-muted-foreground">IR payé via URSSAF</p>
          <span className="mono-val text-foreground">
            {formatCurrency(result.versementLiberatoire)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">

      {/* Base imposable */}
      <div>
        <p className="mono-label mb-3">Base imposable estimée</p>

        <div className="data-row">
          <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
          <span className="mono-val text-foreground">{formatCurrency(annualCA)}</span>
        </div>

        <div className="data-row">
          <div>
            <p className="text-sm text-muted-foreground">Abattement forfaitaire</p>
            <p className="font-data text-xs text-muted-foreground/50 mt-0.5">
              {formatPercent(result.abattementTaux)} (min. 305 €)
            </p>
          </div>
          <span className="mono-val" style={{ color: '#22D48F' }}>
            − {formatCurrency(result.abattementMontant)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t-2 border-primary/30 mt-1">
          <div>
            <p className="font-data text-sm font-semibold text-primary">BASE IMPOSABLE</p>
            <p className="font-data text-xs text-muted-foreground/50 mt-0.5">
              Avant déduction charges URSSAF
            </p>
          </div>
          <span className="font-display text-2xl text-primary leading-none">
            {formatCurrency(result.baseImposableIR)}
          </span>
        </div>
      </div>

      {/* Tranche bars */}
      <div>
        <p className="mono-label mb-3">Barème progressif 2025</p>

        <div className="space-y-1">
          {IR_TRANCHES_2025.map((tranche, i) => {
            const prevMax = i === 0 ? 0 : IR_TRANCHES_2025[i - 1].max
            const isActive = result.baseImposableIR > prevMax && result.baseImposableIR > 0

            const bracketWidth = tranche.max === Infinity ? 100_000 : tranche.max - prevMax
            const cappedMax = tranche.max === Infinity ? prevMax + 100_000 : tranche.max
            const inBracket = Math.max(0, Math.min(result.baseImposableIR, cappedMax) - prevMax)
            const fill = Math.min(inBracket / bracketWidth, 1) * 100

            return (
              <TrancheRow
                key={i}
                label={tranche.label}
                rate={tranche.rate}
                fill={fill}
                isActive={isActive}
                hasIncome={inBracket > 0}
              />
            )
          })}
        </div>
      </div>

      <p className="font-data text-xs text-muted-foreground/50 leading-relaxed">
        Le montant final dépend de votre quotient familial et autres revenus.{' '}
        <a
          href="https://www.impots.gouv.fr/particulier/simulateur-impot"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary/60 hover:text-primary transition-colors"
        >
          simulateur impots.gouv.fr
        </a>
      </p>
    </div>
  )
}

// ── Tranche row ────────────────────────────────────────────────────────────────

function TrancheRow({
  label,
  rate,
  fill,
  isActive,
  hasIncome,
}: {
  label: string
  rate: number
  fill: number
  isActive: boolean
  hasIncome: boolean
}) {
  const rateLabel = rate === 0 ? 'NON IMPOSÉ' : `${(rate * 100).toFixed(0)} %`
  const isHighlighted = isActive && hasIncome

  return (
    <div
      className="grid items-center gap-3 py-2 border-b border-border/40 last:border-0"
      style={{ gridTemplateColumns: '76px 1fr 110px' }}
    >
      {/* Rate */}
      <span
        className="font-data text-xs font-semibold leading-none"
        style={{ color: isHighlighted ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }}
      >
        {rateLabel}
      </span>

      {/* Progress bar */}
      <div className="bar-track h-1">
        <div
          className="bar-fill"
          style={{
            width: `${fill}%`,
            background: isHighlighted ? 'hsl(var(--primary))' : 'hsl(var(--border))',
          }}
        />
      </div>

      {/* Range */}
      <span
        className="font-data text-xs text-right leading-none"
        style={{ color: isHighlighted ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
      >
        {label}
      </span>
    </div>
  )
}
