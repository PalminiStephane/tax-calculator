import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { formatCurrency, formatPercent } from '@/lib/utils'
import type { TaxResult } from '@/types'

interface ResultsSummaryProps {
  result: TaxResult
  annualCA: number
}

export function ResultsSummary({ result, annualCA }: ResultsSummaryProps) {
  const chargesPercent = annualCA > 0 ? result.totalURSSAF / annualCA : 0
  const isPositive = result.revenueNet >= 0

  return (
    <div className="space-y-6">

      {/* ── Hero metric: Revenu net ────────────────────────────── */}
      <div>
        <p className="mono-label mb-2">Revenu net estimé</p>
        <div
          className="metric-hero"
          style={{ color: isPositive ? '#22D48F' : 'hsl(var(--destructive))' }}
        >
          {formatCurrency(result.revenueNet)}
        </div>
        <p className="font-data text-sm text-muted-foreground mt-1">
          {formatPercent(result.revenueNetPercent)} du chiffre d'affaires
        </p>
      </div>

      <div className="h-px bg-border" />

      {/* ── Total charges URSSAF ────────────────────────────────── */}
      <div>
        <p className="mono-label mb-2">Total charges URSSAF</p>
        <div className="font-display text-4xl text-destructive leading-none">
          {formatCurrency(result.totalURSSAF)}
        </div>
        <p className="font-data text-sm text-muted-foreground mt-1">
          {formatPercent(chargesPercent)} du chiffre d'affaires
        </p>
      </div>

      <div className="h-px bg-border" />

      {/* ── Plafond indicator ───────────────────────────────────── */}
      <PlafondIndicator
        ca={annualCA}
        plafond={result.caPlafond}
        isExceeded={result.isAboveCaPlafond}
      />

      {/* ── Warnings ────────────────────────────────────────────── */}
      {result.warnings.length > 0 && (
        <div className="space-y-2">
          {result.warnings.map((warning, i) => (
            <WarningBanner key={i} type={warning.type} message={warning.message} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Plafond bar ────────────────────────────────────────────────────────────────

function PlafondIndicator({
  ca,
  plafond,
  isExceeded,
}: {
  ca: number
  plafond: number
  isExceeded: boolean
}) {
  const pct = Math.min((ca / plafond) * 100, 100)
  const barColor = isExceeded
    ? 'hsl(var(--destructive))'
    : pct >= 80
      ? '#F59E0B'
      : '#22D48F'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="mono-label">Plafond micro-entreprise</p>
        <span
          className="font-data text-xs border px-2 py-0.5 leading-none"
          style={{
            borderColor: isExceeded ? 'hsl(var(--destructive))' : 'hsl(var(--border))',
            color: isExceeded ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))',
          }}
        >
          {isExceeded ? 'DÉPASSÉ' : `${pct.toFixed(0)} %`}
        </span>
      </div>

      {/* Track */}
      <div className="bar-track">
        <div
          className="bar-fill"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>

      <div className="flex justify-between font-data text-xs text-muted-foreground">
        <span>{formatCurrency(ca)}</span>
        <span className="text-muted-foreground/50">/ {formatCurrency(plafond)}</span>
      </div>
    </div>
  )
}

// ── Warning banner ─────────────────────────────────────────────────────────────

const WARNING_CONFIG = {
  error: {
    Icon: XCircle,
    borderColor: 'hsl(var(--destructive))',
    bgColor: 'hsla(0, 82%, 60%, 0.06)',
    textColor: 'hsl(var(--destructive))',
    label: 'ERREUR',
  },
  warning: {
    Icon: AlertTriangle,
    borderColor: '#F59E0B',
    bgColor: 'rgba(245,158,11,0.06)',
    textColor: '#F59E0B',
    label: 'ATTENTION',
  },
  info: {
    Icon: CheckCircle2,
    borderColor: 'hsl(var(--primary))',
    bgColor: 'hsla(44,95%,52%,0.05)',
    textColor: 'hsl(var(--primary))',
    label: 'INFO',
  },
} as const

function WarningBanner({ type, message }: { type: 'error' | 'warning' | 'info'; message: string }) {
  const cfg = WARNING_CONFIG[type]
  const { Icon } = cfg
  return (
    <div
      className="flex gap-3 px-3 py-3 border-l-2"
      style={{ borderColor: cfg.borderColor, background: cfg.bgColor }}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: cfg.textColor }} />
      <div>
        <p
          className="font-data text-xs font-semibold tracking-widest mb-0.5"
          style={{ color: cfg.textColor }}
        >
          {cfg.label}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
      </div>
    </div>
  )
}
