import { products } from '../data/products'
import ProductCard from '../components/ProductCard'

// Página principal — muestra el catálogo de productos en una grilla
export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">

      {/* Encabezado de la sección */}
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Catálogo</p>
        <h1 className="text-2xl font-semibold">Productos destacados asdadsa</h1>
      </div>

      {/* Grilla responsiva: 2 columnas en móvil, hasta 4 en escritorio */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          // Renderiza una card por cada producto del array en products.js
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </main>
  )
}