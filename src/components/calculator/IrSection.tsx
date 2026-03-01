import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPercent } from '@/lib/utils'
import type { TaxResult } from '@/types'

const IR_TRANCHES_2025 = [
  { max: 11_497, label: 'Jusqu\'à 11 497 €', rate: 0 },
  { max: 29_315, label: '11 497 € — 29 315 €', rate: 0.11 },
  { max: 83_823, label: '29 315 € — 83 823 €', rate: 0.30 },
  { max: 180_294, label: '83 823 € — 180 294 €', rate: 0.41 },
  { max: Infinity, label: 'Au-delà de 180 294 €', rate: 0.45 },
]

interface IrSectionProps {
  result: TaxResult
  annualCA: number
  hasVersementLiberatoire: boolean
}

export function IrSection({ result, annualCA, hasVersementLiberatoire }: IrSectionProps) {
  if (hasVersementLiberatoire) {
    return (
      <div className="space-y-3">
        <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
          <p className="text-xs text-blue-800">
            <span className="font-semibold">Versement libératoire actif. </span>
            L'IR sur vos revenus professionnels est déjà payé à l'URSSAF au taux de{' '}
            {formatPercent(result.versementLiberatoire / annualCA)}.
            Vous n'avez pas à réintégrer ce revenu dans votre déclaration 2042 C PRO (case préremplie).
          </p>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>IR payé via URSSAF : <span className="font-medium text-foreground">{formatCurrency(result.versementLiberatoire)}</span></p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Calcul de la base imposable */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">Élément</TableHead>
            <TableHead className="text-xs text-right">Montant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-sm">Chiffre d'affaires</TableCell>
            <TableCell className="text-right text-sm">{formatCurrency(annualCA)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-sm">
              <div>Abattement forfaitaire</div>
              <div className="text-xs text-muted-foreground">
                {formatPercent(result.abattementTaux)} (minimum 305 €)
              </div>
            </TableCell>
            <TableCell className="text-right text-sm text-green-600">
              − {formatCurrency(result.abattementMontant)}
            </TableCell>
          </TableRow>
          <TableRow className="font-semibold">
            <TableCell className="text-sm">
              <div>Base imposable estimée</div>
              <div>
                <Badge variant="secondary" className="text-xs mt-0.5">
                  Avant déduction des charges URSSAF
                </Badge>
              </div>
            </TableCell>
            <TableCell className="text-right text-sm font-semibold">
              {formatCurrency(result.baseImposableIR)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Barème progressif */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Barème progressif IR 2025 (part)
        </p>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Tranche</TableHead>
                <TableHead className="text-xs text-right">Taux marginal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {IR_TRANCHES_2025.map((tranche, i) => {
                const isActive =
                  result.baseImposableIR > (i === 0 ? 0 : IR_TRANCHES_2025[i - 1].max) &&
                  result.baseImposableIR > 0

                return (
                  <TableRow
                    key={i}
                    className={isActive ? 'bg-amber-50' : ''}
                  >
                    <TableCell className="text-xs">{tranche.label}</TableCell>
                    <TableCell className="text-right text-xs font-medium">
                      {tranche.rate === 0 ? (
                        <Badge variant="secondary" className="text-xs">Non imposé</Badge>
                      ) : (
                        formatPercent(tranche.rate, 0)
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        <span className="font-medium text-foreground">Note :</span> Le montant final de l'IR dépend de votre quotient familial, de vos autres revenus et déductions. Utilisez{' '}
        <a
          href="https://www.impots.gouv.fr/particulier/simulateur-impot"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          le simulateur impots.gouv.fr
        </a>{' '}
        pour une estimation précise.
      </p>
    </div>
  )
}
