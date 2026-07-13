import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

// Página completa del carrito — muestra items, cantidades y resumen del pedido
export default function CartPage() {
  const { cart, changeQty, removeItem, subtotal, iva, shipping, total } = useCart()
  const navigate = useNavigate()

  // Si el carrito está vacío mostramos un mensaje con link para volver
  if (cart.length === 0) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-gray-400 mb-6">Tu carrito está vacío</p>
        <Link to="/" className="bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
          Ver productos
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">

      {/* Botón para volver al catálogo */}
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-700 mb-6 transition-colors">
        ← Seguir comprando
      </button>

      <p className="text-xs text-gray-400 uppercase tracking-widest mb-6">Tu carrito</p>

      {/* Layout de dos columnas: items a la izquierda, resumen a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* ── Columna izquierda: lista de items ── */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl overflow-hidden">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 last:border-none">

              {/* Emoji del producto como imagen */}
              <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center text-3xl shrink-0">
                {item.emoji}
              </div>

              {/* Nombre y marca */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-gray-400">{item.brand}</p>
              </div>

              {/* Controles de cantidad: − número + */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeQty(item.id, -1)}
                  className="w-7 h-7 border border-gray-200 rounded-md text-sm flex items-center justify-center hover:bg-gray-50"
                >
                  −
                </button>
                <span className="text-sm font-medium w-5 text-center">{item.qty}</span>
                <button
                  onClick={() => changeQty(item.id, 1)}
                  className="w-7 h-7 border border-gray-200 rounded-md text-sm flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>

              {/* Precio total del item (precio × cantidad) */}
              <p className="text-sm font-semibold text-blue-600 w-20 text-right">
                ${(item.price * item.qty).toFixed(2)}
              </p>

              {/* Botón eliminar item */}
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-300 hover:text-red-400 transition-colors ml-2"
              >
                🗑️
              </button>

            </div>
          ))}
        </div>

        {/* ── Columna derecha: resumen del pedido ── */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="font-medium text-base mb-5">Resumen del pedido</h2>

          {/* Desglose de costos */}
          <div className="space-y-2 text-sm text-gray-500 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío estimado</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA (15%)</span>
              <span>${iva.toFixed(2)}</span>
            </div>
          </div>

          {/* Línea divisoria */}
          <div className="border-t border-gray-100 pt-4 mb-5">
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Botón para ir al checkout */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-blue-500 text-white rounded-lg py-3 text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            💳 Proceder al pago
          </button>
        </div>

      </div>
    </main>
  )
}