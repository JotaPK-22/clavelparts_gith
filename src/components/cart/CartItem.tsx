'use client'

import { useAppStore } from '@/lib/cartStore'
import type { CartProduct } from '@/lib/cartStore'

const categoryIcons: Record<string, string> = {
  frenos: '🛑', filtros: '🔶', amortiguacion: '🌀',
  embrague: '⚡', motor: '⚙️', suspension: '🔩',
  electrico: '🔋', aceites: '🛢️', default: '🔧',
}

export default function CartItemRow({ item }: { item: CartProduct }) {
  const { updateQty, removeFromCart } = useAppStore()
  const icon = categoryIcons[item.category] ?? categoryIcons.default

  return (
    <div
      className="grid items-center overflow-hidden rounded-lg transition-colors duration-200"
      style={{
        gridTemplateColumns: '110px 1fr auto',
        gap: '1.2rem',
        background: 'var(--dark2)',
        border: '1px solid var(--dark3)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--slate2)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--dark3)')}
    >
      {/* Image */}
      <div
        className="flex items-center justify-center"
        style={{ width: 110, height: 90, background: 'var(--dark3)', fontSize: '2rem' }}
      >
        {icon}
      </div>

      {/* Info */}
      <div className="py-3">
        <div className="badge-compat mb-[0.4rem]" style={{ fontSize: '0.68rem' }}>
          ✓ COMPATIBLE CON TU VEHÍCULO
        </div>
        <div
          className="font-condensed font-extrabold uppercase text-white mb-1"
          style={{ fontSize: '1rem' }}
        >
          {item.name}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--gray)', marginBottom: '0.4rem' }}>
          {item.brand} · Ref: {item.ref}
        </div>
        <div className="flex items-center gap-1" style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>
          {'★'.repeat(item.sellerRating)}
          {' '}{item.seller}
          <span
            className="inline-flex items-center gap-1 font-semibold ml-2 px-[0.6rem] py-[0.22rem] rounded-sm"
            style={{
              background: 'var(--dark3)',
              border: '1px solid var(--dark4)',
              color: 'var(--gray2)',
              fontSize: '0.75rem',
            }}
          >
            🚚 {item.delivery} días
          </span>
        </div>
      </div>

      {/* Price + qty */}
      <div
        className="flex flex-col items-end gap-[0.6rem] py-3 pr-5"
        style={{ minWidth: 120 }}
      >
        <div
          className="font-condensed font-black"
          style={{ fontSize: '1.4rem', color: 'var(--yellow)' }}
        >
          ${(item.price * item.qty).toLocaleString('es-AR')}
        </div>

        <div className="flex items-center gap-[0.4rem]">
          <button
            onClick={() => updateQty(item.id, -1)}
            className="flex items-center justify-center rounded-full text-white transition-colors duration-150"
            style={{
              width: 26, height: 26,
              background: 'var(--dark3)',
              border: '1px solid var(--dark4)',
              fontSize: '1rem', cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--slate)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--dark3)')}
          >
            −
          </button>
          <span
            className="font-condensed font-extrabold text-white text-center"
            style={{ fontSize: '1rem', minWidth: 20 }}
          >
            {item.qty}
          </span>
          <button
            onClick={() => updateQty(item.id, 1)}
            className="flex items-center justify-center rounded-full text-white transition-colors duration-150"
            style={{
              width: 26, height: 26,
              background: 'var(--dark3)',
              border: '1px solid var(--dark4)',
              fontSize: '1rem', cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--slate)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--dark3)')}
          >
            +
          </button>
        </div>

        <button
          onClick={() => removeFromCart(item.id)}
          className="font-barlow transition-colors duration-200"
          style={{
            background: 'none', border: 'none',
            color: 'var(--gray)', fontSize: '0.78rem',
            cursor: 'pointer', textDecoration: 'underline',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#e74c3c')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray)')}
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}
