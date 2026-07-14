import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Confirmacion from './Confirmacion'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }))
vi.mock('../services/payphone', () => ({ confirmPayment: vi.fn() }))
vi.mock('../context/CartContext', () => ({ useCart: () => ({ setCart: vi.fn() }) }))

describe('Confirmacion', () => {
  it('redirige al inicio si no vienen los parámetros de Payphone', () => {
    render(<Confirmacion />)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})