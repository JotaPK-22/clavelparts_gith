'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from '@/lib/cartStore'
import { getCatalogProducts, type CatalogProduct } from '@/lib/supabaseCatalog'
import { getCategoryImage } from '@/lib/categoryImages'
import FiltersPanel from './FiltersPanel'
import ListingCard from './ListingCard'

const MAIN_CATEGORIES = [
  { label: 'Motor', aliases: ['Motor'] },
  { label: 'Distribución', aliases: ['Distribución'] },
  { label: 'Lubricación', aliases: ['Lubricación'] },
  { label: 'Encendido', aliases: ['Encendido'] },
  { label: 'Suspensión', aliases: ['Suspensión'] },
  { label: 'Dirección', aliases: ['Dirección'] },
  { label: 'Frenos', aliases: ['Frenos'] },
  { label: 'Transmisión', aliases: ['Transmisión'] },
  { label: 'Embrague', aliases: ['Embrague'] },
  { label: 'Electricidad Interior', aliases: ['Electricidad Interior', 'Electricidad', 'Interior'] },
  { label: 'A/C y Calefacción', aliases: ['A/C y Calefacción', 'Calefacción', 'Climatización'] },
  { label: 'Inyección y Admisión', aliases: ['Inyección y Admisión', 'Inyección', 'Admisión', 'Combustible / Inyección'] },
  { label: 'Refrigeración', aliases: ['Refrigeración'] },
  { label: 'Escape', aliases: ['Escape'] },
  { label: 'Ruedas y Neumáticos', aliases: ['Ruedas y Neumáticos', 'Ruedas', 'Neumáticos'] },
  { label: 'Carrocería', aliases: ['Carrocería'] },
  { label: 'Accesorios', aliases: ['Accesorios'] },
  { label: 'Liquidaciones', aliases: ['Liquidaciones'] },
  { label: 'Otros', aliases: ['Otros'] },
] as const

function normalizeValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function matchesCategory(product: CatalogProduct, category: string) {
  if (category === 'TODOS') return true
  if (category === 'Liquidaciones') return product.liquidation

  const categoryConfig = MAIN_CATEGORIES.find((item) => item.label === category)
  if (!categoryConfig) return product.group === category

  const normalizedGroup = normalizeValue(product.group)
  return categoryConfig.aliases.some((alias) => normalizeValue(alias) === normalizedGroup)
}

