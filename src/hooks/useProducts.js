import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [tortillaProduct, setTortillaProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('name')

      if (error) throw error

      const weightedProducts = data.filter((p) => p.type === 'weighted')
      const otherProducts = data.filter((p) => p.type !== 'weighted')

      const orderedProducts = [...weightedProducts, ...otherProducts]

      setProducts(orderedProducts)
      setTortillaProduct(weightedProducts[0])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  return { products, tortillaProduct, loading, reload: loadProducts }
}
