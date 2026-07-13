import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CartSidebar from './components/CartSidebar'
import Home from './pages/Home'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import Confirmacion from './pages/Confirmacion'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar fijo en todas las páginas */}
      <Navbar />

      {/* Sidebar del carrito — se muestra sobre cualquier página */}
      <CartSidebar />

      {/* Rutas principales de la aplicación */}
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/carrito"      element={<CartPage />} />
        <Route path="/checkout"     element={<Checkout />} />
        {/* Payphone redirige aquí después del pago con ?id=X&clientTransactionId=Y */}
        <Route path="/confirmacion" element={<Confirmacion />} />
      </Routes>
    </div>
  )
}