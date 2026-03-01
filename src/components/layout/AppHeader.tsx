import { Calculator } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function AppHeader() {
  return (
    <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
          <Calculator className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground leading-tight">
            Calculateur Auto-Entrepreneur
          </h1>
          <p className="text-sm text-muted-foreground">
            Taxes & cotisations France — Régime micro-entreprise
          </p>
        </div>
        <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
          Taux 2025
        </Badge>
      </div>
    </header>
  )
}
