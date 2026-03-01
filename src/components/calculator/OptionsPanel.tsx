import { Info } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { VL_IR_TAUX, VL_IR_RFR_PLAFOND_PAR_PART } from '@/lib/taxRules'
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

function InfoTooltip({ content }: { content: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help shrink-0" />
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <p className="text-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
    <div className="space-y-4">
      {/* ACRE */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-1.5 min-w-0">
          <div className="pt-0.5">
            <InfoTooltip content="L'ACRE (Aide aux Créateurs et Repreneurs d'Entreprise) réduit de 50 % vos cotisations sociales pendant la 1re année. Elle est automatique lors de la création d'entreprise." />
          </div>
          <div className="min-w-0">
            <Label htmlFor="acre" className="text-sm font-medium cursor-pointer">
              ACRE (1re année)
            </Label>
            <p className="text-xs text-muted-foreground">
              −50 % sur les cotisations sociales
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {hasACRE && (
            <Badge variant="secondary" className="text-xs whitespace-nowrap">
              −50 %
            </Badge>
          )}
          <Switch id="acre" checked={hasACRE} onCheckedChange={onACREChange} />
        </div>
      </div>

      <Separator />

      {/* Versement libératoire */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-1.5 min-w-0">
          <div className="pt-0.5">
            <InfoTooltip
              content={`Option permettant de payer l'IR directement à l'URSSAF au taux de ${vlRate} % sur le CA. Éligible si votre RFR de l'avant-dernière année ne dépasse pas ${VL_IR_RFR_PLAFOND_PAR_PART.toLocaleString('fr-FR')} €/part.`}
            />
          </div>
          <div className="min-w-0">
            <Label htmlFor="vl-ir" className="text-sm font-medium cursor-pointer">
              Versement libératoire IR
            </Label>
            <p className="text-xs text-muted-foreground">
              IR payé à l'URSSAF au taux de {vlRate} %
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {hasVersementLiberatoire && (
            <Badge variant="secondary" className="text-xs whitespace-nowrap">
              {vlRate} %
            </Badge>
          )}
          <Switch
            id="vl-ir"
            checked={hasVersementLiberatoire}
            onCheckedChange={onVersementLiberatoireChange}
          />
        </div>
      </div>

      <Separator />

      {/* TVA */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-1.5 min-w-0">
          <div className="pt-0.5">
            <InfoTooltip content="Par défaut, les auto-entrepreneurs bénéficient de la franchise en base de TVA (pas de TVA collectée, pas de TVA déductible). Si vous dépassez les seuils ou optez pour la TVA, activez cette option." />
          </div>
          <div className="min-w-0">
            <Label htmlFor="tva" className="text-sm font-medium cursor-pointer">
              TVA applicable
            </Label>
            <p className="text-xs text-muted-foreground">
              Hors franchise en base
            </p>
          </div>
        </div>
        <Switch
          id="tva"
          checked={isTvaApplicable}
          onCheckedChange={onTvaApplicableChange}
        />
      </div>

      {isTvaApplicable && (
        <div className="ml-5 space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Taux de TVA appliqué
          </Label>
          <Select
            value={String(tvaRateApplicable)}
            onValueChange={(v) => onTvaRateChange(parseFloat(v) as 5.5 | 10 | 20)}
          >
            <SelectTrigger className="w-full h-8 text-xs">
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
  )
}
