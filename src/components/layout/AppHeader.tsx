import { Calculator } from 'lucide-react'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">

          {/* Icon with notched corner */}
          <div
            className="flex items-center justify-center w-11 h-11 bg-primary text-primary-foreground shrink-0"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)' }}
          >
            <Calculator className="h-5 w-5" />
          </div>

          {/* Titles */}
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl leading-none tracking-wider text-foreground">
              CALCULATEUR AUTO-ENTREPRENEUR
            </h1>
            <p className="font-data text-xs tracking-widest text-muted-foreground mt-0.5 uppercase">
              Régime micro-entreprise · France
            </p>
          </div>

          {/* Status badge */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-glow-pulse" />
            <span className="font-data text-xs tracking-widest text-primary font-medium">
              TAUX&nbsp;2025
            </span>
          </div>

        </div>
      </div>

      {/* Gold gradient accent at bottom */}
      <div
        className="absolute bottom-0 left-0 h-px w-1/2"
        style={{ background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, transparent 100%)' }}
      />
    </header>
  )
}
