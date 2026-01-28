import { useState, useCallback } from 'react'

export function useCalculator(tortillaProduct, addToCart) {
  const [show, setShow] = useState(false)
  const [value, setValue] = useState('')
  const [mode, setMode] = useState('pesos')

  const open = useCallback(() => {
    setShow(true)
    setValue('')
    setMode('pesos')
  }, [])

  const close = useCallback(() => {
    setShow(false)
    setValue('')
  }, [])

  const handleAdd = useCallback(() => {
    if (!tortillaProduct || !value) return

    const parsed = parseFloat(value)
    if (parsed <= 0) return

    if (mode === 'pesos') {
      const weight = parsed / tortillaProduct.price
      addToCart(tortillaProduct, parsed, weight)
    } else {
      const price = parsed * tortillaProduct.price
      addToCart(tortillaProduct, price, parsed)
    }

    setShow(false)
    setValue('')
  }, [tortillaProduct, value, mode, addToCart])

  return { show, value, mode, setValue, setMode, open, close, handleAdd }
}
