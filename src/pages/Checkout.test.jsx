import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Checkout from './Checkout'
import { preparePayment } from '../services/payphone'

vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }))
vi.mock('../services/payphone', () => ({ preparePayment: vi.fn() }))
vi.mock('../context/CartContext', () => ({
  useCart: () => ({
    cart: [{ id: 1, name: 'Mouse', price: 20, qty: 1 }],
    subtotal: 20, iva: 3, shipping: 5, total: 28,
  }),
}))

describe('Página de Checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete window.location
    window.location = { href: '' }
  })

  it('✅ Al completar el formulario y pagar, redirige al usuario al formulario de Payphone', async () => {
    preparePayment.mockResolvedValue({ payWithCard: 'https://pay.payphone.test/form/abc' })

    render(<Checkout />)
    fireEvent.change(screen.getByPlaceholderText('Juan'), { target: { value: 'Luis' } })
    fireEvent.change(screen.getByPlaceholderText('Pérez'), { target: { value: 'Gonzalo' } })
    fireEvent.change(screen.getByPlaceholderText('juan@correo.com'), { target: { value: 'luis@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('0999000000'), { target: { value: '0991234567' } })
    fireEvent.change(screen.getByPlaceholderText('Av. 9 de Octubre 100'), { target: { value: 'Av. 4' } })
    fireEvent.change(screen.getByPlaceholderText('Manta'), { target: { value: 'Manta' } })

    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/i }))

    await waitFor(() => {
      expect(preparePayment).toHaveBeenCalled()
      expect(window.location.href).toBe('https://pay.payphone.test/form/abc')
    })
  })
})