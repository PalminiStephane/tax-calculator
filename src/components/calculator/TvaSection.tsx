import { ShieldCheck, ShieldAlert, ShieldX, Shield } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { TaxResult } from '@/types'

interface TvaSectionProps {
  result: TaxResult
  isTvaApplicable: boolean
  tvaRateApplicable: number
}

type TvaStatus = 'franchise' | 'depasse_base' | 'depasse_majore' | 'assujetti'

export function TvaSection({ result, isTvaApplicable, tvaRateApplicable }: TvaSectionProps) {
  const {
    isAboveTvaThresholdBase,
    isAboveTvaThresholdMajore,
    tvaThresholdBase,
    tvaThresholdMajore,
  } = result

  const tvaStatus: TvaStatus = isTvaApplicable
    ? 'assujetti'
    : isAboveTvaThresholdMajore
      ? 'depasse_majore'
      : isAboveTvaThresholdBase
        ? 'depasse_base'
        : 'franchise'

  return (
    <div className="space-y-5">

      {/* Status card */}
      <TvaStatusCard
        status={tvaStatus}
        thresholdBase={tvaThresholdBase}
        thresholdMajore={tvaThresholdMajore}
      />

      {/* TVA breakdown */}
      {isTvaApplicable && (
        <div>
          <div className="data-row">
            <p className="text-sm text-muted-foreground flex-1">
              TVA collectée sur CA ({tvaRateApplicable}%)
            </p>
            <span className="mono-val text-destructive">
              + {formatCurrency(result.tvaCollectee)}
            </span>
          </div>

          <div className="data-row">
            <p className="text-sm text-muted-foreground flex-1">TVA déductible sur achats</p>
            <span className="mono-val" style={{ color: '#22D48F' }}>
              − {formatCurrency(result.tvaDeductibleAchats)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t-2 border-primary/30 mt-1">
            <p className="font-data text-sm font-semibold text-primary">TVA NETTE À REVERSER</p>
            <span
              className="font-display text-2xl leading-none"
              style={{ color: result.tvaNette > 0 ? 'hsl(var(--destructive))' : '#22D48F' }}
            >
              {formatCurrency(result.tvaNette)}
            </span>
          </div>
        </div>
      )}

      {/* TVA non récupérable */}
      {!isTvaApplicable && result.tvaDeductibleAchats > 0 && (
        <div
          className="px-3 py-3 border-l-2"
          style={{ borderColor: '#F59E0B', background: 'rgba(245,158,11,0.05)' }}
        >
          <p className="font-data text-xs font-semibold tracking-widest mb-1" style={{ color: '#F59E0B' }}>
            TVA NON RÉCUPÉRABLE
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-foreground">{formatCurrency(result.tvaDeductibleAchats)}</span>{' '}
            de TVA sur vos achats ne peut pas être déduite en franchise en base.
          </p>
        </div>
      )}

      {/* Thresholds */}
      <div className="grid grid-cols-2 gap-3">
        <ThresholdBlock label="Seuil de base 2025"  value={formatCurrency(tvaThresholdBase)} />
        <ThresholdBlock label="Seuil majoré 2025"   value={formatCurrency(tvaThresholdMajore)} />
      </div>
    </div>
  )
}

// ── Status card ────────────────────────────────────────────────────────────────

function getStatusConfig(
  status: TvaStatus,
  thresholdBase: number,
  thresholdMajore: number,
): {
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  label: string
  badge: string
  borderColor: string
  bgColor: string
  textColor: string
  description: string
} {
  switch (status) {
    case 'franchise':
      return {
        Icon: ShieldCheck,
        label: 'FRANCHISE EN BASE',
        badge: 'OK',
        borderColor: '#22D48F',
        bgColor: 'rgba(34,212,143,0.05)',
        textColor: '#22D48F',
        description: `CA sous ${formatCurrency(thresholdBase)}. Mention obligatoire sur factures : "TVA non applicable — art. 293 B du CGI".`,
      }
    case 'depasse_base':
      return {
        Icon: ShieldAlert,
        label: 'SEUIL DE BASE DÉPASSÉ',
        badge: 'ATTENTION',
        borderColor: '#F59E0B',
        bgColor: 'rgba(245,158,11,0.05)',
        textColor: '#F59E0B',
        description: `CA dépasse ${formatCurrency(thresholdBase)}. Si votre CA de l'an passé était aussi supérieur, vous devez facturer la TVA.`,
      }
    case 'depasse_majore':
      return {
        Icon: ShieldX,
        label: 'SEUIL MAJORÉ DÉPASSÉ',
        badge: 'CRITIQUE',
        borderColor: 'hsl(var(--destructive))',
        bgColor: 'hsla(0,82%,60%,0.05)',
        textColor: 'hsl(var(--destructive))',
        description: `CA dépasse ${formatCurrency(thresholdMajore)}. TVA obligatoire dès le jour du dépassement.`,
      }
    case 'assujetti':
      return {
        Icon: Shield,
        label: 'ASSUJETTI À LA TVA',
        badge: 'ACTIF',
        borderColor: 'hsl(var(--primary))',
        bgColor: 'hsla(44,95%,52%,0.05)',
        textColor: 'hsl(var(--primary))',
        description: 'Vous collectez la TVA et pouvez déduire la TVA sur vos achats professionnels.',
      }
  }
}

function TvaStatusCard({
  status,
  thresholdBase,
  thresholdMajore,
}: {
  status: TvaStatus
  thresholdBase: number
  thresholdMajore: number
}) {
  const cfg = getStatusConfig(status, thresholdBase, thresholdMajore)
  const { Icon } = cfg

  return (
    <div
      className="flex gap-3 px-4 py-3 border-l-2"
      style={{ borderColor: cfg.borderColor, background: cfg.bgColor }}
    >
      <Icon className="h-4 w-4 shrink-0 mt-0.5" style={{ color: cfg.textColor }} />
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-data text-xs font-semibold tracking-widest" style={{ color: cfg.textColor }}>
            {cfg.label}
          </span>
          <span
            className="font-data text-xs border px-1.5 py-px leading-none"
            style={{ borderColor: cfg.borderColor, color: cfg.textColor }}
          >
            {cfg.badge}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{cfg.description}</p>
      </div>
    </div>
  )
}

// ── Threshold block ────────────────────────────────────────────────────────────

function ThresholdBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border px-3 py-2">
      <p className="mono-label text-muted-foreground/50 mb-1">{label}</p>
      <p className="font-data text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}
