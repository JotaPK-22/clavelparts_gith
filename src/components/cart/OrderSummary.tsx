'use client'

import { useAppStore } from '@/lib/cartStore'

export default function OrderSummary() {
  const { cart, cartTotal } = useAppStore()

  // Group by seller
  const bySeller = cart.reduce<Record<string, typeof cart>>((acc, item) => {
    if (!acc[item.seller]) acc[item.seller] = []
    acc[item.seller].push(item)
    return acc
  }, {})

  const total = cartTotal()

  return (
    <div
      className="rounded-lg overflow-hidden sticky"
      style={{ background: 'var(--dark2)', border: '1px solid var(--dark3)', top: 80 }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 font-condensed font-black italic uppercase text-white"
        style={{ background: 'var(--slate)', fontSize: '1.2rem' }}
      >
        Resumen del pedido
      </div>

      <div className="p-6">
        {/* Rows */}
        <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--dark3)', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--gray)' }}>Subtotal</span>
          <span className="text-white font-semibold">${total.toLocaleString('es-AR')}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--dark3)', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--gray)' }}>Envío</span>
          <span style={{ color: 'var(--green)', fontWeight: 600 }}>Gratis</span>
        </div>

        {/* Total */}
        <div
          className="flex justify-between items-center pt-4 pb-2 mt-2 border-t-2"
          style={{ borderColor: 'var(--yellow)' }}
        >
          <span
            className="font-condensed font-extrabold uppercase text-white"
            style={{ fontSize: '1.1rem' }}
          >
            TOTAL
          </span>
          <span
            className="font-condensed font-black"
            style={{ fontSize: '1.8rem', color: 'var(--yellow)' }}
          >
            ${total.toLocaleString('es-AR')}
          </span>
        </div>

        {/* Delivery info */}
        <div
          className="rounded-md px-4 py-3 my-4 leading-[1.5]"
          style={{
            background: 'rgba(110,231,183,0.07)',
            border: '1px solid rgba(110,231,183,0.2)',
            fontSize: '0.82rem',
            color: 'var(--green)',
          }}
        >
          <strong className="block mb-1" style={{ fontSize: '0.88rem' }}>Estimación de entrega consolidada</strong>
          Tu pedido llega en 2 envíos. El más rápido en 2-4 días hábiles.
        </div>

        {/* Guarantee */}
        <div
          className="flex gap-[0.6rem] rounded-md px-4 py-3 mb-4 leading-[1.5]"
          style={{ background: 'var(--dark3)', fontSize: '0.8rem', color: 'var(--gray2)' }}
        >
          <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>🛡️</span>
          <span>
            <strong className="text-white">Garantía de compatibilidad ClavelParts.</strong>{' '}
            Si la pieza no es compatible con tu vehículo, te la cambiamos sin costo.
          </span>
        </div>

        {/* Sellers breakdown */}
        <div
          className="rounded-lg p-4 mb-4"
          style={{ background: 'var(--dark2)', border: '1px solid var(--dark3)' }}
        >
          <div
            className="font-condensed font-extrabold uppercase tracking-[0.1em] mb-4"
            style={{ fontSize: '0.85rem', color: 'var(--gray)' }}
          >
            📦 Vendedores en este pedido
          </div>
          {Object.entries(bySeller).map(([seller, items], idx, arr) => (
            <div
              key={seller}
              className="mb-3 pb-3"
              style={{ borderBottom: idx < arr.length - 1 ? '1px solid var(--dark3)' : 'none' }}
            >
              <div
                className="font-condensed font-bold text-white mb-1"
                style={{ fontSize: '0.9rem' }}
              >
                {seller}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--gray)' }}>
                {items.map((i) => i.name).join(', ')}
              </div>
              <div
                className="flex items-center gap-1 mt-1"
                style={{ fontSize: '0.78rem', color: 'var(--green)' }}
              >
                ✓ Envío gratis · {items[0].delivery} días hábiles
              </div>
            </div>
          ))}
        </div>

        {/* Checkout CTA */}
        <button
          className="w-full font-condensed font-black italic uppercase transition-all duration-150"
          style={{
            padding: '1rem',
            background: 'var(--yellow)',
            color: 'var(--text-dark)',
            border: 'none',
            borderRadius: 6,
            fontSize: '1.2rem',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            boxShadow: '0 4px 18px rgba(240,224,64,0.2)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(240,224,64,0.35)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'none'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 18px rgba(240,224,64,0.2)'
          }}
        >
          FINALIZAR COMPRA →
        </button>

        <div
          className="flex items-center justify-center gap-1 mt-3"
          style={{ fontSize: '0.75rem', color: 'var(--gray)' }}
        >
          🔒 Pago 100% seguro · MercadoPago
        </div>
      </div>
    </div>
  )
}
