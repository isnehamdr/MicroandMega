import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'mm_cart_v1'

function loadInitialState() {
  if (typeof window === 'undefined') return { items: [] }
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return { items: [] }
    const parsed = JSON.parse(raw)
    return { items: Array.isArray(parsed.items) ? parsed.items : [] }
  } catch {
    return { items: [] }
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload
      const existing = state.items.find((i) => i.id === product.id)

      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        }
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            image: product.image,
            price: product.price ?? 1, // dummy price, backend will set real price later
            stock_status: product.stock_status ?? 'in_stock',
            quantity,
          },
        ],
      }
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      }
    }

    case 'INCREMENT': {
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }
    }

    case 'DECREMENT': {
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity - 1 } : i
          )
          .filter((i) => i.quantity > 0),
      }
    }

    case 'SET_QUANTITY': {
      const qty = Math.max(0, Math.floor(action.payload.quantity) || 0)
      return {
        ...state,
        items: qty === 0
          ? state.items.filter((i) => i.id !== action.payload.id)
          : state.items.map((i) =>
              i.id === action.payload.id ? { ...i, quantity: qty } : i
            ),
      }
    }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState)

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // sessionStorage may be unavailable (private mode etc) — fail silently,
      // cart just won't persist across reloads in that case
    }
  }, [state])

  const addItem = (product, quantity = 1) =>
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } })

  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } })

  const incrementQty = (id) => dispatch({ type: 'INCREMENT', payload: { id } })

  const decrementQty = (id) => dispatch({ type: 'DECREMENT', payload: { id } })

  const setQuantity = (id, quantity) =>
    dispatch({ type: 'SET_QUANTITY', payload: { id, quantity } })

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const itemCount = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  )

  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items]
  )

  const isInCart = (id) => state.items.some((i) => i.id === id)

  const value = {
    items: state.items,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    incrementQty,
    decrementQty,
    setQuantity,
    clearCart,
    isInCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a <CartProvider>')
  }
  return ctx
}