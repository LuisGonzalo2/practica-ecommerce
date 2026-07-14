import { describe, it, expect, vi, beforeEach } from 'vitest'
import { preparePayment, confirmPayment } from './payphone'

describe('Servicio de pagos Payphone', () => {
  const form = { telefono: '0991234567', email: 'test@example.com' }

  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('✅ El monto total enviado a Payphone coincide con subtotal + IVA', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ payWithCard: 'url', paymentId: 1 })
    })

    await preparePayment({ subtotal: 89.99, iva: 13.50, total: 103.49, form, cart: [] })

    const sentBody = JSON.parse(global.fetch.mock.calls[0][1].body)
    expect(sentBody.amount).toBe(sentBody.amountWithTax + sentBody.amountWithoutTax + sentBody.tax)
  })

  it('❌ Si Payphone rechaza el pago, se lanza un error con el mensaje correcto', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Monto inválido' })
    })

    await expect(
      preparePayment({ subtotal: 10, iva: 1, total: 11, form, cart: [] })
    ).rejects.toThrow('Monto inválido')
  })
})