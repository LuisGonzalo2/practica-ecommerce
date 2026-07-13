import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

export default function CartSidebar() {
  const { cart, changeQty, removeItem, subtotal, iva, total, sidebarOpen, setSidebarOpen } = useCart()
  const navigate = useNavigate()

  function goTo(path) {
    setSidebarOpen(false)
    navigate(path)
  }

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white z-50 flex flex-col shadow-xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-medium text-base">Carrito</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-700 text-xl leading-none">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">🛒</div>
              <p className="text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-3 py-3 border-b border-gray-100 last:border-none">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-2xl shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-400 mb-2">{item.brand}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => changeQty(item.id, -1)} className="w-6 h-6 border border-gray-200 rounded text-sm flex items-center justify-center hover:bg-gray-50">−</button>
                    <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)} className="w-6 h-6 border border-gray-200 rounded text-sm flex items-center justify-center hover:bg-gray-50">+</button>
                    <button onClick={() => removeItem(item.id)} className="ml-auto text-gray-300 hover:text-red-400 text-sm">🗑️</button>
                  </div>
                </div>
                <p className="text-sm font-medium text-blue-600 whitespace-nowrap">${(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-3">
              <span>IVA (15%)</span><span>${iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium mb-4">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
            <button onClick={() => goTo('/carrito')} className="w-full border border-gray-200 rounded-lg py-2.5 text-sm mb-2 hover:bg-gray-50 transition-colors">
              Ver carrito completo
            </button>
            <button onClick={() => goTo('/checkout')} className="w-full bg-blue-500 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-600 transition-colors">
              Ir al checkout
            </button>
          </div>
        )}
      </div>
    </>
  )
}