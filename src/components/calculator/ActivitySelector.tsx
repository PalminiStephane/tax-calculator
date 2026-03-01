import { Info } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ACTIVITY_LABELS, ACTIVITY_DESCRIPTIONS } from '@/lib/taxRules'
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

export function ActivitySelector({ value, onChange }: ActivitySelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Label htmlFor="activity-type" className="text-sm font-medium">
          Type d'activité
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p className="text-xs">
                Le type d'activité détermine vos taux de cotisations sociales,
                votre abattement fiscal et vos plafonds de CA.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Select value={value} onValueChange={(v) => onChange(v as ActivityType)}>
        <SelectTrigger id="activity-type" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ACTIVITY_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {ACTIVITY_LABELS[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {ACTIVITY_DESCRIPTIONS[value]}
      </p>
    </div>
  )
}
