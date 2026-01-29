import { useEffect, useRef } from 'react'
import './Cart.css'

function Cart({
  cart,
  totalAmount,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onClear,
  checkingOut,
  pendingCount,
  lastAddedId,
}) {
  const itemRefs = useRef({})

  useEffect(() => {
    if (lastAddedId && itemRefs.current[lastAddedId]) {
      itemRefs.current[lastAddedId].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [lastAddedId])
  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>🛒 Carrito</h2>
        {pendingCount > 0 && (
          <span className="pending-badge">
            {pendingCount} pendiente{pendingCount > 1 ? 's' : ''}
          </span>
        )}
        {cart.length > 0 && (
          <button className="clear-cart-btn" onClick={onClear}>
            Limpiar
          </button>
        )}
      </div>

      <div className="cart-items-list">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <p>Carrito vacío</p>
            <span>Toca un producto para agregar</span>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              ref={(el) => (itemRefs.current[item.id] = el)}
              className={`cart-item-card ${item.id === lastAddedId ? 'newly-added' : ''}`}
            >
              <div className="item-main">
                <div className="item-name-section">
                  <div className="item-name">{item.product_name}</div>
                  <div className="item-details mono">
                    {item.weight_kg ? (
                      <span>{item.weight_kg.toFixed(3)} kg</span>
                    ) : (
                      <span>Cantidad: {item.quantity}</span>
                    )}
                  </div>
                </div>
                <div className="item-price mono">${item.price_paid.toFixed(2)}</div>
              </div>

              <div className="item-controls">
                {item.quantity && (
                  <div className="quantity-controls">
                    <button
                      className="qty-control-btn minus"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                    >
                      −
                    </button>
                    <button
                      className="qty-control-btn plus"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                )}
                <button className="delete-btn" onClick={() => onRemoveItem(item.id)}>
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="cart-footer">
          <div className="total-section">
            <span className="total-label">TOTAL:</span>
            <span className="total-value mono">${totalAmount.toFixed(2)}</span>
          </div>

          <button className="checkout-btn" onClick={onCheckout} disabled={checkingOut}>
            {checkingOut ? '⏳ Procesando...' : '💳 COBRAR'}
          </button>
        </div>
      )}
    </div>
  )
}

export default Cart
