import { TrendingDown, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'
import type { TaxResult } from '@/types'

interface ResultsSummaryProps {
  result: TaxResult
  annualCA: number
}

export function ResultsSummary({ result, annualCA }: ResultsSummaryProps) {
  const chargesPercent = annualCA > 0 ? result.totalURSSAF / annualCA : 0

  return (
    <div className="space-y-4">
      {/* Grandes métriques */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Revenu net"
          value={formatCurrency(result.revenueNet)}
          sub={`${formatPercent(result.revenueNetPercent)} du CA`}
          icon={<TrendingUp className="h-4 w-4" />}
          variant={result.revenueNet >= 0 ? 'success' : 'danger'}
        />
        <MetricCard
          label="Total charges URSSAF"
          value={formatCurrency(result.totalURSSAF)}
          sub={`${formatPercent(chargesPercent)} du CA`}
          icon={<TrendingDown className="h-4 w-4" />}
          variant="neutral"
        />
      </div>

      {/* CA vs plafond */}
      <PlafondIndicator
        ca={annualCA}
        plafond={result.caPlafond}
        isExceeded={result.isAboveCaPlafond}
      />

      {/* Alertes */}
      {result.warnings.length > 0 && (
        <div className="space-y-2">
          {result.warnings.map((warning, i) => (
            <Alert
              key={i}
              variant={warning.type === 'error' ? 'destructive' : 'default'}
              className={cn(
                'py-2.5',
                warning.type === 'warning' &&
                  'border-amber-200 bg-amber-50 text-amber-800 [&>svg]:text-amber-500',
                warning.type === 'info' &&
                  'border-blue-200 bg-blue-50 text-blue-800 [&>svg]:text-blue-500',
              )}
            >
              {warning.type === 'error' ? (
                <AlertTriangle className="h-3.5 w-3.5" />
              ) : warning.type === 'warning' ? (
                <AlertTriangle className="h-3.5 w-3.5" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              <AlertDescription className="text-xs leading-relaxed">
                {warning.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Sous-composants ──────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string
  value: string
  sub: string
  icon: React.ReactNode
  variant: 'success' | 'danger' | 'neutral'
}

function MetricCard({ label, value, sub, icon, variant }: MetricCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-3 space-y-1',
        variant === 'success' && 'border-green-200 bg-green-50',
        variant === 'danger' && 'border-red-200 bg-red-50',
        variant === 'neutral' && 'border-border bg-muted/30',
      )}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            'text-muted-foreground',
            variant === 'success' && 'text-green-600',
            variant === 'danger' && 'text-red-600',
          )}
        >
          {icon}
        </span>
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
      <p
        className={cn(
          'text-lg font-bold leading-none',
          variant === 'success' && 'text-green-700',
          variant === 'danger' && 'text-red-700',
        )}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

interface PlafondIndicatorProps {
  ca: number
  plafond: number
  isExceeded: boolean
}

function PlafondIndicator({ ca, plafond, isExceeded }: PlafondIndicatorProps) {
  const percentage = Math.min((ca / plafond) * 100, 100)

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground font-medium">
          Plafond régime micro-entreprise
        </span>
        <Badge variant={isExceeded ? 'destructive' : 'secondary'} className="text-xs">
          {isExceeded ? 'Dépassé' : `${percentage.toFixed(0)} %`}
        </Badge>
      </div>
      <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isExceeded ? 'bg-destructive' : percentage >= 80 ? 'bg-amber-500' : 'bg-green-500',
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {formatCurrency(ca)} / {formatCurrency(plafond)}
      </p>
    </div>
  )
}
