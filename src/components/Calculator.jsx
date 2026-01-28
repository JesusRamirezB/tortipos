import './Calculator.css'

function Calculator({
  tortillaProduct,
  calculatorValue,
  setCalculatorValue,
  calculatorMode,
  setCalculatorMode,
  onAdd,
  onCancel,
}) {
  const handleNumberClick = (num) => {
    // Prevent multiple decimals
    if (num === '.' && calculatorValue.includes('.')) return

    const next = calculatorValue + num

    if (next.length > 10) return

    if (next.includes('.')) {
      const [, decimals] = next.split('.')
      if (decimals.length > 1) return
    }

    setCalculatorValue(next)
  }

  const handleBackspace = () => {
    setCalculatorValue(calculatorValue.slice(0, -1))
  }

  const handleClear = () => {
    setCalculatorValue('')
  }

  const calculateAmount = () => {
    if (!tortillaProduct || !calculatorValue) return '0.00'

    const value = parseFloat(calculatorValue) || 0

    if (calculatorMode === 'pesos') {
      // Show weight when customer says pesos
      const kg = value / tortillaProduct.price
      return kg.toFixed(3) + ' kg'
    } else {
      // Show price when customer says kg
      const price = value * tortillaProduct.price
      return '$' + price.toFixed(2)
    }
  }

  const getDisplayText = () => {
    if (!calculatorValue) return '0'
    return calculatorValue
  }

  return (
    <div className="calculator-fullscreen">
      <div className="calculator-top">
        <div className="calculator-header">
          <button className="back-btn" onClick={onCancel}>
            ← Regresar
          </button>
          <h1 className="calculator-title">🫓 Tortillas</h1>
        </div>

        <div className="mode-toggle">
          <button
            className={`mode-btn ${calculatorMode === 'pesos' ? 'active' : ''}`}
            onClick={() => setCalculatorMode('pesos')}
          >
            💵 Pesos
          </button>
          <button
            className={`mode-btn ${calculatorMode === 'kg' ? 'active' : ''}`}
            onClick={() => setCalculatorMode('kg')}
          >
            ⚖️ Kilos
          </button>
        </div>

        <div className="calculator-main">
          <div className="calculator-display-box">
            <div className="display-label">
              {calculatorMode === 'pesos' ? 'Cantidad en pesos:' : 'Cantidad en kilos:'}
            </div>
            <div className="display-main mono">
              {calculatorMode === 'pesos' ? '$' : ''}
              {getDisplayText()}
              {calculatorMode === 'kg' ? ' kg' : ''}
            </div>
            <div className="display-conversion">= {calculateAmount()}</div>
          </div>
          <div className="calculator-numpad">
            <button className="num-btn" onClick={() => handleNumberClick('1')}>
              1
            </button>
            <button className="num-btn" onClick={() => handleNumberClick('2')}>
              2
            </button>
            <button className="num-btn" onClick={() => handleNumberClick('3')}>
              3
            </button>

            <button className="num-btn" onClick={() => handleNumberClick('4')}>
              4
            </button>
            <button className="num-btn" onClick={() => handleNumberClick('5')}>
              5
            </button>
            <button className="num-btn" onClick={() => handleNumberClick('6')}>
              6
            </button>

            <button className="num-btn" onClick={() => handleNumberClick('7')}>
              7
            </button>
            <button className="num-btn" onClick={() => handleNumberClick('8')}>
              8
            </button>
            <button className="num-btn" onClick={() => handleNumberClick('9')}>
              9
            </button>

            <button className="num-btn special" onClick={() => handleNumberClick('.')}>
              .
            </button>
            <button className="num-btn" onClick={() => handleNumberClick('0')}>
              0
            </button>
            <button className="num-btn special" onClick={handleBackspace}>
              ⌫
            </button>
          </div>
        </div>

        <div className="calculator-actions">
          <button className="action-btn clear-btn" onClick={handleClear}>
            Borrar Todo
          </button>
          <button
            className="action-btn add-btn"
            onClick={onAdd}
            disabled={!calculatorValue || parseFloat(calculatorValue) <= 0}
          >
            ✓ Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  )
}

export default Calculator
