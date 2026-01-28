import { useState, useCallback, useRef } from 'react'

export function useCart() {
  const [cart, setCart] = useState([])
  const nextId = useRef(0)

  const addToCart = useCallback((product, customPrice = null, weight = null) => {
    const newItem = {
      id: ++nextId.current,
      product_id: product.id,
      product_name: product.name,
      quantity: product.type === 'unit' ? 1 : null,
      weight_kg: weight,
      price_paid: customPrice || product.price,
      product: product,
    }
    setCart((prev) => [...prev, newItem])
  }, [])

  const updateQuantity = useCallback((itemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId && item.quantity) {
            const newQuantity = Math.max(0, item.quantity + delta)
            if (newQuantity === 0) return null
            return {
              ...item,
              quantity: newQuantity,
              price_paid: item.product.price * newQuantity,
            }
          }
          return item
        })
        .filter(Boolean),
    )
  }, [])

  const removeItem = useCallback((itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId))
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const total = cart.reduce((sum, item) => sum + item.price_paid, 0)

  return { cart, addToCart, updateQuantity, removeItem, clearCart, total }
}
