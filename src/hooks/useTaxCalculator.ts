import { useState, useMemo } from 'react'
import type { TaxConfig, Purchase, ActivityType, TvaRate } from '../types'
import { calculateTaxes } from '../lib/taxCalculator'

const DEFAULT_CONFIG: TaxConfig = {
  annualCA: 0,
  activityType: 'BNC_SSI',
  hasACRE: false,
  hasVersementLiberatoire: false,
  isTvaApplicable: false,
  tvaRateApplicable: 20,
  purchases: [],
}

export function useTaxCalculator() {
  const [config, setConfig] = useState<TaxConfig>(DEFAULT_CONFIG)

  const result = useMemo(() => {
    if (config.annualCA <= 0) return null
    return calculateTaxes(config)
  }, [config])

  function setActivityType(activityType: ActivityType) {
    setConfig((prev) => ({ ...prev, activityType }))
  }

  function setAnnualCA(annualCA: number) {
    setConfig((prev) => ({ ...prev, annualCA }))
  }

  function setHasACRE(hasACRE: boolean) {
    setConfig((prev) => ({ ...prev, hasACRE }))
  }

  function setHasVersementLiberatoire(hasVersementLiberatoire: boolean) {
    setConfig((prev) => ({ ...prev, hasVersementLiberatoire }))
  }

  function setIsTvaApplicable(isTvaApplicable: boolean) {
    setConfig((prev) => ({ ...prev, isTvaApplicable }))
  }

  function setTvaRateApplicable(tvaRateApplicable: 5.5 | 10 | 20) {
    setConfig((prev) => ({ ...prev, tvaRateApplicable }))
  }

  function addPurchase(purchase: Omit<Purchase, 'id'>) {
    const newPurchase: Purchase = {
      ...purchase,
      id: crypto.randomUUID(),
    }
    setConfig((prev) => ({
      ...prev,
      purchases: [...prev.purchases, newPurchase],
    }))
  }

  function removePurchase(id: string) {
    setConfig((prev) => ({
      ...prev,
      purchases: prev.purchases.filter((p) => p.id !== id),
    }))
  }

  function updatePurchase(id: string, updates: Partial<Omit<Purchase, 'id'>>) {
    setConfig((prev) => ({
      ...prev,
      purchases: prev.purchases.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      ),
    }))
  }

  // Conversion mensuel → annuel
  function setMonthlyCA(monthlyCA: number) {
    setAnnualCA(monthlyCA * 12)
  }

  function setQuarterlyCA(quarterlyCA: number) {
    setAnnualCA(quarterlyCA * 4)
  }

  return {
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
    updatePurchase,
  }
}

export type TaxCalculatorHook = ReturnType<typeof useTaxCalculator>
export type { TvaRate }
