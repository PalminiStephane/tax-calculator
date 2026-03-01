import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Period = 'monthly' | 'quarterly' | 'annual'

interface RevenueInputProps {
  annualCA: number
  onAnnualCAChange: (value: number) => void
  onMonthlyCAChange: (value: number) => void
  onQuarterlyCAChange: (value: number) => void
}

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
        ? String(annualCA / 12)
        : period === 'quarterly' && annualCA > 0
          ? String(annualCA / 4)
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

  const periodLabel =
    period === 'monthly'
      ? 'mensuel'
      : period === 'quarterly'
        ? 'trimestriel'
        : 'annuel'

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Chiffre d'affaires</Label>

      <Tabs value={period} onValueChange={(v) => handlePeriodChange(v as Period)}>
        <TabsList className="grid w-full grid-cols-3 h-8">
          <TabsTrigger value="monthly" className="text-xs">
            Mensuel
          </TabsTrigger>
          <TabsTrigger value="quarterly" className="text-xs">
            Trimestriel
          </TabsTrigger>
          <TabsTrigger value="annual" className="text-xs">
            Annuel
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative">
        <Input
          type="number"
          min={0}
          step={100}
          placeholder={`CA ${periodLabel} (€)`}
          value={displayValue}
          onChange={handleInputChange}
          className="pr-8"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
          €
        </span>
      </div>

      {period !== 'annual' && annualCA > 0 && (
        <p className="text-xs text-muted-foreground">
          ≈{' '}
          <span className="font-medium text-foreground">
            {annualCA.toLocaleString('fr-FR')} € annuels
          </span>
        </p>
      )}
    </div>
  )
}
