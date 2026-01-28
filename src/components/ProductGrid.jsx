import './ProductGrid.css'

function ProductGrid({ products, onProductClick }) {
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

  const getImageSrc = (product) => {
    if (product.image_url) {
        return `/images/${product.image_url}`
    }
    return null
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
          <div className="product-image-wrapper">
            {getImageSrc(product) ? (
              <img
                src={getImageSrc(product)}
                alt={product.name}
                className="product-image"
              />
            ) : (
              <div className="product-image-placeholder" />
            )}
          </div>
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
