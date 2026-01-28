import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCart } from './useCart'

describe('useCart', () => {
  const unitProduct = { id: '1', name: 'Refresco', type: 'unit', price: 15 }
  const weightedProduct = { id: '2', name: 'Tortillas', type: 'weighted', price: 22 }

  it('starts with an empty cart', () => {
    const { result } = renderHook(() => useCart())
    expect(result.current.cart).toEqual([])
    expect(result.current.total).toBe(0)
  })

  it('adds a unit product to the cart', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addToCart(unitProduct))

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].product_name).toBe('Refresco')
    expect(result.current.cart[0].quantity).toBe(1)
    expect(result.current.cart[0].price_paid).toBe(15)
  })

  it('adds a weighted product with custom price and weight', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addToCart(weightedProduct, 44, 2))

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].price_paid).toBe(44)
    expect(result.current.cart[0].weight_kg).toBe(2)
    expect(result.current.cart[0].quantity).toBeNull()
  })

  it('computes total correctly', () => {
    const { result } = renderHook(() => useCart())
    act(() => {
      result.current.addToCart(unitProduct)
      result.current.addToCart(weightedProduct, 44, 2)
    })

    expect(result.current.total).toBe(15 + 44)
  })

  it('updates quantity of a unit product', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addToCart(unitProduct))

    const itemId = result.current.cart[0].id
    act(() => result.current.updateQuantity(itemId, 2))

    expect(result.current.cart[0].quantity).toBe(3)
    expect(result.current.cart[0].price_paid).toBe(45)
  })

  it('removes item when quantity reaches zero', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addToCart(unitProduct))

    const itemId = result.current.cart[0].id
    act(() => result.current.updateQuantity(itemId, -1))

    expect(result.current.cart).toHaveLength(0)
  })

  it('removes a specific item', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addToCart(unitProduct))
    act(() => result.current.addToCart(weightedProduct, 44, 2))

    expect(result.current.cart).toHaveLength(2)
    const firstId = result.current.cart[0].id
    act(() => result.current.removeItem(firstId))

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].product_name).toBe('Tortillas')
  })

  it('clears the cart', () => {
    const { result } = renderHook(() => useCart())
    act(() => {
      result.current.addToCart(unitProduct)
      result.current.addToCart(unitProduct)
    })

    act(() => result.current.clearCart())

    expect(result.current.cart).toEqual([])
    expect(result.current.total).toBe(0)
  })
})