export default function ResultsGrid() {
  const { vehicle, searchQuery, setView, cartCount } = useAppStore()
  const [toast, setToast] = useState(false)
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedGroup, setSelectedGroup] = useState('TODOS')
  const [selectedSubgroup, setSelectedSubgroup] = useState('TODOS')

  useEffect(() => {
    const loadProducts = async () => {
      if (!vehicle && !searchQuery) {
        setProducts([])
        return
      }

      try {
        setLoading(true)
        setError(null)
        const items = await getCatalogProducts(vehicle, searchQuery)
        setProducts(items)
      } catch (err) {
        console.error(err)
        setError('No se pudieron cargar los repuestos desde Supabase.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [vehicle, searchQuery])

  useEffect(() => {
    setSelectedGroup('TODOS')
    setSelectedSubgroup('TODOS')
  }, [vehicle?.brand, vehicle?.model, vehicle?.year, vehicle?.engine, searchQuery])

  useEffect(() => {
    setSelectedSubgroup('TODOS')
  }, [selectedGroup])

  function showToast() {
    setToast(true)
    setTimeout(() => setToast(false), 2200)
  }

  const groups = useMemo(
    () => ['TODOS', ...MAIN_CATEGORIES.map((category) => category.label)],
    []
  )

  const subgroups = useMemo(() => {
    const filteredByGroup = selectedGroup === 'TODOS'
      ? products
      : products.filter((product) => matchesCategory(product, selectedGroup))

    return ['TODOS', ...Array.from(new Set(filteredByGroup.map((product) => product.subgroup)))].filter(Boolean)
  }, [products, selectedGroup])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesGroupFilter = matchesCategory(product, selectedGroup)
      const matchesSubgroup = selectedSubgroup === 'TODOS' || product.subgroup === selectedSubgroup
      return matchesGroupFilter && matchesSubgroup
    })
  }, [products, selectedGroup, selectedSubgroup])

  const groupCards = useMemo(
    () => MAIN_CATEGORIES.map((category) => ({
      name: category.label,
      count: products.filter((product) => matchesCategory(product, category.label)).length,
      image: getCategoryImage(category.label),
    })),
    [products]
  )

  const subgroupCards = useMemo(
    () => subgroups
      .filter((subgroup) => subgroup !== 'TODOS')
      .map((subgroup) => ({
        name: subgroup,
        count: products.filter((product) => {
          const matchesGroupFilter = matchesCategory(product, selectedGroup)
          return matchesGroupFilter && product.subgroup === subgroup
        }).length,
      })),
    [subgroups, products, selectedGroup]
  )

  const vehicleLabel = vehicle
    ? `${vehicle.brand} ${vehicle.model} · ${vehicle.engine} · ${vehicle.year}`
    : searchQuery
      ? `Búsqueda general · ${searchQuery}`
      : 'Tu vehículo'

  return (
    <div
      id="results-page"
      className="fixed inset-0 z-[400] overflow-y-auto"
      style={{ background: 'var(--dark)' }}
    >
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
          CATÁLOGO COMPATIBLE
        </div>
      </div>

      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        {selectedGroup !== 'TODOS' && (
          <FiltersPanel
            groups={groups}
            subgroups={subgroups}
            selectedGroup={selectedGroup}
            selectedSubgroup={selectedSubgroup}
            onSelectGroup={setSelectedGroup}
            onSelectSubgroup={setSelectedSubgroup}
          />
        )}

        <main className="flex-1 p-8" style={{ background: 'var(--light-bg)' }}>
          <div className="flex items-center justify-between mb-6">
            <div
              className="font-condensed font-bold uppercase tracking-[0.05em]"
              style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }}
            >
              {selectedGroup === 'TODOS' ? (
                <>
                  <strong style={{ color: 'var(--yellow)' }}>{groupCards.length}</strong>{' '}
                  {searchQuery && !vehicle
                    ? `categorías disponibles para “${searchQuery}”`
                    : `categorías disponibles para tu ${vehicle?.brand ?? 'vehículo'}`}
                </>
              ) : selectedSubgroup === 'TODOS' ? (
                <>
                  <strong style={{ color: 'var(--yellow)' }}>{subgroupCards.length}</strong> subcategorías dentro de {selectedGroup}
                </>
              ) : (
                <>
                  <strong style={{ color: 'var(--yellow)' }}>{filteredProducts.length}</strong> repuestos en {selectedSubgroup}
                </>
              )}
            </div>
            <div
              className="font-condensed font-semibold uppercase tracking-[0.06em]"
              style={{ fontSize: '0.85rem', color: 'var(--slate)' }}
            >
              {selectedGroup !== 'TODOS'
                ? selectedSubgroup !== 'TODOS'
                  ? `SUBGRUPO: ${selectedSubgroup}`
                  : `GRUPO: ${selectedGroup}`
                : searchQuery
                  ? `BÚSQUEDA: ${searchQuery}`
                  : 'ELEGÍ UNA CATEGORÍA'}
            </div>
          </div>

          {loading ? (
            <div className="rounded-md p-6" style={{ background: 'var(--light-card)', border: '1px solid #d9dde3', color: 'var(--text-dark)' }}>
              Cargando repuestos desde Supabase...
            </div>
          ) : error ? (
            <div className="rounded-md p-6" style={{ background: 'rgba(220,38,38,0.1)', color: '#fca5a5' }}>
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-md p-6" style={{ background: 'var(--light-card)', border: '1px solid #d9dde3', color: 'var(--text-dark)' }}>
              No hay repuestos cargados para esa combinación de vehículo, categoría o búsqueda.
            </div>
          ) : selectedGroup === 'TODOS' ? (
            <>
              <div
                className="rounded-md p-5 mb-6"
                style={{ background: 'var(--light-card)', border: '1px solid #d9dde3', color: 'var(--text-dark)' }}
              >
                Elegí una categoría para ver los repuestos compatibles con tu vehículo.
              </div>

              <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {groupCards.map((group) => {
                  const disabled = group.count === 0

                  return (
                    <button
                      key={group.name}
                      onClick={() => {
                        if (!disabled) setSelectedGroup(group.name)
                      }}
                      className="rounded-md p-5 text-center transition-all duration-200"
                      style={{
                        background: 'var(--light-card)',
                        border: '1px solid #d9dde3',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        opacity: 1,
                      }}
                      onMouseEnter={(e) => {
                        if (disabled) return
                        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)'
                        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--yellow)'
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = 'none'
                        ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#d9dde3'
                      }}
                    >
                      <div
                        className="relative mb-4 overflow-hidden rounded-md"
                        style={{ height: 170, background: '#f8f9fb' }}
                      >
                        <Image
                          src={group.image}
                          alt={group.name}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                      </div>
                      <div className="font-condensed font-extrabold uppercase" style={{ fontSize: '1rem', color: 'var(--text-dark)', lineHeight: 1.2 }}>
                        {group.name}
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => {
                    setSelectedGroup('TODOS')
                    setSelectedSubgroup('TODOS')
                  }}
                  className="font-condensed font-bold uppercase"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--dark4)',
                    color: 'var(--gray2)',
                    padding: '0.45rem 0.8rem',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  ← Volver a categorías
                </button>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate)' }}>
                  {selectedGroup} {selectedSubgroup !== 'TODOS' ? `· ${selectedSubgroup}` : ''}
                </div>
              </div>

              {subgroupCards.length > 0 && (
                <div className="mb-8">
                  <div
                    className="font-condensed font-extrabold uppercase tracking-[0.1em] mb-3"
                    style={{ fontSize: '0.82rem', color: 'var(--slate)' }}
                  >
                    SUBCATEGORÍAS
                  </div>
                  <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    <button
                      onClick={() => setSelectedSubgroup('TODOS')}
                      className="rounded-md px-4 py-3 text-left transition-all duration-200"
                      style={{
                          background: selectedSubgroup === 'TODOS' ? 'rgba(240,224,64,0.12)' : 'var(--light-card)',
                          border: `1px solid ${selectedSubgroup === 'TODOS' ? 'rgba(240,224,64,0.3)' : '#d9dde3'}`,
                          color: selectedSubgroup === 'TODOS' ? '#8a6d00' : 'var(--text-dark)',
                        cursor: 'pointer',
                      }}
                    >
                      TODOS
                    </button>
                    {subgroupCards.map((subgroup) => (
                      <button
                        key={subgroup.name}
                        onClick={() => setSelectedSubgroup(subgroup.name)}
                        className="rounded-md px-4 py-3 text-left transition-all duration-200"
                        style={{
                          background: selectedSubgroup === subgroup.name ? 'rgba(240,224,64,0.12)' : 'var(--light-card)',
                          border: `1px solid ${selectedSubgroup === subgroup.name ? 'rgba(240,224,64,0.3)' : '#d9dde3'}`,
                          color: selectedSubgroup === subgroup.name ? '#8a6d00' : 'var(--text-dark)',
                          cursor: 'pointer',
                        }}
                      >
                        <div className="font-condensed font-bold uppercase" style={{ fontSize: '0.85rem' }}>
                          {subgroup.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                          {subgroup.count} item{subgroup.count !== 1 ? 's' : ''}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredProducts.length === 0 ? (
                <div className="rounded-md p-6" style={{ background: 'var(--light-card)', border: '1px solid #d9dde3', color: 'var(--text-dark)' }}>
                  No hay repuestos cargados en esa subcategoría.
                </div>
              ) : (
                <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {filteredProducts.map((product) => (
                    <ListingCard key={product.id} product={product} onAdded={showToast} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

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

      <div className={`toast ${toast ? 'show' : ''}`}>
        ✓ Agregado al carrito
      </div>
    </div>
  )
}
