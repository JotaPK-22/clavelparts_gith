'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/cartStore'

interface MenuItem {
  id: string
  icon: string
  label: string
  sublabel: string
  badge?: number | string
}

const menuItems: MenuItem[] = [
  { id: 'garage',    icon: '🏎️', label: 'MIS AUTOS',      sublabel: '1 vehículo registrado',     badge: 1 },
  { id: 'compras',   icon: '📦', label: 'MIS COMPRAS',     sublabel: 'Último pedido hace 3 días'              },
  { id: 'favoritos', icon: '⭐', label: 'FAVORITOS',        sublabel: '7 repuestos guardados',     badge: 7  },
  { id: 'alertas',   icon: '🔔', label: 'ALERTAS',          sublabel: '2 novedades para tu BMW',   badge: 2  },
  { id: 'perfil',    icon: '👤', label: 'MI PERFIL',        sublabel: 'Juampi · comprador'                     },
  { id: 'config',    icon: '⚙️', label: 'CONFIGURACIÓN',   sublabel: 'Dirección, pagos, seguridad'            },
  { id: 'salir',     icon: '🚪', label: 'CERRAR SESIÓN',    sublabel: 'Hasta la próxima, fierrero'             },
]

export default function AccountPanel() {
  const { setView } = useAppStore()
  const [active, setActive] = useState('garage')

  return (
    <div
      className="flex flex-col border-l overflow-y-auto"
      style={{
        width: 300,
        background: 'rgba(8,10,12,0.85)',
        borderColor: 'rgba(240,224,64,0.1)',
        backdropFilter: 'blur(12px)',
        flexShrink: 0,
      }}
    >
      {/* User header */}
      <div
        className="px-6 py-5 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        {/* Avatar */}
        <div
          className="flex items-center gap-3 mb-4"
        >
          <div
            className="flex items-center justify-center rounded-full font-condensed font-black text-xl flex-shrink-0"
            style={{
              width: 48, height: 48,
              background: 'linear-gradient(135deg, var(--slate) 0%, var(--dark4) 100%)',
              border: '2px solid var(--yellow)',
              color: 'var(--yellow)',
            }}
          >
            J
          </div>
          <div>
            <div
              className="font-condensed font-black uppercase text-white"
              style={{ fontSize: '1rem', letterSpacing: '0.06em' }}
            >
              Juampi
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--gray)' }}>
              Comprador · Buenos Aires
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { val: '1',  label: 'Auto' },
            { val: '6',  label: 'Compras' },
            { val: '7',  label: 'Favoritos' },
          ].map(({ val, label }) => (
            <div
              key={label}
              className="text-center py-2 rounded"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div
                className="font-condensed font-black"
                style={{ fontSize: '1.3rem', color: 'var(--yellow)', lineHeight: 1 }}
              >
                {val}
              </div>
              <div
                className="font-condensed uppercase"
                style={{ fontSize: '0.62rem', color: 'var(--gray)', letterSpacing: '0.1em' }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu items — GT style */}
      <div className="flex flex-col py-3 flex-1">
        {menuItems.map((item, idx) => {
          const isActive = active === item.id
          const isDanger = item.id === 'salir'
          return (
            <button
              key={item.id}
              onClick={() => {
                if (isDanger) { setView('home'); return }
                setActive(item.id)
              }}
              className="flex items-center gap-4 px-5 py-4 text-left transition-all duration-150 relative group"
              style={{
                background: isActive
                  ? 'linear-gradient(to right, rgba(240,224,64,0.1), rgba(240,224,64,0.03))'
                  : 'none',
                border: 'none',
                borderLeft: isActive ? '3px solid var(--yellow)' : '3px solid transparent',
                cursor: 'pointer',
                borderBottom: idx < menuItems.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.borderLeftColor = isDanger ? '#e74c3c' : 'rgba(240,224,64,0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'none'
                  e.currentTarget.style.borderLeftColor = 'transparent'
                }
              }}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center rounded flex-shrink-0 text-xl"
                style={{
                  width: 40, height: 40,
                  background: isActive ? 'rgba(240,224,64,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isActive ? 'rgba(240,224,64,0.3)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {item.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div
                  className="font-condensed font-bold uppercase"
                  style={{
                    fontSize: '0.85rem',
                    letterSpacing: '0.08em',
                    color: isDanger ? '#e74c3c' : isActive ? 'var(--yellow)' : 'var(--white)',
                    lineHeight: 1.2,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{ fontSize: '0.68rem', color: 'var(--gray)', marginTop: 2 }}
                >
                  {item.sublabel}
                </div>
              </div>

              {/* Badge */}
              {item.badge && (
                <div
                  className="font-condensed font-black rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 22, height: 22,
                    background: 'var(--yellow)',
                    color: 'var(--text-dark)',
                    fontSize: '0.7rem',
                  }}
                >
                  {item.badge}
                </div>
              )}

              {/* Arrow */}
              {!isDanger && (
                <svg
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                  className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-40 transition-opacity"
                  style={{ color: 'var(--gray)' }}
                >
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              )}
            </button>
          )
        })}
      </div>

      {/* Bottom — Add car CTA */}
      <div
        className="px-5 py-4 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <button
          className="w-full font-condensed font-black italic uppercase transition-all duration-150 rounded"
          style={{
            padding: '0.75rem',
            background: 'none',
            border: '1px solid rgba(240,224,64,0.3)',
            color: 'var(--yellow)',
            fontSize: '0.88rem',
            letterSpacing: '0.08em',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget.style.background = 'rgba(240,224,64,0.08)')
          }}
          onMouseLeave={(e) => {
            (e.currentTarget.style.background = 'none')
          }}
        >
          + AGREGAR VEHÍCULO
        </button>
      </div>
    </div>
  )
}
