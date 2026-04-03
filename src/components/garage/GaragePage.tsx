'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/cartStore'
import { demoGarageCars } from '@/lib/garageData'
import CarShowcase from './CarShowcase'
import AccountPanel from './AccountPanel'

export default function GaragePage() {
  const { setView } = useAppStore()
  const [activeCar, setActiveCar] = useState(demoGarageCars[0])

  return (
    <div
      className="fixed inset-0 z-[400] overflow-hidden flex flex-col"
      style={{ background: '#080a0c' }}
    >
      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between px-8 border-b flex-shrink-0"
        style={{
          height: 56,
          background: 'rgba(10,12,14,0.95)',
          borderColor: 'rgba(240,224,64,0.15)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Logo + back */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 transition-colors duration-200"
            style={{ background: 'none', border: 'none', color: 'var(--gray)', fontSize: '0.82rem', fontFamily: '"Barlow Condensed"', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--yellow)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray)')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 5 5 12 12 19"/>
            </svg>
            VOLVER
          </button>

          <div
            className="font-condensed font-black italic uppercase"
            style={{ fontSize: '1.5rem', color: 'var(--white)', letterSpacing: '0.04em' }}
          >
            MI <span style={{ color: 'var(--yellow)' }}>GARAGE</span>
          </div>
        </div>

        {/* User badge */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 font-condensed font-bold uppercase"
            style={{ fontSize: '0.82rem', color: 'var(--gray)', letterSpacing: '0.1em' }}
          >
            <span style={{ color: 'var(--yellow)' }}>●</span>
            JUAMPI
          </div>
          <div
            className="font-condensed font-black italic"
            style={{ fontSize: '0.9rem', color: 'var(--yellow)', letterSpacing: '0.06em' }}
          >
            {demoGarageCars.length} AUTO{demoGarageCars.length !== 1 ? 'S' : ''}
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT — Car showcase */}
        <CarShowcase car={activeCar} />

        {/* RIGHT — Account panel */}
        <AccountPanel />
      </div>

      {/* ── Car selector bottom strip (if multiple cars) ── */}
      {demoGarageCars.length > 1 && (
        <div
          className="flex gap-3 px-8 py-3 border-t flex-shrink-0"
          style={{ background: 'rgba(10,12,14,0.9)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          {demoGarageCars.map((car) => (
            <button
              key={car.id}
              onClick={() => setActiveCar(car)}
              className="flex items-center gap-2 px-4 py-2 rounded font-condensed font-bold uppercase transition-all duration-200"
              style={{
                background: activeCar.id === car.id ? 'var(--yellow)' : 'rgba(255,255,255,0.05)',
                color: activeCar.id === car.id ? 'var(--text-dark)' : 'var(--gray2)',
                border: `1px solid ${activeCar.id === car.id ? 'var(--yellow)' : 'rgba(255,255,255,0.1)'}`,
                fontSize: '0.8rem',
                letterSpacing: '0.08em',
                cursor: 'pointer',
              }}
            >
              {car.brand} {car.model} · {car.year}
            </button>
          ))}
          <button
            className="flex items-center gap-2 px-4 py-2 rounded font-condensed font-bold uppercase transition-all duration-200"
            style={{
              background: 'none',
              color: 'var(--gray)',
              border: '1px dashed rgba(255,255,255,0.15)',
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--yellow)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray)')}
          >
            + AGREGAR AUTO
          </button>
        </div>
      )}
    </div>
  )
}
