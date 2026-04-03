'use client'

import { useAppStore } from '@/lib/cartStore'
import type { CartProduct } from '@/lib/cartStore'

interface ListingCardProps {
  product: Omit<CartProduct, 'qty'>
  onAdded?: () => void
}

// Simple inline SVG placeholder images per category
const categoryIcons: Record<string, string> = {
  frenos:       '🛑',
  filtros:      '🔶',
  amortiguacion:'🌀',
  embrague:     '⚡',
  motor:        '⚙️',
  suspension:   '🔩',
  electrico:    '🔋',
  aceites:      '🛢️',
  default:      '🔧',
}

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: 'var(--yellow)', fontSize: '0.7rem' }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

export default function ListingCard({ product, onAdded }: ListingCardProps) {
  const { addToCart } = useAppStore()
  const icon = categoryIcons[product.category] ?? categoryIcons.default

  function handleAdd() {
    addToCart(product)
    onAdded?.()
  }

  return (
    <div
      className="rounded-md overflow-hidden cursor-pointer transition-all duration-200"
      style={{ background: 'var(--dark2)', border: '1px solid var(--dark3)' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--slate2)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'none'
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--dark3)'
      }}
    >
      {/* Image area */}
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{ height: 160, background: 'var(--dark3)' }}
      >
        <span style={{ fontSize: '4rem' }}>{icon}</span>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="badge-compat mb-[0.6rem]">✓ COMPATIBLE CON TU VEHÍCULO</div>

        <div
          className="font-condensed font-extrabold uppercase tracking-[0.03em] text-white leading-[1.2] mb-1"
          style={{ fontSize: '1.05rem' }}
        >
          {product.name}
        </div>

        <div className="mb-3" style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>
          {product.brand} · Ref: {product.ref}
        </div>

        <div className="flex items-center justify-between">
          <div
            className="font-condensed font-black"
            style={{ fontSize: '1.4rem', color: 'var(--yellow)' }}
          >
            ${product.price.toLocaleString('es-AR')}
          </div>
          <button
            onClick={handleAdd}
            className="font-condensed font-bold uppercase tracking-[0.06em] transition-all duration-200"
            style={{
              background: 'var(--slate)',
              color: 'var(--white)',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: 4,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--yellow)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dark)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--slate)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--white)'
            }}
          >
            + Agregar
          </button>
        </div>

        <div
          className="flex items-center gap-[0.3rem] mt-2"
          style={{ fontSize: '0.75rem', color: 'var(--gray)' }}
        >
          <Stars rating={product.sellerRating} />
          {product.seller} · Entrega: {product.delivery} días
        </div>
      </div>
    </div>
  )
}
