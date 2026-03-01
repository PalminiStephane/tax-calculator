# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # TypeScript check + Vite production build
npm run preview   # Serve the production build locally
```

> **No lint script is wired up yet** (`npm run lint` references eslint but eslint is not installed). Skip linting or install it before use.

### Adding shadcn/ui components

```bash
npx shadcn@latest add <component-name> --yes
```

> Node 21 is the runtime here. `npm create vite@latest` refuses Node 21 — the project was scaffolded manually. `npx shadcn@latest add` works (produces engine warnings but succeeds).

## Architecture

### Data flow

```
TaxConfig (user inputs)
  └─► calculateTaxes()   →   TaxResult
        ↑ pure function           ↓
   taxRules.ts (constants)   UI components (read-only)
```

All state lives in a single `useTaxCalculator` hook (`src/hooks/useTaxCalculator.ts`). `App.tsx` calls this hook and passes slices down as props — there is no context or global store. `calculateTaxes` is a pure function: given a `TaxConfig`, it returns a `TaxResult` with no side effects.

### Key files to understand first

| File | Role |
|---|---|
| `src/types/index.ts` | All TypeScript types (`ActivityType`, `TaxConfig`, `TaxResult`, `Purchase`) |
| `src/lib/taxRules.ts` | **All fiscal constants** — rates, thresholds, plafonds. Update rates here only. |
| `src/lib/taxCalculator.ts` | Calculation logic in a single `calculateTaxes(config)` function |
| `src/hooks/useTaxCalculator.ts` | React state + setters; bridges UI ↔ calculator |
| `src/App.tsx` | Two-column layout: left = inputs, right = results |

### Fiscal constants (2025) — where they live

Everything is keyed by `ActivityType` in `src/lib/taxRules.ts`:

- `COTISATIONS_TAUX` — cotisations sociales URSSAF
- `ABATTEMENT_TAUX` — abattement forfaitaire IR
- `VL_IR_TAUX` — versement libératoire IR (optional flat-rate income tax paid via URSSAF)
- `CFP_TAUX` — Contribution à la Formation Professionnelle
- `CHAMBRE_TAUX` / `CHAMBRE_LABELS` — TCCI (commerçants) or TCMA (artisans); 0 for BNC
- `CA_PLAFONDS` — plafond de CA pour rester en régime micro-entreprise
- `TVA_SEUILS` — `{ base, majore }` per activity; franchise en base below `base`

### French tax rules implemented (2025)

**5 activity types** and their 2025 cotisations rates:
- BIC Marchandises: 12.30% / abattement 71% / VL-IR 1%
- BIC Services commerciaux: 21.20% / abattement 50% / VL-IR 1.7%
- BIC Services artisanaux: 21.20% / abattement 50% / VL-IR 1.7%
- BNC SSI (libéral non réglementé): 24.60% / abattement 34% / VL-IR 2.2%
- BNC CIPAV (libéral réglementé): 23.20% / abattement 34% / VL-IR 2.2%

**TVA franchise seuils 2025** (Loi n° 2025-1044 du 3 novembre 2025):
- Commerce/Achat-revente: 85 000 € (base) / 93 500 € (majoré)
- Services/Libéral: 37 500 € (base) / 41 250 € (majoré)

**Plafonds CA** (régime micro): 188 700 € (BIC marchandises) / 77 700 € (others)

**ACRE**: 50% reduction on cotisations sociales, first year only.

**Taxe chambre consulaire**: exempt if annual CA < 5 000 €. Only BIC types pay it; BNC pays 0.

**IR barème progressif 2025** (displayed in `IrSection`):
- 0% ≤ 11 497 € / 11% up to 29 315 € / 30% up to 83 823 € / 41% up to 180 294 € / 45% above

### Tailwind / shadcn setup

- **Tailwind v3** with PostCSS (`postcss.config.js` + `tailwind.config.js`). Not v4.
- shadcn components are copied source files in `src/components/ui/` — edit them directly.
- CSS variables for theming are in `src/index.css` under `:root`.
- Path alias `@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`).

### When updating tax rates

1. Edit only `src/lib/taxRules.ts` — change the relevant constant map.
2. Update the year references in `src/lib/taxCalculator.ts` JSDoc and `src/components/calculator/IrSection.tsx` (barème tranches array).
3. The `TaxResult` interface in `src/types/index.ts` rarely needs changing unless new charge types are added.
