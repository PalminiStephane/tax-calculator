import { Info } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { VL_IR_TAUX, VL_IR_RFR_PLAFOND_PAR_PART } from '@/lib/taxRules'
import { cn } from '@/lib/utils'
import type { ActivityType } from '@/types'

interface OptionsPanelProps {
  activityType: ActivityType
  hasACRE: boolean
  hasVersementLiberatoire: boolean
  isTvaApplicable: boolean
  tvaRateApplicable: 5.5 | 10 | 20
  onACREChange: (value: boolean) => void
  onVersementLiberatoireChange: (value: boolean) => void
  onTvaApplicableChange: (value: boolean) => void
  onTvaRateChange: (value: 5.5 | 10 | 20) => void
}

function InfoTip({ content }: { content: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3.5 w-3.5 text-muted-foreground/40 cursor-help shrink-0 hover:text-muted-foreground transition-colors" />
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <p className="text-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function OptionRow({
  label,
  sub,
  tooltip,
  checked,
  onCheckedChange,
  badge,
}: {
  label: string
  sub: string
  tooltip: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
  badge?: string
}) {
  return (
    <div className={cn('data-row', checked && '!border-primary/15')}>
      <div className="flex items-start gap-2 min-w-0 flex-1">
        <InfoTip content={tooltip} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="font-data text-xs text-muted-foreground mt-0.5">{sub}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-4">
        {badge && checked && (
          <span className="font-data text-xs text-primary border border-primary/40 px-2 py-0.5 leading-none">
            {badge}
          </span>
        )}
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      </div>
    </div>
  )
}

export function OptionsPanel({
  activityType,
  hasACRE,
  hasVersementLiberatoire,
  isTvaApplicable,
  tvaRateApplicable,
  onACREChange,
  onVersementLiberatoireChange,
  onTvaApplicableChange,
  onTvaRateChange,
}: OptionsPanelProps) {
  const vlRate = (VL_IR_TAUX[activityType] * 100).toFixed(1)

  return (
    <div>
      <OptionRow
        label="ACRE — 1re année"
        sub="−50 % sur les cotisations sociales"
        tooltip="L'ACRE (Aide aux Créateurs et Repreneurs d'Entreprise) réduit de 50 % vos cotisations sociales pendant la 1re année. Elle est automatique lors de la création d'entreprise."
        checked={hasACRE}
        onCheckedChange={onACREChange}
        badge="−50 %"
      />

      <OptionRow
        label="Versement libératoire IR"
        sub={`IR payé à l'URSSAF — ${vlRate} % du CA`}
        tooltip={`Option permettant de payer l'IR directement à l'URSSAF au taux de ${vlRate} % sur le CA. Éligible si votre RFR de l'avant-dernière année ne dépasse pas ${VL_IR_RFR_PLAFOND_PAR_PART.toLocaleString('fr-FR')} €/part.`}
        checked={hasVersementLiberatoire}
        onCheckedChange={onVersementLiberatoireChange}
        badge={`${vlRate} %`}
      />

      {/* TVA row (more complex — inline) */}
      <div className={cn('py-3 border-b border-border last:border-b-0 space-y-3', isTvaApplicable && '!border-primary/15')}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 min-w-0 flex-1">
            <InfoTip content="Par défaut, les auto-entrepreneurs bénéficient de la franchise en base de TVA (pas de TVA collectée, pas de TVA déductible). Si vous dépassez les seuils ou optez pour la TVA, activez cette option." />
            <div>
              <p className="text-sm font-medium text-foreground">TVA applicable</p>
              <p className="font-data text-xs text-muted-foreground mt-0.5">Hors franchise en base</p>
            </div>
          </div>
          <Switch checked={isTvaApplicable} onCheckedChange={onTvaApplicableChange} />
        </div>

        {isTvaApplicable && (
          <div className="pl-5">
            <p className="mono-label mb-2">Taux de TVA</p>
            <Select
              value={String(tvaRateApplicable)}
              onValueChange={(v) => onTvaRateChange(parseFloat(v) as 5.5 | 10 | 20)}
            >
              <SelectTrigger className="h-8 text-xs font-data">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20 % — Taux normal</SelectItem>
                <SelectItem value="10">10 % — Taux intermédiaire</SelectItem>
                <SelectItem value="5.5">5,5 % — Taux réduit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  )
}
