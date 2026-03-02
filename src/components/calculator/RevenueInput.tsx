import { useState } from 'react'
import { cn } from '@/lib/utils'

type Period = 'monthly' | 'quarterly' | 'annual'

interface RevenueInputProps {
  annualCA: number
  onAnnualCAChange: (value: number) => void
  onMonthlyCAChange: (value: number) => void
  onQuarterlyCAChange: (value: number) => void
}

const PERIODS: { value: Period; label: string }[] = [
  { value: 'monthly',   label: 'MENSUEL' },
  { value: 'quarterly', label: 'TRIMESTRIEL' },
  { value: 'annual',    label: 'ANNUEL' },
]

export function RevenueInput({
  annualCA,
  onAnnualCAChange,
  onMonthlyCAChange,
  onQuarterlyCAChange,
}: RevenueInputProps) {
  const [period, setPeriod] = useState<Period>('annual')
  const [rawValue, setRawValue] = useState('')

  const displayValue =
    rawValue !== ''
      ? rawValue
      : period === 'monthly' && annualCA > 0
        ? String(Math.round(annualCA / 12))
        : period === 'quarterly' && annualCA > 0
          ? String(Math.round(annualCA / 4))
          : annualCA > 0
            ? String(annualCA)
            : ''

  function handlePeriodChange(newPeriod: Period) {
    setPeriod(newPeriod)
    setRawValue('')
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(',', '.')
    setRawValue(val)
    const num = parseFloat(val)
    if (isNaN(num) || num < 0) return
    if (period === 'monthly') onMonthlyCAChange(num)
    else if (period === 'quarterly') onQuarterlyCAChange(num)
    else onAnnualCAChange(num)
  }

  return (
    <div className="space-y-4">
      <p className="mono-label">Chiffre d'affaires</p>

      {/* Period switcher */}
      <div className="flex gap-1">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => handlePeriodChange(p.value)}
            className={cn(
              'flex-1 py-1.5 font-data text-xs tracking-widest border transition-all',
              period === p.value
                ? 'border-primary text-primary bg-primary/10'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-border/60',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Large number input */}
      <div
        className="relative border-b-2 border-border pb-2 transition-colors focus-within:border-primary"
      >
        <input
          type="number"
          min={0}
          step={100}
          placeholder="0"
          value={displayValue}
          onChange={handleInputChange}
          className="w-full bg-transparent font-display text-5xl text-foreground focus:outline-none placeholder:text-muted-foreground/15 pr-14 leading-none"
        />
        <span className="absolute right-0 bottom-2 font-display text-4xl text-primary pointer-events-none">
          €
        </span>
      </div>

      {period !== 'annual' && annualCA > 0 && (
        <p className="font-data text-xs text-muted-foreground">
          ≈{' '}
          <span className="text-foreground">
            {annualCA.toLocaleString('fr-FR')} € annuels
          </span>
        </p>
      )}
    </div>
  )
}
