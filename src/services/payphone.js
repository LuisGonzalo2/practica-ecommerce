
const PAYPHONE_URL = 'https://pay.payphonetodoesposible.com/api/button'

const TOKEN    = 'Pff4OpO0dWwLqYLslK8kE8TqB_S-AO0CLCTOCyDdfaFsq_CDjgWEjaRKm_P_hwwjPjmcwjvXDEYXaVXjoA2dK2qP0DdZPkxA8npzZsne9RpkO3njkHr7goTIIIH7UqDGHp-KOwwE2CeoJNByDLtBcMXbHTj7y45-HoN9lCIx3RBpHXP91u96RqcZ04zP91flkLoSlXVpu2-YTUhKOHJSJeEGU6xaufWP9IjWh8HxN6dnXK0dpWYGdhlAUhxOmWbDHj_svkn0FODL5U28qCV4hrfBNLGGVFKJqIHcjZGqCCE4-FMpPz2dYz0vBdARaWE7AR1rQzQCqWR12b6Pb8RKvVgXTTY'
const STORE_ID = 'd64f018c-6e83-418a-99bb-98d54ae864f2'

// URL a donde Payphone redirige al usuario luego de pagar o cancelar
const RESPONSE_URL = 'http://localhost:5173/confirmacion'
const CANCEL_URL   = 'http://localhost:5173/carrito'

/**
 * FASE 1 — Preparar la transacción
 * Envía los montos a Payphone y recibe la URL del formulario de pago.
 * Regla clave: amount = amountWithTax + amountWithoutTax + tax (en centavos)
 *
 * @param {number} subtotal  - Monto base sin IVA en dólares (ej: 89.99)
 * @param {number} iva       - Monto del IVA en dólares (ej: 13.50)
 * @param {number} total     - Total completo en dólares (ej: 103.49)
 * @param {object} form      - Datos del cliente del formulario
 * @param {array}  cart      - Items del carrito
 * @returns {object}         - { payWithCard, payWithPayPhone, paymentId }
 */
export async function preparePayment({ subtotal, iva, total, form, cart }) {

  // Convertir a centavos (Payphone trabaja en enteros)
  const amountWithoutTax = 0
  const amountWithTax    = Math.round(subtotal * 100)
  const tax              = Math.round(iva * 100)
  // amount DEBE ser la suma exacta de los tres campos anteriores
  const amountTotal      = amountWithTax + amountWithoutTax + tax

  // ID único por transacción usando timestamp
  const clientTransactionId = `ORDER-${Date.now()}`

  // Teléfono con prefijo Ecuador +593 y solo los últimos 9 dígitos
  const phoneClean = '+593' + form.telefono.replace(/\D/g, '').slice(-9)

  const body = {
    amount:           amountTotal,       // total en centavos (suma exacta)
    amountWithTax:    amountWithTax,     // base imponible en centavos
    amountWithoutTax: amountWithoutTax,  // monto sin IVA (0 en este caso)
    tax:              tax,               // IVA en centavos
    clientTransactionId,                 // tu ID único de orden
    currency:         'USD',
    storeId:          STORE_ID,
    reference:        'Compra TechStore',
    responseUrl:      RESPONSE_URL,      // Payphone redirige aquí al pagar
    cancellationUrl:  CANCEL_URL,        // Payphone redirige aquí al cancelar
    timeZone:         -5,                // Ecuador UTC-5
    email:            form.email,
    phoneNumber:      phoneClean,        // formato +593XXXXXXXXX
  }

  // Log para debug — puedes quitarlo en producción
  console.log('Enviando a Payphone:', body)

  const response = await fetch(`${PAYPHONE_URL}/Prepare`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(body)
  })

  const data = await response.json()

  // Log de respuesta para debug
  console.log('Respuesta Payphone:', data)

  if (!response.ok) {
    // Muestra el error específico de Payphone si viene en la respuesta
    throw new Error(data.message || JSON.stringify(data))
  }

  // Retorna: { paymentId, payWithPayPhone, payWithCard }
  // payWithCard     → URL del formulario web con tarjeta Visa/Mastercard
  // payWithPayPhone → URL para pagar desde la app de Payphone
  return data
}

/**
 * @param {string|number} id       - ID de Payphone (viene en la URL)
 * @param {string}        clientTxId - Tu ID de orden (viene en la URL)
 * @returns {object}               - Detalle completo de la transacción
 */
export async function confirmPayment({ id, clientTxId }) {
  const response = await fetch(`${PAYPHONE_URL}/V2/Confirm`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      id:       Number(id),  // Payphone requiere que sea número, no string
      clientTxId
    })
  })

  const data = await response.json()

  console.log('Confirmación Payphone:', data)

  if (!response.ok) {
    throw new Error(data.message || JSON.stringify(data))
  }

  return data
}