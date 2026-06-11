'use client'

import Image from 'next/image'
import { useAppStore } from '@/lib/cartStore'
import { saveCatalogNavigationSnapshot } from '@/lib/catalogNavigationState'

type CategoryDef = {
  id: string
  name: string
  image: string
  // Label que matchea con MAIN_CATEGORIES de ResultsGrid (o 'TODOS' para
  // abrir el catálogo sin filtro de categoría)
  group: string
}

const categories: CategoryDef[] = [
  { id: 'neumaticos',    name: 'Neumáticos y llantas', image: '/categories/neumaticos y llantas.png', group: 'Ruedas y Neumáticos' },
  { id: 'frenos',        name: 'Frenos',               image: '/categories/frenos.png',               group: 'Frenos' },
  { id: 'motor',         name: 'Motor',                image: '/categories/motor.png',                group: 'Motor' },
  { id: 'filtros',       name: 'Filtros',              image: '/categories/lubricacion.png',          group: 'Lubricación' },
  { id: 'amortiguacion', name: 'Amortiguación',        image: '/categories/suspension.png',           group: 'Suspensión' },
  { id: 'embrague',      name: 'Embrague',             image: '/categories/embrague.png',             group: 'Embrague' },
  { id: 'electrico',     name: 'Sistema eléctrico',    image: '/categories/electricidad.png',         group: 'Electricidad' },
  { id: 'interior',      name: 'Interior',             image: '/categories/interior.png',             group: 'Interior' },
  { id: 'aceites',       name: 'Aceites y líquidos',   image: '/categories/lubricacion.png',          group: 'Lubricación' },
  { id: 'correas',       name: 'Correas y cadenas',    image: '/categories/distribucion.png',         group: 'Distribución' },
  { id: 'carroceria',    name: 'Carrocería',           image: '/categories/carroceria.png',           group: 'Carrocería' },
  { id: 'suspension',    name: 'Suspensión',           image: '/categories/suspension.png',           group: 'Suspensión' },
  { id: 'otros',         name: 'Otras categorías',     image: '/categories/otros.png',                group: 'TODOS' },
]

export default function CategoryGrid() {
  const { vehicle, searchQuery, setView } = useAppStore()

  function goToCategory(group: string) {
    // Guardamos el snapshot que ResultsGrid lee al montarse — eso
    // pre-selecciona el grupo elegido sin reset del filtro
    saveCatalogNavigationSnapshot({
      vehicle,
      searchQuery,
      selectedGroup: group,
      selectedSubgroup: 'TODO',
    })
    setView('results')
    // Scroll arriba por si el header de results tiene anclaje
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }

  return (
    <section className="section-px px-10 py-[4.5rem]" style={{ background: 'var(--light-bg)' }}>
      <div className="text-center mb-[2.8rem]">
        <h2
          className="font-condensed font-black italic uppercase tracking-[0.06em]"
          style={{ fontSize: '1.8rem', color: 'var(--text-dark)' }}
        >
          ENCONTRÁ REPUESTOS EN NUESTRO CATÁLOGO
        </h2>
      </div>

      <div
        className="grid gap-4 max-w-[1200px] mx-auto mb-8 grid-6col"
        style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => goToCategory(cat.group)}
            className="cat-card flex flex-col items-center gap-[0.6rem] no-underline rounded-md py-5 px-3 transition-all duration-200"
            style={{
              background: 'var(--light-card)',
              border: '1px solid #e0e4e8',
              cursor: 'pointer',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.transform = 'translateY(-3px)'
              el.style.borderColor = 'var(--slate2)'
              el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.transform = 'none'
              el.style.borderColor = '#e0e4e8'
              el.style.boxShadow = 'none'
            }}
          >
            <div
              className="relative flex items-center justify-center overflow-hidden rounded-md"
              style={{ height: 110, width: '100%', background: '#f8f9fb' }}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 50vw, 16vw"
              />
            </div>
            <div className="w-[7px] h-[7px] rounded-full" style={{ background: 'var(--slate2)' }} />
            <div
              className="text-center leading-[1.3] font-barlow font-semibold"
              style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}
            >
              {cat.name}
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => goToCategory('TODOS')}
          className="font-condensed font-extrabold italic uppercase transition-all duration-200"
          style={{
            background: 'none',
            border: '2px solid var(--text-dark)',
            color: 'var(--text-dark)',
            fontSize: '1rem',
            letterSpacing: '0.08em',
            padding: '0.7rem 2.5rem',
            cursor: 'pointer',
            borderRadius: 3,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--text-dark)'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--white)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'none'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dark)'
          }}
        >
          Más repuestos disponibles →
        </button>
      </div>
    </section>
  )
}
