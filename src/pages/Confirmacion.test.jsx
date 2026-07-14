import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Confirmacion from './Confirmacion'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }))
vi.mock('../services/payphone', () => ({ confirmPayment: vi.fn() }))
vi.mock('../context/CartContext', () => ({ useCart: () => ({ setCart: vi.fn() }) }))

describe('Página de Confirmación', () => {
  it('✅ Si un usuario llega sin parámetros de Payphone, se le redirige al inicio (evita accesos directos)', () => {
    render(<Confirmacion />)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})