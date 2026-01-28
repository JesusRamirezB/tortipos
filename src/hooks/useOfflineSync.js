import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getPendingSales, removeSale } from '../lib/offlineQueue'

export function useOfflineSync(showToast) {
  const [pendingCount, setPendingCount] = useState(0)

  const syncPending = useCallback(async () => {
    let sales
    try {
      sales = await getPendingSales()
    } catch {
      return
    }

    setPendingCount(sales.length)
    if (sales.length === 0) return

    for (const sale of sales) {
      try {
        const { items, ...saleData } = sale

        const { data: savedSale, error: saleError } = await supabase
          .from('sales')
          .insert(saleData)
          .select()
          .single()

        if (saleError) throw saleError

        const saleItems = items.map((item) => ({
          sale_id: savedSale.id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          weight_kg: item.weight_kg,
          price_paid: item.price_paid,
        }))

        const { error: itemsError } = await supabase.from('sale_items').insert(saleItems)

        if (itemsError) throw itemsError

        await removeSale(sale.local_id)
        setPendingCount((prev) => prev - 1)
      } catch {
        // Will retry on next sync
      }
    }
  }, [])

  const refreshCount = useCallback(async () => {
    try {
      const sales = await getPendingSales()
      setPendingCount(sales.length)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    syncPending()

    const handleOnline = () => {
      if (showToast) showToast('Conexión restaurada, sincronizando...', 'info')
      syncPending()
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [syncPending, showToast])

  return { pendingCount, syncPending, refreshCount }
}
