import { BarChart3 } from 'lucide-react'
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

// ── Panel wrapper ──────────────────────────────────────────────────────────────

function Panel({
  number,
  title,
  children,
  className = '',
}: {
  number: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`chad-panel animate-rise ${className}`}>
      {/* Header */}
      <div className="panel-header">
        <span className="sec-num">{number}</span>
        <div className="h-4 w-px bg-border" />
        <span className="mono-label">{title}</span>
      </div>

      {/* Body */}
      <div className="p-5">{children}</div>
    </div>
  )
}

// ── App ────────────────────────────────────────────────────────────────────────

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
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero bar */}
        <div className="mb-8 flex items-center gap-5">
          <p className="font-display text-5xl text-muted-foreground/20 leading-none tracking-widest select-none">
            SIMULATION
          </p>
          <div
            className="h-px flex-1"
            style={{ background: 'linear-gradient(90deg, hsl(var(--border)) 0%, transparent 100%)' }}
          />
          <span className="mono-label text-muted-foreground/50">ESTIMATIONS INDICATIVES</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* ── Colonne gauche : Saisie ──────────────────────────────── */}
          <div className="space-y-5">
            <Panel number="01" title="Activité & Chiffre d'affaires">
              <ActivitySelector
                value={config.activityType}
                onChange={setActivityType}
              />
              <div className="h-px bg-border my-5" />
              <RevenueInput
                annualCA={config.annualCA}
                onAnnualCAChange={setAnnualCA}
                onMonthlyCAChange={setMonthlyCA}
                onQuarterlyCAChange={setQuarterlyCA}
              />
            </Panel>

            <Panel number="02" title="Options fiscales & sociales">
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
            </Panel>

            <Panel number="03" title="Achats professionnels">
              <PurchasesManager
                purchases={config.purchases}
                onAdd={addPurchase}
                onRemove={removePurchase}
              />
            </Panel>
          </div>

          {/* ── Colonne droite : Résultats ───────────────────────────── */}
          <div className="space-y-5">
            {result ? (
              <>
                <Panel number="04" title="Résumé">
                  <ResultsSummary result={result} annualCA={config.annualCA} />
                </Panel>

                <Panel number="05" title="Cotisations URSSAF">
                  <UrssafBreakdown
                    result={result}
                    activityType={config.activityType}
                    hasVersementLiberatoire={config.hasVersementLiberatoire}
                    hasACRE={config.hasACRE}
                    annualCA={config.annualCA}
                  />
                </Panel>

                <Panel number="06" title="TVA">
                  <TvaSection
                    result={result}
                    isTvaApplicable={config.isTvaApplicable}
                    tvaRateApplicable={config.tvaRateApplicable}
                  />
                </Panel>

                <Panel number="07" title="Impôt sur le revenu">
                  <IrSection
                    result={result}
                    annualCA={config.annualCA}
                    hasVersementLiberatoire={config.hasVersementLiberatoire}
                  />
                </Panel>
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pb-8 pt-6 border-t border-border">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="font-data text-xs text-muted-foreground space-y-1">
              <p>
                Calculs basés sur les taux URSSAF 2025 —{' '}
                <a
                  href="https://www.autoentrepreneur.urssaf.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  autoentrepreneur.urssaf.fr
                </a>
              </p>
              <p className="text-muted-foreground/60">
                Estimations à titre indicatif — non substituables au conseil d'un expert-comptable.
              </p>
            </div>
            <p className="font-display text-sm tracking-widest text-muted-foreground/20 select-none">
              TITAN · TAX CALCULATOR
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="chad-panel border-dashed border-border/50 min-h-72 flex flex-col items-center justify-center gap-6 p-8">
      <div className="relative">
        <div
          className="w-16 h-16 border border-border flex items-center justify-center"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)' }}
        >
          <BarChart3 className="h-7 w-7 text-muted-foreground/30" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 border border-primary/30" />
      </div>

      <div className="text-center space-y-2">
        <p className="font-display text-2xl text-muted-foreground/40 tracking-widest">
          EN ATTENTE DE DONNÉES
        </p>
        <p className="font-data text-xs text-muted-foreground max-w-[260px] leading-relaxed">
          Entrez votre CA et sélectionnez votre type d'activité pour voir le détail de vos charges.
        </p>
        <span className="inline-block font-data text-primary/60 text-xs animate-blink">_</span>
      </div>
    </div>
  )
}
