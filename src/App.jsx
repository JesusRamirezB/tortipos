import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Calculator from './components/Calculator'
import Cart from './components/Cart'
import ProductGrid from './components/ProductGrid'
import './App.css'

function App() {
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState([])
    const [tortillaProduct, setTortillaProduct] = useState(null)
    const [showCalculator, setShowCalculator] = useState(false)
    const [calculatorValue, setCalculatorValue] = useState('')
    const [calculatorMode, setCalculatorMode] = useState('pesos') // 'pesos' or 'kg'
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
            // setProducts(data || [])

            // Find tortillas product
            // const tortilla = data?.find(p => p.type === 'weighted')
            // setTortillaProduct(tortilla)

            const weightedProducts = data.filter(p => p.type === 'weighted')
            const otherProducts = data.filter(p => p.type !== 'weighted')

            const orderedProducts = [...weightedProducts, ...otherProducts]

            setProducts(orderedProducts)
            setTortillaProduct(weightedProducts[0])
        } catch (error) {
            console.error('Error loading products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleProductClick = (product) => {
        if (product.type === 'weighted') {
            setShowCalculator(true)
            setCalculatorValue('')
            setCalculatorMode('pesos')
        } else {
            addToCart(product)
        }
    }

    const addToCart = (product, customPrice = null, weight = null) => {
        const newItem = {
            id: Date.now(),
            product_id: product.id,
            product_name: product.name,
            quantity: product.type === 'unit' ? 1 : null,
            weight_kg: weight,
            price_paid: customPrice || product.price,
            product: product
        }
        setCart([...cart, newItem])
    }

    const handleCalculatorAdd = () => {
        if (!tortillaProduct || !calculatorValue) return

        const value = parseFloat(calculatorValue)
        if (value <= 0) return

        if (calculatorMode === 'pesos') {
            // Customer said "$10 pesos of tortillas"
            const weight = value / tortillaProduct.price
            addToCart(tortillaProduct, value, weight)
        } else {
            // Customer said "1 kg of tortillas"
            const price = value * tortillaProduct.price
            addToCart(tortillaProduct, price, value)
        }

        setShowCalculator(false)
        setCalculatorValue('')
    }

    const updateCartItemQuantity = (itemId, delta) => {
        const newCart = cart.map(item => {
            if (item.id === itemId && item.quantity) {
                const newQuantity = Math.max(0, item.quantity + delta)
                if (newQuantity === 0) return null
                return {
                    ...item,
                    quantity: newQuantity,
                    price_paid: item.product.price * newQuantity
                }
            }
            return item
        }).filter(Boolean)
        setCart(newCart)
    }

    const removeCartItem = (itemId) => {
        setCart(cart.filter(item => item.id !== itemId))
    }

    const clearCart = () => {
        setCart([])
    }

    const getTotalAmount = () => {
        return cart.reduce((sum, item) => sum + item.price_paid, 0)
    }

    const handleCheckout = async () => {
        if (cart.length === 0) return

        try {
            const saleData = {
                local_id: `SALE-${Date.now()}`,
                description: 'Venta POS',
                total_amount: getTotalAmount(),
                device_id: 'TABLET-001',
                created_at: new Date().toISOString()
            }

            const { data: sale, error: saleError } = await supabase
                .from('sales')
                .insert(saleData)
                .select()
                .single()

            if (saleError) throw saleError

            const saleItems = cart.map(item => ({
                sale_id: sale.id,
                product_id: item.product_id,
                product_name: item.product_name,
                quantity: item.quantity,
                weight_kg: item.weight_kg,
                price_paid: item.price_paid
            }))

            const { error: itemsError } = await supabase
                .from('sale_items')
                .insert(saleItems)

            if (itemsError) throw itemsError

            alert(`✅ Venta registrada: $${getTotalAmount().toFixed(2)}`)
            clearCart()
        } catch (error) {
            console.error('Error en checkout:', error)
            alert('❌ Error al procesar la venta')
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
            {showCalculator ? (
                <Calculator
                    tortillaProduct={tortillaProduct}
                    calculatorValue={calculatorValue}
                    setCalculatorValue={setCalculatorValue}
                    calculatorMode={calculatorMode}
                    setCalculatorMode={setCalculatorMode}
                    onAdd={handleCalculatorAdd}
                    onCancel={() => setShowCalculator(false)}
                />
            ) : (
                <>
                    <div className="products-section">
                        <ProductGrid
                            products={products}
                            onProductClick={handleProductClick}
                        />
                    </div>

                    <div className="cart-section">
                        <Cart
                            cart={cart}
                            totalAmount={getTotalAmount()}
                            onUpdateQuantity={updateCartItemQuantity}
                            onRemoveItem={removeCartItem}
                            onCheckout={handleCheckout}
                            onClear={clearCart}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default App
