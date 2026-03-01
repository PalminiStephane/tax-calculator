import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { cn, formatCurrency } from '@/lib/utils'
import type { TaxResult } from '@/types'

interface TvaSectionProps {
  result: TaxResult
  isTvaApplicable: boolean
  tvaRateApplicable: number
}

export function TvaSection({ result, isTvaApplicable, tvaRateApplicable }: TvaSectionProps) {
  const { isAboveTvaThresholdBase, isAboveTvaThresholdMajore, tvaThresholdBase, tvaThresholdMajore } = result

  // Statut de franchise TVA
  const tvaStatus = isTvaApplicable
    ? 'assujetti'
    : isAboveTvaThresholdMajore
      ? 'depasse_majore'
      : isAboveTvaThresholdBase
        ? 'depasse_base'
        : 'franchise'

  return (
    <div className="space-y-4">
      {/* Statut franchise */}
      <TvaStatusCard
        status={tvaStatus}
        thresholdBase={tvaThresholdBase}
        thresholdMajore={tvaThresholdMajore}
      />

      {/* Tableau TVA si applicable */}
      {isTvaApplicable && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Élément</TableHead>
              <TableHead className="text-xs text-right">Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-sm">
                TVA collectée sur CA ({tvaRateApplicable} %)
              </TableCell>
              <TableCell className="text-right text-sm text-red-600 font-medium">
                + {formatCurrency(result.tvaCollectee)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-sm">
                TVA déductible sur achats
              </TableCell>
              <TableCell className="text-right text-sm text-green-600 font-medium">
                − {formatCurrency(result.tvaDeductibleAchats)}
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-sm font-semibold">TVA nette à reverser</TableCell>
              <TableCell
                className={cn(
                  'text-right text-sm font-semibold',
                  result.tvaNette > 0 ? 'text-red-600' : 'text-green-600',
                )}
              >
                {formatCurrency(result.tvaNette)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}

      {/* TVA déductible seulement (franchise + achats) */}
      {!isTvaApplicable && result.tvaDeductibleAchats > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs text-amber-800">
            <span className="font-semibold">TVA sur achats : </span>
            {formatCurrency(result.tvaDeductibleAchats)} non récupérable en franchise.
            La TVA payée sur vos achats professionnels n'est pas déductible tant que vous êtes en franchise en base.
          </p>
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          Seuil de base 2025 :{' '}
          <span className="font-medium text-foreground">
            {formatCurrency(tvaThresholdBase)}
          </span>
        </p>
        <p>
          Seuil majoré 2025 :{' '}
          <span className="font-medium text-foreground">
            {formatCurrency(tvaThresholdMajore)}
          </span>
        </p>
      </div>
    </div>
  )
}

// ─── Sous-composant statut TVA ─────────────────────────────────────────────────

type TvaStatus = 'franchise' | 'depasse_base' | 'depasse_majore' | 'assujetti'

function TvaStatusCard({
  status,
  thresholdBase,
  thresholdMajore,
}: {
  status: TvaStatus
  thresholdBase: number
  thresholdMajore: number
}) {
  const config = {
    franchise: {
      icon: <ShieldCheck className="h-4 w-4" />,
      label: 'Franchise en base de TVA',
      description: `Vous n'êtes pas assujetti à la TVA (CA sous ${formatCurrency(thresholdBase)}). Mention obligatoire sur les factures : "TVA non applicable — art. 293 B du CGI".`,
      badgeVariant: 'secondary' as const,
      bgClass: 'bg-green-50 border-green-200',
      textClass: 'text-green-800',
      iconClass: 'text-green-600',
    },
    depasse_base: {
      icon: <ShieldAlert className="h-4 w-4" />,
      label: 'Seuil de base dépassé',
      description: `Votre CA dépasse ${formatCurrency(thresholdBase)}. Si votre CA de l'an passé était aussi supérieur, vous devez facturer la TVA cette année.`,
      badgeVariant: 'secondary' as const,
      bgClass: 'bg-amber-50 border-amber-200',
      textClass: 'text-amber-800',
      iconClass: 'text-amber-600',
    },
    depasse_majore: {
      icon: <ShieldX className="h-4 w-4" />,
      label: 'Seuil majoré dépassé',
      description: `Votre CA dépasse ${formatCurrency(thresholdMajore)}. La TVA est obligatoire dès le jour du dépassement.`,
      badgeVariant: 'destructive' as const,
      bgClass: 'bg-red-50 border-red-200',
      textClass: 'text-red-800',
      iconClass: 'text-red-600',
    },
    assujetti: {
      icon: <ShieldAlert className="h-4 w-4" />,
      label: 'Assujetti à la TVA',
      description: 'Vous collectez la TVA et pouvez déduire la TVA sur vos achats professionnels.',
      badgeVariant: 'default' as const,
      bgClass: 'bg-blue-50 border-blue-200',
      textClass: 'text-blue-800',
      iconClass: 'text-blue-600',
    },
  }[status]

  return (
    <div className={cn('rounded-md border p-3 flex gap-3', config.bgClass)}>
      <span className={cn('mt-0.5 shrink-0', config.iconClass)}>{config.icon}</span>
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('text-sm font-semibold', config.textClass)}>
            {config.label}
          </span>
          <Badge variant={config.badgeVariant} className="text-xs">
            {status === 'franchise' ? 'OK' : status === 'assujetti' ? 'Activée' : 'Attention'}
          </Badge>
        </div>
        <p className={cn('text-xs leading-relaxed', config.textClass)}>
          {config.description}
        </p>
      </div>
    </div>
  )
}
