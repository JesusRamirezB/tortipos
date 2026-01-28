import { useState } from 'react'
import { supabase } from './lib/supabase'
import { queueSale } from './lib/offlineQueue'
import { useProducts } from './hooks/useProducts'
import { useCart } from './hooks/useCart'
import { useCalculator } from './hooks/useCalculator'
import { useToast } from './hooks/useToast'
import { useOfflineSync } from './hooks/useOfflineSync'
import Calculator from './components/Calculator'
import Cart from './components/Cart'
import ProductGrid from './components/ProductGrid'
import ToastContainer from './components/Toast'
import './App.css'

function App() {
  const { products, tortillaProduct, loading } = useProducts()
  const { cart, addToCart, updateQuantity, removeItem, clearCart, total } = useCart()
  const calculator = useCalculator(tortillaProduct, addToCart)
  const { toasts, showToast, removeToast } = useToast()
  const [checkingOut, setCheckingOut] = useState(false)
  const { pendingCount, refreshCount } = useOfflineSync(showToast)

  const handleProductClick = (product) => {
    if (product.type === 'weighted') {
      calculator.open()
    } else {
      addToCart(product)
    }
  }

  const handleCheckout = async () => {
    if (cart.length === 0 || checkingOut) return

    setCheckingOut(true)

    const saleData = {
      local_id: `SALE-${Date.now()}`,
      description: 'Venta POS',
      total_amount: total,
      device_id: import.meta.env.VITE_DEVICE_ID || 'DEFAULT-DEVICE',
      created_at: new Date().toISOString(),
    }

    const cartItems = cart.map((item) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      weight_kg: item.weight_kg,
      price_paid: item.price_paid,
    }))

    try {
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert(saleData)
        .select()
        .single()

      if (saleError) throw saleError

      const saleItems = cartItems.map((item) => ({
        ...item,
        sale_id: sale.id,
      }))

      const { error: itemsError } = await supabase.from('sale_items').insert(saleItems)

      if (itemsError) throw itemsError

      showToast(`Venta registrada: $${total.toFixed(2)}`, 'success')
      clearCart()
    } catch (error) {
      console.error('Error en checkout:', error)
      try {
        await queueSale(saleData, cartItems)
        await refreshCount()
        showToast('Sin conexión — venta guardada localmente', 'info')
        clearCart()
      } catch (queueError) {
        console.error('Error queuing sale:', queueError)
        showToast('Error al procesar la venta', 'error')
      }
    } finally {
      setCheckingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
      {calculator.show ? (
        <Calculator
          tortillaProduct={tortillaProduct}
          calculatorValue={calculator.value}
          setCalculatorValue={calculator.setValue}
          calculatorMode={calculator.mode}
          setCalculatorMode={calculator.setMode}
          onAdd={calculator.handleAdd}
          onCancel={calculator.close}
        />
      ) : (
        <>
          <div className="products-section">
            <ProductGrid products={products} onProductClick={handleProductClick} />
          </div>

          <div className="cart-section">
            <Cart
              cart={cart}
              totalAmount={total}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onCheckout={handleCheckout}
              onClear={clearCart}
              checkingOut={checkingOut}
              pendingCount={pendingCount}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default App
