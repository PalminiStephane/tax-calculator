import { useState } from 'react'
import { Plus, Trash2, ShoppingCart } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'
import type { Purchase, TvaRate } from '@/types'

interface PurchasesManagerProps {
  purchases: Purchase[]
  onAdd: (purchase: Omit<Purchase, 'id'>) => void
  onRemove: (id: string) => void
}

const TVA_RATE_OPTIONS: { value: TvaRate; label: string }[] = [
  { value: 20,  label: '20 % — Normal' },
  { value: 10,  label: '10 % — Intermédiaire' },
  { value: 5.5, label: '5,5 % — Réduit' },
  { value: 0,   label: '0 % — Exonéré' },
]

const inputClass =
  'w-full bg-input border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors font-data'

export function PurchasesManager({ purchases, onAdd, onRemove }: PurchasesManagerProps) {
  const [description, setDescription] = useState('')
  const [amountHT, setAmountHT] = useState('')
  const [tvaRate, setTvaRate] = useState<TvaRate>(20)

  const totalHT  = purchases.reduce((s, p) => s + p.amountHT, 0)
  const totalTVA = purchases.reduce((s, p) => s + p.amountHT * (p.tvaRate / 100), 0)

  function handleAdd() {
    const amount = parseFloat(amountHT.replace(',', '.'))
    if (!description.trim() || isNaN(amount) || amount <= 0) return
    onAdd({ description: description.trim(), amountHT: amount, tvaRate })
    setDescription('')
    setAmountHT('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleAdd()
  }

  const canAdd = description.trim() && amountHT && parseFloat(amountHT) > 0

  return (
    <div className="space-y-5">
      {/* Form */}
      <div className="space-y-3">
        <p className="mono-label">Ajouter un achat</p>

        <input
          className={inputClass}
          placeholder="Description — ex : Ordinateur portable"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <input
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              value={amountHT}
              onChange={(e) => setAmountHT(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`${inputClass} pr-8`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-data text-xs text-muted-foreground pointer-events-none">
              €HT
            </span>
          </div>

          <Select
            value={String(tvaRate)}
            onValueChange={(v) => setTvaRate(parseFloat(v) as TvaRate)}
          >
            <SelectTrigger className="h-auto py-2 text-xs font-data">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TVA_RATE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)} className="text-xs font-data">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-primary/40 text-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-data text-xs tracking-widest uppercase"
        >
          <Plus className="h-3.5 w-3.5" />
          Ajouter l'achat
        </button>
      </div>

      {/* Purchase list */}
      {purchases.length > 0 ? (
        <div className="space-y-1">
          <div className="h-px bg-border" />

          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="flex items-center gap-3 px-3 py-2.5 bg-muted/30 border border-border group hover:border-border/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{purchase.description}</p>
                <p className="font-data text-xs text-muted-foreground mt-0.5">
                  {formatCurrency(purchase.amountHT)} HT
                  {purchase.tvaRate > 0 && (
                    <> + {purchase.tvaRate}% TVA = <span className="text-foreground">{formatCurrency(purchase.amountHT * (1 + purchase.tvaRate / 100))} TTC</span></>
                  )}
                </p>
              </div>
              <span className="font-data text-xs text-success shrink-0">
                TVA: {formatCurrency(purchase.amountHT * (purchase.tvaRate / 100))}
              </span>
              <button
                onClick={() => onRemove(purchase.id)}
                className="text-muted-foreground/30 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          <div className="h-px bg-border mt-2" />

          <div className="px-3 pt-2 space-y-1">
            <div className="flex justify-between font-data text-xs text-muted-foreground">
              <span>Total HT des achats</span>
              <span>{formatCurrency(totalHT)}</span>
            </div>
            <div className="flex justify-between font-data text-sm font-medium">
              <span>TVA déductible totale</span>
              <span className="text-success">{formatCurrency(totalTVA)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-6 text-center border border-dashed border-border/40">
          <ShoppingCart className="h-7 w-7 text-muted-foreground/20" />
          <p className="font-data text-xs text-muted-foreground/50 leading-relaxed">
            Aucun achat enregistré.<br />
            Ajoutez vos achats pour calculer la TVA déductible.
          </p>
        </div>
      )}
    </div>
  )
}
