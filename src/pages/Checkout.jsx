import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { preparePayment } from '../services/payphone'

// Página de checkout — formulario de datos del cliente + botón de pago Payphone
export default function Checkout() {
  const { cart, subtotal, iva, shipping, total } = useCart()
  const navigate = useNavigate()

  // Estado del formulario — un campo por dato del cliente
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', telefono: '', direccion: '', ciudad: '', provincia: 'Manabí'
  })

  // Estados del proceso de pago
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  // Actualiza el campo correspondiente cuando el usuario escribe
  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Valida que todos los campos estén llenos antes de habilitar el botón
  function formValido() {
    return Object.values(form).every(v => v.trim() !== '')
  }

  // Llama a Payphone API Fase 1 y redirige al formulario de pago
  async function handlePagar() {
    if (!formValido()) return
    setLoading(true)
    setError(null)

    try {
      // Prepara la transacción y obtiene la URL de pago
      const result = await preparePayment({ subtotal, iva, total, form, cart })
      // Redirige al formulario web de pago con tarjeta de Payphone
      window.location.href = result.payWithCard
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  // Si el carrito está vacío redirige al inicio
  if (cart.length === 0) {
    navigate('/')
    return null
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">

      {/* Botón volver al carrito */}
      <button
        onClick={() => navigate('/carrito')}
        className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-700 mb-6 transition-colors"
      >
        ← Volver al carrito
      </button>

      {/* Indicador de pasos del proceso de compra */}
      <div className="flex items-center gap-3 mb-8">
        {/* Paso 1: Carrito (completado) */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-medium">✓</div>
          <span className="text-sm text-gray-400">Carrito</span>
        </div>
        <div className="flex-1 h-px bg-gray-200 max-w-12" />

        {/* Paso 2: Datos y pago (activo) */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">2</div>
          <span className="text-sm font-medium">Datos y pago</span>
        </div>
        <div className="flex-1 h-px bg-gray-200 max-w-12" />

        {/* Paso 3: Confirmación (pendiente) */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-gray-300 text-gray-400 text-xs flex items-center justify-center">3</div>
          <span className="text-sm text-gray-400">Confirmación</span>
        </div>
      </div>

      {/* Layout dos columnas: formulario izquierda, resumen derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* ── Columna izquierda: formulario + pago ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Tarjeta de datos de entrega */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-5">Información de entrega</p>

            {/* Nombre y apellido */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Nombre</label>
                <input
                  name="nombre" value={form.nombre} onChange={handleChange}
                  placeholder="Juan"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Apellido</label>
                <input
                  name="apellido" value={form.apellido} onChange={handleChange}
                  placeholder="Pérez"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">Correo electrónico</label>
              <input
                name="email" value={form.email} onChange={handleChange}
                placeholder="juan@correo.com" type="email"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Teléfono */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">Teléfono</label>
              <input
                name="telefono" value={form.telefono} onChange={handleChange}
                placeholder="0999000000"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Dirección */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">Dirección</label>
              <input
                name="direccion" value={form.direccion} onChange={handleChange}
                placeholder="Av. 9 de Octubre 100"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Ciudad y provincia */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Ciudad</label>
                <input
                  name="ciudad" value={form.ciudad} onChange={handleChange}
                  placeholder="Manta"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Provincia</label>
                <select
                  name="provincia" value={form.provincia} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
                >
                  {['Azuay','El Oro','Guayas','Manabí','Pichincha','Tungurahua'].map(p => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tarjeta de método de pago */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-5">Método de pago</p>

            {/* Bloque visual Payphone */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-4 mb-5">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-semibold shrink-0 leading-tight text-center">
                PAY<br/>PHONE
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Pagar con Payphone</p>
                <p className="text-xs text-blue-600">Visa y Mastercard · Cualquier banco ecuatoriano</p>
              </div>
            </div>

            {/* Mensaje de error si falla la API */}
            {error && (
              <p className="text-red-500 text-xs mb-3 text-center bg-red-50 border border-red-100 rounded-lg py-2 px-3">
                ⚠️ {error}
              </p>
            )}

            {/* Botón de pago — deshabilitado si el form está incompleto o está cargando */}
            <button
              disabled={!formValido() || loading}
              onClick={handlePagar}
              className={`w-full rounded-lg py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2
                ${formValido() && !loading
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              {loading
                ? '⏳ Conectando con Payphone...'
                : `🔒 Pagar ahora — $${total.toFixed(2)}`
              }
            </button>

            <p className="text-xs text-center text-gray-400 mt-3">
              🛡️ Pago seguro · Procesado por Payphone · Modo test activo
            </p>
          </div>

        </div>

        {/* ── Columna derecha: resumen del pedido ── */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="font-medium text-sm mb-4">Tu pedido</h2>

          {/* Lista de items */}
          <div className="space-y-3 mb-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-500 truncate mr-2">{item.name} × {item.qty}</span>
                <span className="shrink-0">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Desglose de costos */}
          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-500">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Envío</span><span>${shipping.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>IVA (15%)</span><span>${iva.toFixed(2)}</span></div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-100 pt-4 mt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </main>
  )
}