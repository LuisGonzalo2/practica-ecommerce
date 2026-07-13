import { createContext, useContext, useState } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
    setSidebarOpen(true)
  }

  function changeQty(id, delta) {
    setCart(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
      return updated.filter(i => i.qty > 0)
    })
  }

  function removeItem(id) {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  const itemCount = cart.reduce((s, i) => s + i.qty, 0)
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const iva = subtotal * 0.15
  const shipping = cart.length > 0 ? 4.99 : 0
  const total = subtotal + iva + shipping

  return (
    <CartContext.Provider value={{ cart, addToCart, changeQty, removeItem, itemCount, subtotal, iva, shipping, total, sidebarOpen, setSidebarOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}