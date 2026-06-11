'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/cartStore'
import { fetchProductDetail, type ProductDetail } from '@/lib/productDetails'
import {
  hasCatalogReturnQuery,
  readCatalogNavigationSnapshot,
  clearCatalogReturnQuery,
} from '@/lib/catalogNavigationState'
import Topbar from '@/components/layout/Topbar'
import Navbar from '@/components/layout/Navbar'

type CompatibilityGroup = {
  brand: string
  items: string[]
}

function groupCompatibilityByBrand(items: ProductDetail['compatibility']): CompatibilityGroup[] {
  const map = new Map<string, string[]>()
  items.forEach((entry) => {
    const label = entry.label?.trim()
    if (!label) return
    const vehiclePart = label.split(' - ')[0] || label
    const brand = vehiclePart.split(' ')[0] || 'Otros'
    const existing = map.get(brand) ?? []
    existing.push(label)
    map.set(brand, existing)
  })
  return Array.from(map.entries()).map(([brand, groupedItems]) => ({
    brand,
    items: groupedItems,
  }))
}

const SELLER_TESTIMONIALS = [
  'Llegó en tiempo y forma, pieza original y bien embalada.',
  'Excelente atención. Me ayudaron a confirmar compatibilidad antes de comprar.',
  'Producto tal cual la publicación. Volvería a comprar sin dudar.',
]

