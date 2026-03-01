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
import { formatCurrency, formatPercent } from '@/lib/utils'
import { CHAMBRE_LABELS } from '@/lib/taxRules'
import type { TaxResult, ActivityType } from '@/types'

interface UrssafBreakdownProps {
  result: TaxResult
  activityType: ActivityType
  hasVersementLiberatoire: boolean
  hasACRE: boolean
  annualCA: number
}

export function UrssafBreakdown({
  result,
  activityType,
  hasVersementLiberatoire,
  hasACRE,
  annualCA,
}: UrssafBreakdownProps) {
  const chambreLabel = CHAMBRE_LABELS[activityType]

  return (
    <div className="space-y-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">Charge</TableHead>
            <TableHead className="text-xs text-right">Taux</TableHead>
            <TableHead className="text-xs text-right">Montant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-sm">
              <div>Cotisations sociales</div>
              {hasACRE && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                    ACRE −50 %
                  </Badge>
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPercent(result.tauxCotisationsBase)}
                  </span>
                </div>
              )}
            </TableCell>
            <TableCell className="text-right text-sm font-medium">
              {formatPercent(result.tauxCotisationsEffectif)}
            </TableCell>
            <TableCell className="text-right text-sm font-medium">
              {formatCurrency(result.cotisationsSociales)}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-sm text-muted-foreground">
              Formation professionnelle (CFP)
            </TableCell>
            <TableCell className="text-right text-xs text-muted-foreground">
              {formatPercent(result.cfp / annualCA)}
            </TableCell>
            <TableCell className="text-right text-sm">
              {formatCurrency(result.cfp)}
            </TableCell>
          </TableRow>

          {result.tcciTcma > 0 && chambreLabel && (
            <TableRow>
              <TableCell className="text-sm text-muted-foreground">
                Taxe chambre consulaire ({chambreLabel})
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                {formatPercent(result.tcciTcma / annualCA)}
              </TableCell>
              <TableCell className="text-right text-sm">
                {formatCurrency(result.tcciTcma)}
              </TableCell>
            </TableRow>
          )}

          {hasVersementLiberatoire && (
            <TableRow>
              <TableCell className="text-sm">
                <div>Versement libératoire IR</div>
                <div className="text-xs text-muted-foreground">Impôt sur le revenu payé à l'URSSAF</div>
              </TableCell>
              <TableCell className="text-right text-sm font-medium">
                {formatPercent(result.versementLiberatoire / annualCA)}
              </TableCell>
              <TableCell className="text-right text-sm font-medium">
                {formatCurrency(result.versementLiberatoire)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="text-sm font-semibold">Total URSSAF</TableCell>
            <TableCell className="text-right text-sm font-semibold">
              {formatPercent(result.tauxTotalURSSAF)}
            </TableCell>
            <TableCell className="text-right text-sm font-semibold">
              {formatCurrency(result.totalURSSAF)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <p className="text-xs text-muted-foreground text-right">
        Déclaration{' '}
        <a
          href="https://www.autoentrepreneur.urssaf.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          autoentrepreneur.urssaf.fr
        </a>
      </p>
    </div>
  )
}
