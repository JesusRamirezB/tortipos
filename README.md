# POS System - Sistema de Ventas para Tablet

Sistema de punto de venta optimizado para tablets, diseñado para ser simple y fácil de usar por personas con conocimientos limitados de tecnología.

## Características

- 🛒 **Interfaz Simple**: Diseñada específicamente para tablets con pantalla completa
- 🫓 **Calculadora de Tortillas**: Sistema dedicado para vender tortillas por pesos o kilos
- 👆 **Botones Grandes**: Touch-friendly, fácil de tocar sin errores
- 📱 **Pantalla Completa**: 100vw x 100vh - uso exclusivo en tablet
- 💰 **Carrito Visual**: Muestra claramente los productos y el total
- ⚡ **Rápido y Simple**: Mínima curva de aprendizaje

## Flujo de Trabajo

### Para productos regulares:
1. Cliente pide un producto (ej: "Chile con Huevo")
2. Empleado toca el producto en la pantalla
3. El producto se agrega al carrito automáticamente

### Para tortillas:
1. Cliente dice: **"10 pesos de tortillas"** o **"1 kilo de tortillas"**
2. Empleado toca **Tortillas** en la pantalla
3. Aparece la calculadora
4. Empleado selecciona modo: **💵 Pesos** o **⚖️ Kilos**
5. Ingresa la cantidad usando el teclado numérico
6. Toca **Agregar al Carrito**

## Tech Stack

- React 18 + Vite
- Supabase (PostgreSQL)
- CSS optimizado para tablets
- Fuentes: Inter + JetBrains Mono

## Instalación Rápida

### 1. Configurar Base de Datos

Ejecuta este SQL en tu proyecto de Supabase:

```sql
-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('weighted', 'unit')) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales table
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id TEXT NOT NULL UNIQUE,
  description TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  device_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

-- Sale items table
CREATE TABLE sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID,
  product_name TEXT NOT NULL,
  quantity INTEGER,
  weight_kg DECIMAL(10,3),
  price_paid DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sales_device ON sales(device_id);
CREATE INDEX idx_sales_created ON sales(created_at DESC);
CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);

-- Datos de prueba
INSERT INTO products (name, type, price, active) VALUES
('Tortillas', 'weighted', 24.00, true),
('Chile con Costilla', 'unit', 20.00, true),
('Chile con Huevo', 'unit', 18.00, true),
('Nopales', 'unit', 15.00, true),
('Frijoles Fritos', 'unit', 12.00, true),
('Frijoles de la Olla', 'unit', 14.00, true),
('Huevo', 'unit', 8.00, true),
('Refrescos', 'unit', 10.00, true),
('Botanas', 'unit', 16.00, true);
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env`:

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

### 3. Instalar y Ejecutar

```bash
npm install
npm run dev
```

## Diseño para Tablet

- **Resolución**: Optimizado para tablets (1024x768 o superior)
- **Orientación**: Landscape (horizontal) recomendado
- **Touch**: Todos los botones tienen tamaño mínimo de 50x50px
- **Sin scroll horizontal**: Todo visible en una pantalla
- **Fuentes grandes**: Fácil de leer desde distancia

## Simplificaciones para Usuarios No Técnicos

✅ **Solo números en calculadora** - Sin operadores confusos  
✅ **Botones grandes y claros** - Difícil equivocarse  
✅ **Un solo propósito** - Vender productos, nada más  
✅ **Feedback visual** - El usuario siempre sabe qué está pasando  
✅ **Confirmaciones claras** - Mensajes simples y directos  

## Estructura del Proyecto

```
pos-app/
├── src/
│   ├── components/
│   │   ├── Calculator.jsx      # Calculadora de tortillas
│   │   ├── Cart.jsx             # Carrito de compras
│   │   └── ProductGrid.jsx      # Grid de productos
│   ├── lib/
│   │   └── supabase.js          # Cliente Supabase
│   ├── App.jsx                  # Componente principal
│   └── index.css                # Estilos globales
├── index.html
├── vite.config.js
└── package.json
```

## Agregar Nuevos Productos

En Supabase, ejecuta:

```sql
INSERT INTO products (name, type, price, active) VALUES
('Nombre del Producto', 'unit', 15.00, true);

-- Para productos por peso:
INSERT INTO products (name, type, price, active) VALUES
('Producto por Kilo', 'weighted', 30.00, true);
```

## Personalización de Colores

Edita las variables en `src/index.css`:

```css
:root {
  --color-primary: #2d5a7b;      /* Azul principal */
  --color-secondary: #e85d3a;    /* Naranja */
  --color-accent: #6fa857;       /* Verde */
  --color-success: #28a745;      /* Verde éxito */
}
```

## Consejos de Uso

1. **Mantén la tablet cargada** - Conecta a la corriente durante uso
2. **Limpia la pantalla** - Una pantalla limpia es más fácil de usar
3. **Modo kiosco** - Considera usar el modo kiosco del navegador
4. **WiFi estable** - Necesario para sincronizar con Supabase
5. **Backup offline** - Las ventas se guardan localmente primero

## Soporte

Este sistema fue diseñado para:
- Negocios pequeños de comida
- Usuarios con experiencia tecnológica limitada
- Operación rápida en ambientes de alto tráfico
- Tablets con Android o iPad

## Build para Producción

```bash
npm run build
```

Los archivos estarán en `dist/` listos para desplegar.

## Licencia

MIT
