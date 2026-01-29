# POS System – Tablet Point of Sale

Tablet-optimized point of sale system designed to be simple and easy to use by people with limited technical knowledge.

## Features

- **Simple Interface**: Designed specifically for full-screen tablet usage  
- **Tortilla Calculator**: Dedicated system to sell tortillas by pesos or kilos  
- **Large Buttons**: Touch-friendly, easy to press without mistakes  
- **Full Screen Mode**: 100vw x 100vh – exclusive tablet usage  
- **Visual Cart**: Clearly shows products and total amount  
- **Offline Mode**: Sales are saved locally and automatically synced  
- **Toast Notifications**: Visual feedback for confirmations and errors

## Workflow

### For regular products:
1. Customer asks for a product (e.g. “Chile con Huevo”)
2. Employee taps the product on the screen
3. Product is automatically added to the cart

### For tortillas:
1. Customer says: “10 pesos of tortillas” or “1 kilo of tortillas”
2. Employee taps **Tortillas** on the screen
3. Calculator appears
4. Employee selects mode: **Pesos** or **Kilos**
5. Amount is entered using the numeric keypad
6. Tap **Add to Cart**

## Tech Stack

- **Frontend**: React 18 + Vite  
- **Database**: Supabase (PostgreSQL)  
- **Offline Storage**: IndexedDB  
- **Testing**: Vitest + Testing Library  
- **Linting**: ESLint + Prettier  
- **Fonts**: Inter (UI) + JetBrains Mono (prices)

## Tablet-First Design

- **Resolution**: Optimized for tablets (1024x768 or higher)
- **Orientation**: Landscape recommended
- **Touch**: All buttons have a minimum size of 50x50px
- **No horizontal scroll**: Everything fits on a single screen
- **Large fonts**: Easy to read from a distance

## Simplifications for Non-Technical Users

- Numeric-only calculator – no confusing operators
- Large, clear buttons – hard to misclick
- Single purpose – sell products, nothing more
- Visual feedback – user always knows what’s happening
- Clear confirmations – simple and direct messages

## Offline support

The system supports offline operation:

- Sales are first saved to IndexedDB (local storage)
- When a connection is available, data syncs automatically with Supabase
- The cart shows a counter for pending sync sales
- Notifications inform when connection is lost or restored

## Soporte

Este sistema fue diseñado para:
- Small food businesses
- Users with limited technical experience
- Fast operation in high-traffic environments
- Android tablets or iPads

## Licencia

MIT
