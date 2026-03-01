import { useState } from 'react'
import { PlusCircle, Trash2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'
import type { Purchase, TvaRate } from '@/types'

interface PurchasesManagerProps {
  purchases: Purchase[]
  onAdd: (purchase: Omit<Purchase, 'id'>) => void
  onRemove: (id: string) => void
}

const TVA_RATE_OPTIONS: { value: TvaRate; label: string }[] = [
  { value: 20, label: '20 % — Normal' },
  { value: 10, label: '10 % — Intermédiaire' },
  { value: 5.5, label: '5,5 % — Réduit' },
  { value: 0, label: '0 % — Exonéré / Non soumis' },
]

export function PurchasesManager({ purchases, onAdd, onRemove }: PurchasesManagerProps) {
  const [description, setDescription] = useState('')
  const [amountHT, setAmountHT] = useState('')
  const [tvaRate, setTvaRate] = useState<TvaRate>(20)

  const totalHT = purchases.reduce((s, p) => s + p.amountHT, 0)
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

  return (
    <div className="space-y-4">
      {/* Formulaire d'ajout */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Description</Label>
          <Input
            placeholder="Ex : Ordinateur portable, logiciel..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Montant HT (€)
            </Label>
            <div className="relative">
              <Input
                type="number"
                min={0}
                step={0.01}
                placeholder="0,00"
                value={amountHT}
                onChange={(e) => setAmountHT(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8 text-sm pr-6"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                €
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Taux TVA
            </Label>
            <Select
              value={String(tvaRate)}
              onValueChange={(v) => setTvaRate(parseFloat(v) as TvaRate)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TVA_RATE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleAdd}
          variant="outline"
          size="sm"
          className="w-full gap-2"
          disabled={!description.trim() || !amountHT || parseFloat(amountHT) <= 0}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Ajouter l'achat
        </Button>
      </div>

      {/* Liste des achats */}
      {purchases.length > 0 ? (
        <div className="space-y-3">
          <Separator />
          <div className="space-y-2">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center gap-2 rounded-md border px-3 py-2 bg-muted/30"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{purchase.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(purchase.amountHT)} HT
                    {purchase.tvaRate > 0 && (
                      <>
                        {' '}+ {purchase.tvaRate} % TVA
                        {' '}={' '}
                        <span className="text-foreground font-medium">
                          {formatCurrency(purchase.amountHT * (1 + purchase.tvaRate / 100))} TTC
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    TVA : {formatCurrency(purchase.amountHT * (purchase.tvaRate / 100))}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => onRemove(purchase.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-1 px-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Total HT des achats</span>
              <span>{formatCurrency(totalHT)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span>TVA déductible totale</span>
              <span className="text-green-600">{formatCurrency(totalTVA)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <ShoppingCart className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground">
            Aucun achat enregistré.
            <br />
            Ajoutez vos achats professionnels pour calculer la TVA déductible.
          </p>
        </div>
      )}
    </div>
  )
}
