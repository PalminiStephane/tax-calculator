import { ACTIVITY_LABELS, ACTIVITY_DESCRIPTIONS } from '@/lib/taxRules'
import { cn } from '@/lib/utils'
import type { ActivityType } from '@/types'

interface ActivitySelectorProps {
  value: ActivityType
  onChange: (value: ActivityType) => void
}

const ACTIVITY_TYPES: ActivityType[] = [
  'BIC_MARCHANDISES',
  'BIC_SERVICES_COMMERCIAUX',
  'BIC_SERVICES_ARTISANAUX',
  'BNC_SSI',
  'BNC_CIPAV',
]

const SHORT_LABELS: Record<ActivityType, string> = {
  BIC_MARCHANDISES:        'BIC · MARCHANDS',
  BIC_SERVICES_COMMERCIAUX:'BIC · COMM.',
  BIC_SERVICES_ARTISANAUX: 'BIC · ARTISAN',
  BNC_SSI:                 'BNC · SSI',
  BNC_CIPAV:               'BNC · CIPAV',
}

export function ActivitySelector({ value, onChange }: ActivitySelectorProps) {
  return (
    <div className="space-y-4">
      <p className="mono-label">Type d'activité</p>

      {/* Pill selector */}
      <div className="flex flex-wrap gap-2">
        {ACTIVITY_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={cn(
              value === type ? 'pill-active' : 'pill-inactive',
            )}
          >
            {SHORT_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="border-l-2 border-primary/25 pl-4 space-y-0.5">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {ACTIVITY_DESCRIPTIONS[value]}
        </p>
        <p className="font-data text-xs text-muted-foreground/40 tracking-wide">
          {ACTIVITY_LABELS[value]}
        </p>
      </div>
    </div>
  )
}