export default function DetalleProductoPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { addToCart, setView, setVehicle, clearVehicle, setSearchQuery, clearSearchQuery, setCatalogSelectedGroup, setCatalogSelectedSubgroup } = useAppStore()
  const id = params?.id ?? ''
  const [producto, setProducto] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [imagenActiva, setImagenActiva] = useState(0)
  const [toast, setToast] = useState(false)
  const [compatExpanded, setCompatExpanded] = useState(false)
  const [zoomOpen, setZoomOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetchProductDetail(id).then((data) => {
      if (cancelled) return
      setProducto(data)
      setImagenActiva(0)
      setCompatExpanded(false)
      setZoomOpen(false)
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [id])

  function showToast() {
    setToast(true)
    setTimeout(() => setToast(false), 2200)
  }

  function handleAddToCart() {
    if (!producto) return
    addToCart({
      id: producto.id,
      name: producto.name,
      brand: producto.brand,
      ref: producto.ref,
      price: producto.price,
      seller: producto.seller,
      sellerRating: 5,
      delivery: producto.stock > 0 ? '2-4' : 'a consultar',
      category: producto.group,
      image: producto.images[0],
    })
    showToast()
  }

  function handleBack() {
    // Si veníamos del catálogo, restauramos el estado y volvemos a results
    if (hasCatalogReturnQuery()) {
      const snapshot = readCatalogNavigationSnapshot()
      clearCatalogReturnQuery()
      if (snapshot?.vehicle) setVehicle(snapshot.vehicle); else clearVehicle()
      if (snapshot?.searchQuery) setSearchQuery(snapshot.searchQuery); else clearSearchQuery()
      setCatalogSelectedGroup(snapshot?.selectedGroup || 'TODOS')
      setCatalogSelectedSubgroup(snapshot?.selectedSubgroup || 'TODO')
      setView('results')
      router.replace('/')
      return
    }
    // Si no, volvemos al home
    router.replace('/')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark)' }}>
        <Topbar isSticky={false} />
        <Navbar isSticky={false} />
        <div style={{ color: 'var(--gray2)', textAlign: 'center', padding: '4rem 1rem' }}>
          Cargando producto…
        </div>
      </div>
    )
  }

  if (!producto) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark)' }}>
        <Topbar isSticky={false} />
        <Navbar isSticky={false} />
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div className="font-condensed font-black italic uppercase mb-3" style={{ fontSize: '2rem', color: 'var(--yellow)' }}>
            Producto no encontrado
          </div>
          <p style={{ color: 'var(--gray2)', marginBottom: '1.5rem' }}>
            El producto que buscás no existe o se eliminó del catálogo.
          </p>
          <button
            onClick={() => router.replace('/')}
            className="rounded-md px-4 py-2 font-condensed font-bold uppercase"
            style={{ background: 'var(--yellow)', color: 'var(--text-dark)', cursor: 'pointer', border: 'none' }}
          >
            ← Volver al home
          </button>
        </div>
      </div>
    )
  }

  const oferta = false // hook futuro para precio_oferta
  const hasStock = producto.stock > 0
  const compatibilityGroups = groupCompatibilityByBrand(producto.compatibility)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)' }}>
      <Topbar isSticky={false} />
      <Navbar isSticky={false} />

      <main className="px-4 md:px-10 py-6 pb-32 md:pb-10" style={{ background: 'var(--dark)' }}>
        <div className="mx-auto w-full max-w-6xl">

          {/* Volver */}
          <button
            type="button"
            onClick={handleBack}
            className="mb-5 inline-flex items-center gap-2 rounded-md px-3 py-2 font-condensed font-bold uppercase text-sm transition-colors"
            style={{
              background: 'transparent',
              color: 'var(--gray2)',
              border: '1px solid var(--dark4)',
              letterSpacing: '0.06em',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--white)'
              e.currentTarget.style.borderColor = 'var(--gray)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--gray2)'
              e.currentTarget.style.borderColor = 'var(--dark4)'
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>&larr;</span>
            Volver al catálogo
          </button>

          {/* Migas */}
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-condensed uppercase" style={{ color: 'var(--gray)', letterSpacing: '0.08em' }}>
            <span>{producto.group}</span>
            <span style={{ opacity: 0.4 }}>›</span>
            <span>{producto.subgroup}</span>
            {producto.brand && (
              <>
                <span style={{ opacity: 0.4 }}>›</span>
                <span style={{ color: 'var(--gray2)' }}>{producto.brand}</span>
              </>
            )}
          </div>

          {/* Layout principal */}
          <div className="grid gap-6 md:gap-8 md:grid-cols-[1.1fr_0.9fr]">

            {/* ── Galería ── */}
            <section
              className="rounded-2xl border p-4 md:p-5"
              style={{ background: 'var(--dark2)', borderColor: 'var(--dark4)' }}
            >
              <div
                className="relative mb-4 flex min-h-[340px] md:min-h-[420px] items-center justify-center rounded-xl overflow-hidden"
                style={{ background: 'var(--dark3)', border: '1px solid var(--dark4)' }}
              >
                {producto.images[imagenActiva] ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={producto.images[imagenActiva]}
                      alt={producto.name}
                      onClick={() => setZoomOpen(true)}
                      style={{ width: '100%', maxHeight: 520, objectFit: 'contain', cursor: 'zoom-in' }}
                    />
                    {/* Hint zoom */}
                    <div
                      className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-condensed uppercase pointer-events-none"
                      style={{ background: 'rgba(0,0,0,0.55)', color: 'var(--gray2)', letterSpacing: '0.06em' }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 12, height: 12 }}>
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                      </svg>
                      Click para ampliar
                    </div>
                  </>
                ) : (
                  <div className="font-condensed font-bold uppercase" style={{ color: 'var(--gray)', letterSpacing: '0.08em' }}>
                    Sin imagen
                  </div>
                )}
              </div>

              {producto.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {producto.images.map((img, index) => (
                    <button
                      key={`${img}-${index}`}
                      type="button"
                      onClick={() => setImagenActiva(index)}
                      className="shrink-0 overflow-hidden rounded-lg transition-all"
                      style={{
                        width: 80,
                        height: 80,
                        border: index === imagenActiva ? '2px solid var(--yellow)' : '1px solid var(--dark4)',
                        background: 'var(--dark3)',
                        cursor: 'pointer',
                        padding: 0,
                        opacity: index === imagenActiva ? 1 : 0.7,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`${producto.name} ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* ── Info principal ── */}
            <section className="flex flex-col gap-5">
              {/* Marca chip */}
              {producto.brand && (
                <div
                  className="self-start font-condensed font-bold uppercase text-xs px-3 py-1 rounded-full"
                  style={{
                    background: 'var(--dark3)',
                    border: '1px solid var(--dark4)',
                    color: 'var(--yellow)',
                    letterSpacing: '0.1em',
                  }}
                >
                  {producto.brand}
                </div>
              )}

              {/* Nombre */}
              <h1
                className="font-condensed font-black italic uppercase"
                style={{ color: 'var(--white)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', lineHeight: 1.05, letterSpacing: '0.02em' }}
              >
                {producto.name}
              </h1>

              {/* Datos clave */}
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm" style={{ color: 'var(--gray2)' }}>
                <span><span style={{ color: 'var(--gray)' }}>SKU:</span> {producto.sku}</span>
                {producto.ref && <span><span style={{ color: 'var(--gray)' }}>OEM:</span> {producto.ref}</span>}
                <span style={{ color: hasStock ? '#86efac' : '#fca5a5' }}>
                  {hasStock ? `✓ Stock: ${producto.stock}` : '⚠ Sin stock'}
                </span>
              </div>

              {/* Precio */}
              <div
                className="rounded-xl p-5 border"
                style={{ background: 'var(--dark2)', borderColor: 'var(--dark4)' }}
              >
                <div className="text-xs uppercase font-condensed mb-1" style={{ color: 'var(--gray)', letterSpacing: '0.1em' }}>
                  Precio final
                </div>
                <div
                  className="font-condensed font-black"
                  style={{ color: 'var(--yellow)', fontSize: 'clamp(2rem, 5vw, 2.8rem)', lineHeight: 1 }}
                >
                  ${producto.price.toLocaleString('es-AR')}
                </div>
                {oferta && (
                  <div className="text-xs mt-2" style={{ color: 'var(--gray2)' }}>
                    Hasta 12 cuotas sin interés con MercadoPago
                  </div>
                )}
              </div>

              {/* CTA — visible en desktop, sticky en mobile */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!hasStock}
                className="hidden md:flex items-center justify-center gap-2 w-full rounded-full font-condensed font-black italic uppercase transition-all duration-150"
                style={{
                  padding: '1rem 1.2rem',
                  background: hasStock ? 'var(--yellow)' : 'var(--dark3)',
                  color: hasStock ? 'var(--text-dark)' : 'var(--gray)',
                  border: 'none',
                  fontSize: '1.05rem',
                  letterSpacing: '0.06em',
                  cursor: hasStock ? 'pointer' : 'not-allowed',
                  boxShadow: hasStock ? '0 4px 18px rgba(240,224,64,0.3)' : 'none',
                }}
                onMouseEnter={(e) => { if (hasStock) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'none' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-[18px] h-[18px]">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                </svg>
                {hasStock ? 'AGREGAR AL CARRITO' : 'SIN STOCK'}
              </button>

              {/* Vendedor */}
              {producto.seller && (
                <div
                  className="rounded-xl p-4 border"
                  style={{ background: 'var(--dark2)', borderColor: 'var(--dark4)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center rounded-full font-condensed font-black"
                      style={{ width: 42, height: 42, background: 'var(--slate)', color: 'var(--yellow)', fontSize: '1.1rem' }}
                    >
                      {producto.seller[0]?.toUpperCase() || 'V'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs uppercase font-condensed" style={{ color: 'var(--gray)', letterSpacing: '0.1em' }}>
                        Vendido por
                      </div>
                      <div className="font-condensed font-bold truncate" style={{ color: 'var(--white)', fontSize: '0.95rem' }}>
                        {producto.seller}
                      </div>
                      <div className="text-[11px] uppercase font-condensed mt-0.5" style={{ color: 'var(--gray)', letterSpacing: '0.08em' }}>
                        Vendedor verificado
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold" style={{ color: 'var(--white)' }}>4.8/5</div>
                      <div className="text-xs" style={{ color: '#fbbf24' }}>★★★★★</div>
                    </div>
                  </div>

                  {/* Testimonials */}
                  <div className="border-t mt-4 pt-3" style={{ borderColor: 'var(--dark4)' }}>
                    <div className="mb-2 text-xs font-condensed font-bold uppercase" style={{ color: 'var(--gray)', letterSpacing: '0.08em' }}>
                      Opiniones recientes
                    </div>
                    <div className="space-y-2">
                      {SELLER_TESTIMONIALS.map((comment) => (
                        <div
                          key={comment}
                          className="rounded-lg px-3 py-2 text-sm"
                          style={{ background: 'var(--dark3)', border: '1px solid var(--dark4)', color: 'var(--gray2)' }}
                        >
                          “{comment}”
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Beneficios */}
              <div
                className="rounded-xl p-4 border space-y-2 text-sm"
                style={{ background: 'var(--dark2)', borderColor: 'var(--dark4)', color: 'var(--gray2)' }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: 'var(--yellow)' }}>✓</span>
                  Garantía de compatibilidad ClavelParts
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: 'var(--yellow)' }}>✓</span>
                  Envío en 2-4 días hábiles
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: 'var(--yellow)' }}>✓</span>
                  Pago seguro con MercadoPago
                </div>
              </div>
            </section>
          </div>

          {/* ── Descripción ── */}
          {producto.description && (
            <section
              className="mt-6 md:mt-8 rounded-2xl border p-5 md:p-6"
              style={{ background: 'var(--dark2)', borderColor: 'var(--dark4)' }}
            >
              <div
                className="font-condensed font-extrabold uppercase mb-3"
                style={{ color: 'var(--yellow)', fontSize: '1.1rem', letterSpacing: '0.06em' }}
              >
                Descripción
              </div>
              <p style={{ color: 'var(--gray2)', lineHeight: 1.65 }}>
                {producto.description}
              </p>
            </section>
          )}

          {/* ── Ficha técnica ── */}
          {producto.attributes.length > 0 && (
            <section
              className="mt-6 rounded-2xl border p-5 md:p-6"
              style={{ background: 'var(--dark2)', borderColor: 'var(--dark4)' }}
            >
              <div
                className="font-condensed font-extrabold uppercase mb-4"
                style={{ color: 'var(--yellow)', fontSize: '1.1rem', letterSpacing: '0.06em' }}
              >
                Ficha técnica
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {producto.attributes.map((attribute) => (
                  <div
                    key={`${attribute.label}-${attribute.value}`}
                    className="rounded-lg p-3"
                    style={{ background: 'var(--dark3)', border: '1px solid var(--dark4)' }}
                  >
                    <div className="text-xs font-condensed font-bold uppercase mb-1" style={{ color: 'var(--gray)', letterSpacing: '0.08em' }}>
                      {attribute.label}
                    </div>
                    <div style={{ color: 'var(--white)' }}>
                      {attribute.value}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Compatibilidades ── */}
          {compatibilityGroups.length > 0 && (
            <section
              className="mt-6 rounded-2xl border p-5 md:p-6"
              style={{ background: 'var(--dark2)', borderColor: 'var(--dark4)' }}
            >
              <div
                className="font-condensed font-extrabold uppercase mb-4 flex items-center gap-2"
                style={{ color: 'var(--yellow)', fontSize: '1.1rem', letterSpacing: '0.06em' }}
              >
                Compatible con
                <span className="text-xs font-normal" style={{ color: 'var(--gray)', letterSpacing: '0.04em' }}>
                  ({producto.compatibility.length} vehículo{producto.compatibility.length === 1 ? '' : 's'})
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {compatibilityGroups.map((group) => {
                  const visibleItems = compatExpanded ? group.items : group.items.slice(0, 4)
                  return (
                    <div key={group.brand}>
                      <div className="mb-2 text-xs font-condensed font-bold uppercase" style={{ color: 'var(--gray)', letterSpacing: '0.1em' }}>
                        {group.brand}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {visibleItems.map((item) => (
                          <span
                            key={item}
                            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm"
                            style={{ background: 'var(--dark3)', border: '1px solid var(--dark4)', color: 'var(--gray2)' }}
                          >
                            <span aria-hidden style={{ opacity: 0.6 }}>🚗</span>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {producto.compatibility.length > 4 && (
                <button
                  type="button"
                  onClick={() => setCompatExpanded((v) => !v)}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-condensed font-bold uppercase transition-colors"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--yellow)',
                    cursor: 'pointer',
                    letterSpacing: '0.06em',
                    padding: 0,
                  }}
                >
                  {compatExpanded ? '↑ Ver menos' : '↓ Ver más compatibilidades'}
                </button>
              )}
            </section>
          )}
        </div>
      </main>

      {/* ── CTA sticky mobile ── */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-[400] border-t flex items-center gap-3 px-4 py-3"
        style={{ background: 'var(--dark2)', borderColor: 'var(--dark4)', boxShadow: '0 -8px 24px rgba(0,0,0,0.4)' }}
      >
        <div className="flex flex-col min-w-0">
          <span className="text-xs uppercase font-condensed" style={{ color: 'var(--gray)', letterSpacing: '0.08em' }}>
            Precio
          </span>
          <span className="font-condensed font-black" style={{ color: 'var(--yellow)', fontSize: '1.3rem', lineHeight: 1 }}>
            ${producto.price.toLocaleString('es-AR')}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!hasStock}
          className="flex-1 flex items-center justify-center gap-2 rounded-full font-condensed font-black italic uppercase"
          style={{
            padding: '0.85rem 1rem',
            background: hasStock ? 'var(--yellow)' : 'var(--dark3)',
            color: hasStock ? 'var(--text-dark)' : 'var(--gray)',
            border: 'none',
            fontSize: '0.95rem',
            letterSpacing: '0.05em',
            cursor: hasStock ? 'pointer' : 'not-allowed',
          }}
        >
          {hasStock ? 'AGREGAR' : 'SIN STOCK'}
        </button>
      </div>

      {/* Modal zoom imagen */}
      {zoomOpen && producto.images[imagenActiva] && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.92)' }}
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setZoomOpen(false) }}
            className="absolute top-4 right-4 rounded-full flex items-center justify-center transition-colors"
            style={{
              width: 40, height: 40,
              background: 'rgba(255,255,255,0.1)',
              color: 'var(--white)',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
            }}
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18 }}>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={producto.images[imagenActiva]}
            alt={`${producto.name} ampliada`}
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* Toast */}
      <div className={`toast ${toast ? 'show' : ''}`}>
        ✓ Agregado al carrito
      </div>
    </div>
  )
}
