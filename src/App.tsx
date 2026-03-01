import { BarChart3, Settings, Receipt, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AppHeader } from '@/components/layout/AppHeader'
import { ActivitySelector } from '@/components/calculator/ActivitySelector'
import { RevenueInput } from '@/components/calculator/RevenueInput'
import { OptionsPanel } from '@/components/calculator/OptionsPanel'
import { PurchasesManager } from '@/components/calculator/PurchasesManager'
import { ResultsSummary } from '@/components/calculator/ResultsSummary'
import { UrssafBreakdown } from '@/components/calculator/UrssafBreakdown'
import { TvaSection } from '@/components/calculator/TvaSection'
import { IrSection } from '@/components/calculator/IrSection'
import { useTaxCalculator } from '@/hooks/useTaxCalculator'

export default function App() {
  const {
    config,
    result,
    setActivityType,
    setAnnualCA,
    setMonthlyCA,
    setQuarterlyCA,
    setHasACRE,
    setHasVersementLiberatoire,
    setIsTvaApplicable,
    setTvaRateApplicable,
    addPurchase,
    removePurchase,
  } = useTaxCalculator()

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* ── Colonne gauche : Saisie ──────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Activité & Chiffre d'affaires */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Votre activité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <ActivitySelector
                  value={config.activityType}
                  onChange={setActivityType}
                />

                <Separator />

                <RevenueInput
                  annualCA={config.annualCA}
                  onAnnualCAChange={setAnnualCA}
                  onMonthlyCAChange={setMonthlyCA}
                  onQuarterlyCAChange={setQuarterlyCA}
                />
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  Options fiscales & sociales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OptionsPanel
                  activityType={config.activityType}
                  hasACRE={config.hasACRE}
                  hasVersementLiberatoire={config.hasVersementLiberatoire}
                  isTvaApplicable={config.isTvaApplicable}
                  tvaRateApplicable={config.tvaRateApplicable}
                  onACREChange={setHasACRE}
                  onVersementLiberatoireChange={setHasVersementLiberatoire}
                  onTvaApplicableChange={setIsTvaApplicable}
                  onTvaRateChange={setTvaRateApplicable}
                />
              </CardContent>
            </Card>

            {/* Achats & TVA déductible */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  Achats professionnels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PurchasesManager
                  purchases={config.purchases}
                  onAdd={addPurchase}
                  onRemove={removePurchase}
                />
              </CardContent>
            </Card>
          </div>

          {/* ── Colonne droite : Résultats ───────────────────────────────────── */}
          <div className="space-y-5">

            {result ? (
              <>
                {/* Résumé */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Résumé
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResultsSummary result={result} annualCA={config.annualCA} />
                  </CardContent>
                </Card>

                {/* Détail URSSAF */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Cotisations URSSAF</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UrssafBreakdown
                      result={result}
                      activityType={config.activityType}
                      hasVersementLiberatoire={config.hasVersementLiberatoire}
                      hasACRE={config.hasACRE}
                      annualCA={config.annualCA}
                    />
                  </CardContent>
                </Card>

                {/* TVA */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">TVA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TvaSection
                      result={result}
                      isTvaApplicable={config.isTvaApplicable}
                      tvaRateApplicable={config.tvaRateApplicable}
                    />
                  </CardContent>
                </Card>

                {/* Impôt sur le revenu */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Impôt sur le revenu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <IrSection
                      result={result}
                      annualCA={config.annualCA}
                      hasVersementLiberatoire={config.hasVersementLiberatoire}
                    />
                  </CardContent>
                </Card>
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 pb-6 text-center text-xs text-muted-foreground space-y-1">
          <p>
            Calculs basés sur les taux URSSAF 2025 —{' '}
            <a
              href="https://www.autoentrepreneur.urssaf.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              autoentrepreneur.urssaf.fr
            </a>
          </p>
          <p>
            Ces estimations sont données à titre indicatif et ne remplacent pas le conseil d'un expert-comptable.
          </p>
        </footer>
      </main>
    </div>
  )
}

function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <div className="rounded-full bg-muted p-4">
          <BarChart3 className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Aucun calcul à afficher</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Entrez votre chiffre d'affaires et sélectionnez votre type d'activité pour
            voir le détail de vos charges et taxes.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
