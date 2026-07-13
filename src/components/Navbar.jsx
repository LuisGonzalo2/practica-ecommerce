import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { itemCount, setSidebarOpen } = useCart()

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-tight">
          tech<span className="text-blue-500">store</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Productos
          </Link>
          <button
            onClick={() => setSidebarOpen(true)}
            className="relative flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
          >
            🛒 Carrito
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}