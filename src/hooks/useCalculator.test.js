import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCalculator } from './useCalculator'

describe('useCalculator', () => {
  const tortillaProduct = { id: '1', name: 'Tortillas', type: 'weighted', price: 22 }

  it('starts closed with empty value', () => {
    const addToCart = vi.fn()
    const { result } = renderHook(() => useCalculator(tortillaProduct, addToCart))

    expect(result.current.show).toBe(false)
    expect(result.current.value).toBe('')
    expect(result.current.mode).toBe('pesos')
  })

  it('opens and resets state', () => {
    const addToCart = vi.fn()
    const { result } = renderHook(() => useCalculator(tortillaProduct, addToCart))

    act(() => result.current.open())
    expect(result.current.show).toBe(true)
    expect(result.current.value).toBe('')
    expect(result.current.mode).toBe('pesos')
  })

  it('closes and resets value', () => {
    const addToCart = vi.fn()
    const { result } = renderHook(() => useCalculator(tortillaProduct, addToCart))

    act(() => result.current.open())
    act(() => result.current.setValue('50'))
    act(() => result.current.close())

    expect(result.current.show).toBe(false)
    expect(result.current.value).toBe('')
  })

  it('adds in pesos mode — calculates weight from price', () => {
    const addToCart = vi.fn()
    const { result } = renderHook(() => useCalculator(tortillaProduct, addToCart))

    act(() => result.current.open())
    act(() => result.current.setValue('44'))
    act(() => result.current.handleAdd())

    expect(addToCart).toHaveBeenCalledWith(tortillaProduct, 44, 2)
    expect(result.current.show).toBe(false)
  })

  it('adds in kg mode — calculates price from weight', () => {
    const addToCart = vi.fn()
    const { result } = renderHook(() => useCalculator(tortillaProduct, addToCart))

    act(() => result.current.open())
    act(() => result.current.setMode('kg'))
    act(() => result.current.setValue('2'))
    act(() => result.current.handleAdd())

    expect(addToCart).toHaveBeenCalledWith(tortillaProduct, 44, 2)
    expect(result.current.show).toBe(false)
  })

  it('does nothing when value is empty', () => {
    const addToCart = vi.fn()
    const { result } = renderHook(() => useCalculator(tortillaProduct, addToCart))

    act(() => result.current.handleAdd())
    expect(addToCart).not.toHaveBeenCalled()
  })

  it('does nothing when value is zero', () => {
    const addToCart = vi.fn()
    const { result } = renderHook(() => useCalculator(tortillaProduct, addToCart))

    act(() => result.current.setValue('0'))
    act(() => result.current.handleAdd())
    expect(addToCart).not.toHaveBeenCalled()
  })
})
