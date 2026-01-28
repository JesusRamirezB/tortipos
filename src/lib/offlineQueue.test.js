import { describe, it, expect, beforeEach } from 'vitest'
import 'fake-indexeddb/auto'
import { queueSale, getPendingSales, removeSale } from './offlineQueue'
describe('offlineQueue', () => {
  const saleData = {
    local_id: 'SALE-1',
    description: 'Test sale',
    total_amount: 50,
    device_id: 'TEST-DEVICE',
    created_at: '2025-01-01T00:00:00.000Z',
  }

  const cartItems = [
    { product_id: '1', product_name: 'Refresco', quantity: 2, weight_kg: null, price_paid: 30 },
    { product_id: '2', product_name: 'Tortillas', quantity: null, weight_kg: 0.909, price_paid: 20 },
  ]

  beforeEach(async () => {
    // Clear all pending sales
    const sales = await getPendingSales()
    for (const sale of sales) {
      await removeSale(sale.local_id)
    }
  })

  it('queues a sale and retrieves it', async () => {
    await queueSale(saleData, cartItems)
    const pending = await getPendingSales()

    expect(pending).toHaveLength(1)
    expect(pending[0].local_id).toBe('SALE-1')
    expect(pending[0].items).toEqual(cartItems)
    expect(pending[0].total_amount).toBe(50)
  })

  it('removes a sale by local_id', async () => {
    await queueSale(saleData, cartItems)
    await removeSale('SALE-1')
    const pending = await getPendingSales()

    expect(pending).toHaveLength(0)
  })

  it('handles multiple queued sales', async () => {
    await queueSale(saleData, cartItems)
    await queueSale({ ...saleData, local_id: 'SALE-2' }, cartItems)
    const pending = await getPendingSales()

    expect(pending).toHaveLength(2)
  })
})
