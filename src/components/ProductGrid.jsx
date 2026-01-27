import './ProductGrid.css'

function ProductGrid({ products, onProductClick }) {
  const getProductEmoji = (name) => {
    const emojiMap = {
      'Tortillas': '🫓',
      'Chile con Costilla': '🍲',
      'Chile con Huevo': '🍳',
      'Nopales': '🌵',
      'Frijoles Fritos': '🫘',
      'Frijoles de la Olla': '🫘',
      'Huevo': '🥚',
      'Refrescos': '🥤',
      'Botanas': '🥔'
    }
    return emojiMap[name] || '🍽️'
  }

  const getProductColor = (index) => {
    const colors = [
      '#2d5a7b',
      '#e85d3a',
      '#6fa857',
      '#f4a261',
      '#e07856',
      '#5a7d9a',
      '#c85a54',
      '#7ba3cc',
      '#d4a574',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="product-grid-container">
      {products.map((product, index) => (
        <button
          key={product.id}
          className="product-card-large"
          onClick={() => onProductClick(product)}
          style={{ '--product-color': getProductColor(index) }}
        >
          <div className="product-emoji-large">{getProductEmoji(product.name)}</div>
          <div className="product-info-large">
            <h3 className="product-name-large">{product.name}</h3>
            <div className="product-price-large mono">
              ${product.price.toFixed(2)}
              {product.type === 'weighted' && <span className="price-unit"> /kg</span>}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

export default ProductGrid
