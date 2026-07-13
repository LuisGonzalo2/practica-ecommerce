import { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
      <div className="w-full h-28 bg-gray-50 rounded-lg flex items-center justify-center text-4xl mb-3">
        {product.emoji}
      </div>

      {product.tag && (
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
          {product.tag}
        </span>
      )}

      <p className="font-medium text-sm mt-1 leading-tight">{product.name}</p>
      <p className="text-xs text-gray-400 mb-1">{product.brand}</p>
      <p className="text-xs text-green-600 mb-3">En stock ({product.stock})</p>

      <div className="flex items-center justify-between">
        <span className="text-blue-600 font-semibold">${product.price.toFixed(2)}</span>
        <button
          onClick={handleAdd}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
            added
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {added ? '✓ Listo' : '+ Agregar'}
        </button>
      </div>
    </div>
  )
}