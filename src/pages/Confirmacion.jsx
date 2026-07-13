import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { confirmPayment } from '../services/payphone'
import { useCart } from '../context/CartContext'

// Página de confirmación — Payphone redirige aquí con ?id=X&clientTransactionId=Y
export default function Confirmacion() {
  const navigate  = useNavigate()
  const { setCart } = useCart() // para limpiar el carrito si necesitas

  const [estado, setEstado]  = useState('cargando') // 'cargando' | 'aprobado' | 'cancelado' | 'error'
  const [detalle, setDetalle] = useState(null)

  useEffect(() => {
    // Captura los parámetros que Payphone envía en la URL
    const params         = new URLSearchParams(window.location.search)
    const id             = params.get('id')
    const clientTxId     = params.get('clientTransactionId')

    if (!id || !clientTxId) {
      // Si no hay parámetros, no vino de Payphone
      navigate('/')
      return
    }

    // Llama a la API de confirmación
    confirmPayment({ id, clientTxId })
      .then(data => {
        setDetalle(data)
        // statusCode 3 = Aprobada, 2 = Cancelada
        if (data.statusCode === 3) {
          setEstado('aprobado')
          // Aquí podrías limpiar el carrito
          // setCart([])
        } else {
          setEstado('cancelado')
        }
      })
      .catch(() => setEstado('error'))
  }, [])

  if (estado === 'cargando') return (
    <main className="max-w-md mx-auto px-6 py-20 text-center">
      <p className="text-gray-400 animate-pulse">Confirmando tu pago...</p>
    </main>
  )

  if (estado === 'aprobado') return (
    <main className="max-w-md mx-auto px-6 py-20 text-center">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-xl font-semibold mb-2">¡Pago aprobado!</h1>
      <p className="text-gray-500 text-sm mb-1">Autorización: <strong>{detalle?.authorizationCode}</strong></p>
      <p className="text-gray-500 text-sm mb-1">Tarjeta: {detalle?.cardBrand} ···{detalle?.lastDigits}</p>
      <p className="text-gray-500 text-sm mb-6">Total cobrado: <strong>${(detalle?.amount / 100).toFixed(2)}</strong></p>
      <button onClick={() => navigate('/')} className="bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
        Volver a la tienda
      </button>
    </main>
  )

  if (estado === 'cancelado') return (
    <main className="max-w-md mx-auto px-6 py-20 text-center">
      <div className="text-6xl mb-4">❌</div>
      <h1 className="text-xl font-semibold mb-2">Pago cancelado</h1>
      <p className="text-gray-500 text-sm mb-6">El pago fue cancelado o rechazado.</p>
      <button onClick={() => navigate('/checkout')} className="bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
        Intentar de nuevo
      </button>
    </main>
  )

  return (
    <main className="max-w-md mx-auto px-6 py-20 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h1 className="text-xl font-semibold mb-2">Error al confirmar</h1>
      <p className="text-gray-500 text-sm mb-6">No pudimos verificar tu pago. Contacta soporte.</p>
      <button onClick={() => navigate('/')} className="border border-gray-200 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">
        Volver al inicio
      </button>
    </main>
  )
}