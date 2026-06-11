'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/cartStore'
import { saveCatalogNavigationSnapshot } from '@/lib/catalogNavigationState'

type NavLink = {
  label: string
  group: string // label de MAIN_CATEGORIES de ResultsGrid
}

const navLinks: NavLink[] = [
  { label: 'ACEITES',     group: 'Lubricación' },
  { label: 'NEUMÁTICOS',  group: 'Ruedas y Neumáticos' },
  { label: 'LLANTAS',     group: 'Ruedas y Neumáticos' },
  { label: 'FILTROS',     group: 'Lubricación' },
  { label: 'FRENOS',      group: 'Frenos' },
  { label: 'DETAILING',   group: 'Accesorios' },
]

const rightLinks: NavLink[] = [
  { label: 'OFF ROAD Y OUTDOOR', group: 'TODOS' },
]

interface NavbarProps {
  isSticky?: boolean
  transparent?: boolean
}

export default function Navbar({ isSticky = true, transparent = false }: NavbarProps) {
  const { vehicle, searchQuery, setView, setCatalogSelectedGroup, setCatalogSelectedSubgroup } = useAppStore()
  const [menuOpen, setMenuOpen] = useState(false)

  function goToCategory(group: string) {
    // Estado global → ResultsGrid lo observa inmediatamente, incluso si ya está montado
    setCatalogSelectedGroup(group)
    setCatalogSelectedSubgroup('TODO')
    // Snapshot también — para persistencia entre refresh / volver desde detalle
    saveCatalogNavigationSnapshot({
      vehicle,
      searchQuery,
      selectedGroup: group,
      selectedSubgroup: 'TODO',
    })
    setMenuOpen(false)
    setView('results')
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }

  return (
    <nav
      className={`${isSticky ? 'sticky' : transparent ? 'fixed' : ''} z-[350] flex items-center px-4 md:px-10 border-b-2 overflow-x-auto relative ${menuOpen ? 'navbar-mobile-open' : ''}`}
      style={{
        background: transparent ? 'rgba(0,0,0,0.55)' : '#000',
        backdropFilter: transparent ? 'blur(10px)' : undefined,
        top: (isSticky || transparent) ? 78 : undefined,
        left: transparent ? 0 : undefined,
        right: transparent ? 0 : undefined,
        height: 48,
        borderColor: transparent ? 'rgba(255,255,255,0.06)' : 'var(--dark)',
      }}
    >
      {/* Hamburger button — only visible on mobile */}
      <button
        className="navbar-hamburger items-center justify-center mr-3"
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#fff',
          padding: '4px',
          flexShrink: 0,
        }}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Menú"
      >
        {menuOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={22} height={22}>
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={22} height={22}>
            <path d="M3 6h18M3 12h18M3 18h18"/>
          </svg>
        )}
      </button>

      {/* Category links — hidden on mobile, shown via hamburger */}
      <div className="navbar-links flex items-center flex-1">
        {navLinks.map((link) => (
          <button
            key={link.label}
            type="button"
            onClick={() => goToCategory(link.group)}
            className="nav-link"
          >
            {link.label}
          </button>
        ))}

        <div className="ml-auto flex items-center">
          {rightLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => goToCategory(link.group)}
              className="nav-link"
            >
              {link.label}
            </button>
          ))}
          <button
            type="button"
            className="nav-link nav-link-hl"
            onClick={() => { setMenuOpen(false); setView('racers-edge-home') }}
          >
            THE RACER&apos;S EDGE
          </button>
        </div>
      </div>

      <style jsx>{`
        .nav-link {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-style: italic;
          font-size: 0.98rem;
          letter-spacing: 0.05em;
          color: #fff;
          text-transform: uppercase;
          text-decoration: none;
          background: transparent;
          border: none;
          border-right: 1px solid rgba(255,255,255,0.06);
          padding: 0 1.1rem;
          height: 48px;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .nav-link:hover {
          background: var(--slate2);
          color: var(--yellow);
        }
        .nav-link-hl {
          background: #e41d13 !important;
          color: var(--white) !important;
          justify-content: center;
          text-align: center;
          min-width: fit-content;
          flex-shrink: 0;
          border-right: none;
        }
        .nav-link-hl:hover {
          background: #c81910 !important;
          color: var(--white) !important;
        }
      `}</style>
    </nav>
  )
}
