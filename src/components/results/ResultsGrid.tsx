'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/cartStore'
import { demoProducts } from '@/lib/cartStore'
import FiltersPanel from './FiltersPanel'
import ListingCard from './ListingCard'

export default function ResultsGrid() {
  const { vehicle, setView, cartCount } = useAppStore()
  const [toast, setToast] = useState(false)

  function showToast() {
    setToast(true)
    setTimeout(() => setToast(false), 2200)
  }

  const vehicleLabel = vehicle
    ? `${vehicle.brand} ${vehicle.model} · ${vehicle.engine.split(' ').slice(0,2).join(' ')} · ${vehicle.year}`
    : 'Tu vehículo'

  return (
    <div
      id="results-page"
      className="fixed inset-0 z-[400] overflow-y-auto"
      style={{ background: 'var(--dark)' }}
    >
      {/* Topbar */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-10 border-b-2"
        style={{ background: 'var(--dark2)', height: 64, borderColor: 'var(--dark3)' }}
      >
        <button
          className="flex items-center gap-2 font-condensed font-bold uppercase tracking-[0.06em] transition-colors duration-200"
          style={{ background: 'none', border: 'none', color: 'var(--gray2)', fontSize: '0.95rem', cursor: 'pointer' }}
          onClick={() => setView('home')}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--yellow)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray2)')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-[18px] h-[18px]">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 5 5 12 12 19"/>
          </svg>
          VOLVER
        </button>

        <div
          className="flex items-center gap-2 px-4 py-[0.4rem] rounded-[20px] font-condensed font-bold uppercase tracking-[0.05em]"
          style={{
            background: 'var(--dark3)',
            border: '1px solid var(--dark4)',
            fontSize: '0.88rem',
            color: 'var(--yellow)',
          }}
        >
          🚗 {vehicleLabel}
        </div>

        <div
          className="font-condensed font-bold uppercase tracking-[0.06em]"
          style={{ fontSize: '0.9rem', color: 'var(--gray)' }}
        >
          TODOS LOS REPUESTOS
        </div>
      </div>

      {/* Layout */}
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <FiltersPanel />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div
              className="font-condensed font-bold uppercase tracking-[0.05em]"
              style={{ fontSize: '1.1rem', color: 'var(--gray2)' }}
            >
              <strong style={{ color: 'var(--yellow)' }}>{demoProducts.length}</strong> repuestos compatibles con tu {vehicle?.brand ?? 'vehículo'}
            </div>
            <div
              className="flex items-center gap-2 font-condensed font-semibold uppercase tracking-[0.06em]"
              style={{ fontSize: '0.85rem', color: 'var(--gray)' }}
            >
              ORDENAR:
              <select
                className="font-condensed font-semibold uppercase"
                style={{
                  background: 'var(--dark3)',
                  border: '1px solid var(--dark4)',
                  color: 'var(--white)',
                  padding: '0.35rem 0.7rem',
                  borderRadius: 4,
                  fontSize: '0.85rem',
                }}
              >
                <option>Precio: menor a mayor</option>
                <option>Precio: mayor a menor</option>
                <option>Más vendidos</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {demoProducts.map((product) => (
              <ListingCard key={product.id} product={product} onAdded={showToast} />
            ))}
          </div>
        </main>
      </div>

      {/* Cart float button */}
      {cartCount() > 0 && (
        <button
          onClick={() => setView('cart')}
          className="fixed z-[410] flex items-center gap-2 font-condensed font-black italic uppercase transition-transform duration-150 hover:-translate-y-0.5"
          style={{
            bottom: '5.5rem',
            right: '2rem',
            background: 'var(--yellow)',
            color: 'var(--text-dark)',
            border: 'none',
            borderRadius: '50px',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            boxShadow: '0 4px 18px rgba(240,224,64,0.3)',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
          </svg>
          VER CARRITO
          <span
            className="flex items-center justify-center rounded-full font-extrabold"
            style={{
              background: 'var(--text-dark)',
              color: 'var(--yellow)',
              width: 22,
              height: 22,
              fontSize: '0.75rem',
            }}
          >
            {cartCount()}
          </span>
        </button>
      )}

      {/* Toast */}
      <div className={`toast ${toast ? 'show' : ''}`}>
        ✓ Agregado al carrito
      </div>
    </div>
  )
}
