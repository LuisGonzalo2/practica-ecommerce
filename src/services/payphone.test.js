import { describe, it, expect, vi, beforeEach } from 'vitest'
import { preparePayment, confirmPayment } from './payphone'

describe('preparePayment', () => {
  const form = { telefono: '0991234567', email: 'test@example.com' }

  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('calcula el monto total como la suma exacta de sus componentes', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ payWithCard: 'url', paymentId: 1 })
    })

    await preparePayment({ subtotal: 89.99, iva: 13.50, total: 103.49, form, cart: [] })

    const sentBody = JSON.parse(global.fetch.mock.calls[0][1].body)
    expect(sentBody.amount).toBe(sentBody.amountWithTax + sentBody.amountWithoutTax + sentBody.tax)
  })

  it('lanza un error cuando Payphone responde con fallo', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Monto inválido' })
    })

    await expect(
      preparePayment({ subtotal: 10, iva: 1, total: 11, form, cart: [] })
    ).rejects.toThrow('Monto inválido')
  })
})