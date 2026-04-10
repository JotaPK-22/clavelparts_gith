'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/cartStore'

// ── Tipos InfoAuto ────────────────────────────────────────────────────────────
interface IABrand {
  id: number
  name: string
  logo_url: string
  prices_from: number
  prices_to: number
}

interface IAGroup {
  id: number
  name: string
  prices_from: number
  prices_to: number
}

interface IAModel {
  codia: number
  description: string
  prices_from: number | null
  prices_to: number | null
  photo_url: string | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function yr(from: number, to: number): string[] {
  const years: string[] = []
  for (let y = to; y >= from; y--) years.push(String(y))
  return years
}

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} → ${res.status}`)
  return res.json() as Promise<T>
}

// ── Componente ────────────────────────────────────────────────────────────────
export default function VehicleSelector() {
  const { setVehicle, setView } = useAppStore()

  // Selecciones del usuario
  const [brandId,   setBrandId]   = useState<number | null>(null)
  const [groupId,   setGroupId]   = useState<number | null>(null)
  const [brandName, setBrandName] = useState('')
  const [groupName, setGroupName] = useState('')
  const [engine,    setEngine]    = useState('')
  const [year,      setYear]      = useState('')
  const [photoUrl,  setPhotoUrl]  = useState<string | null>(null)

  // Listas dinámicas
  const [brands, setBrands] = useState<IABrand[]>([])
  const [groups, setGroups] = useState<IAGroup[]>([])
  const [models, setModels] = useState<IAModel[]>([])
  const [years,  setYears]  = useState<string[]>([])

  // Loading / error — el error solo se muestra si las MARCAS fallan
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [loadingModels, setLoadingModels] = useState(false)
  const [brandsError,   setBrandsError]   = useState<string | null>(null)

  // ── Cargar marcas al montar ───────────────────────────────────────────────
  useEffect(() => {
    setLoadingBrands(true)
    setBrandsError(null)
    apiFetch<IABrand[]>('/api/infoauto/brands')
      .then((data) => setBrands(Array.isArray(data) ? data : []))
      .catch((e) => setBrandsError(String(e)))
      .finally(() => setLoadingBrands(false))
  }, [])

  // ── Cargar grupos cuando cambia la marca ─────────────────────────────────
  useEffect(() => {
    if (!brandId) return
    setLoadingGroups(true)
    setGroups([]); setGroupId(null); setGroupName('')
    setModels([]); setEngine(''); setYears([]); setYear(''); setPhotoUrl(null)
    apiFetch<IAGroup[]>(`/api/infoauto/groups?brand_id=${brandId}`)
      .then((data) => setGroups(Array.isArray(data) ? data : []))
      .catch(() => setGroups([]))
      .finally(() => setLoadingGroups(false))
  }, [brandId])

  // ── Cargar modelos cuando cambia el grupo ────────────────────────────────
  useEffect(() => {
    if (!brandId || !groupId) return
    setLoadingModels(true)
    setModels([]); setEngine(''); setYears([]); setYear(''); setPhotoUrl(null)
    apiFetch<IAModel[]>(`/api/infoauto/models?brand_id=${brandId}&group_id=${groupId}`)
      .then((data) => setModels(Array.isArray(data) ? data : []))
      .catch(() => setModels([]))
      .finally(() => setLoadingModels(false))
  }, [brandId, groupId])

  // ── Generar años cuando se elige versión ────────────────────────────────
  function handleEngineChange(description: string) {
    setEngine(description)
    setYear('')
    const m = models.find((x) => x.description === description)
    if (m) {
      setPhotoUrl(m.photo_url)
      if (m.prices_from && m.prices_to) {
        setYears(yr(m.prices_from, m.prices_to))
      } else {
        setYears([])
      }
    }
  }

  const isComplete  = brandName && groupName && engine && year
  const previewImage = photoUrl ?? null

  function handleSearch() {
    if (!isComplete) return
    setVehicle({ brand: brandName, model: groupName, engine, year })
    setView('results')
  }

  // ── Estilos ────────────────────────────────────────────────────────────────
  const selectClass = `
    w-full px-[1.1rem] py-[0.78rem] rounded-full
    font-condensed font-bold text-[1rem] uppercase tracking-[0.05em]
    cursor-pointer transition-shadow duration-200 border-none
    text-[var(--text-dark)] bg-white select-arrow
    focus:outline-none focus:ring-2 focus:ring-[var(--yellow)]
    disabled:opacity-40 disabled:cursor-not-allowed
  `

  return (
    <div
      className="flex flex-col justify-center gap-[0.85rem] px-[1.8rem] py-8 border-r-2"
      style={{ background: 'var(--dark3)', borderColor: 'var(--dark4)', width: 400, minHeight: 'calc(100vh - 126px)' }}
    >
      <p
        className="text-center font-condensed font-black italic uppercase text-white mb-1"
        style={{ fontSize: '1.55rem', letterSpacing: '0.06em' }}
      >
        ¿QUÉ AUTO <span style={{ color: 'var(--yellow)' }}>TENÉS?</span>
      </p>

      {/* Error de API — solo se muestra si las marcas no pudieron cargar */}
      {brandsError && (
        <div
          className="text-center font-condensed rounded-lg px-3 py-2"
          style={{ background: 'rgba(204,17,17,0.12)', border: '1px solid rgba(204,17,17,0.3)', color: '#ff7070', fontSize: '0.75rem' }}
        >
          ⚠️ No se pudo conectar con InfoAuto.<br />
          <span style={{ opacity: 0.7 }}>Verificá las credenciales en .env.local</span>
        </div>
      )}

      {/* ── MARCA ── */}
      <div className="relative">
        <select
          className={selectClass}
          value={brandId ?? ''}
          disabled={loadingBrands || !!brandsError}
          onChange={(e) => {
            const id = Number(e.target.value)
            const b  = brands.find((x) => x.id === id)
            setBrandId(id || null)
            setBrandName(b?.name ?? '')
          }}
        >
          <option value="">
            {loadingBrands ? 'CARGANDO MARCAS…' : 'MARCA'}
          </option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        {loadingBrands && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* ── MODELO (grupo) ── */}
      <div className="relative">
        <select
          className={selectClass}
          value={groupId ?? ''}
          disabled={!brandId || loadingGroups}
          onChange={(e) => {
            const id = Number(e.target.value)
            const g  = groups.find((x) => x.id === id)
            setGroupId(id || null)
            setGroupName(g?.name ?? '')
          }}
        >
          <option value="">
            {loadingGroups ? 'CARGANDO MODELOS…' : 'MODELO'}
          </option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
        {loadingGroups && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* ── VERSIÓN / MOTOR ── */}
      <div className="relative">
        <select
          className={selectClass}
          value={engine}
          disabled={!groupId || loadingModels}
          onChange={(e) => handleEngineChange(e.target.value)}
        >
          <option value="">
            {loadingModels ? 'CARGANDO VERSIONES…' : 'MOTOR / VERSIÓN'}
          </option>
          {models.map((m) => (
            <option key={m.codia} value={m.description}>{m.description}</option>
          ))}
        </select>
        {loadingModels && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* ── AÑO ── */}
      <select
        className={selectClass}
        value={year}
        disabled={!engine || years.length === 0}
        onChange={(e) => setYear(e.target.value)}
      >
        <option value="">AÑO</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      {/* ── Preview imagen ── */}
      {previewImage && (
        <div
          className="rounded-lg overflow-hidden border transition-all duration-300"
          style={{ background: '#fff', borderColor: 'rgba(255,255,255,0.12)' }}
        >
          <div style={{ background: '#f5f5f5' }}>
            <img
              src={previewImage}
              alt={`${brandName} ${groupName}`}
              style={{ width: '100%', height: 160, objectFit: 'contain', display: 'block', padding: '0.5rem 1rem' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
          </div>
          <div className="px-4 py-3 font-condensed" style={{ background: 'var(--dark4)' }}>
            <div className="font-extrabold uppercase tracking-[0.05em]" style={{ fontSize: '1rem', color: 'var(--yellow)' }}>
              {brandName} {groupName}
            </div>
            {(engine || year) && (
              <div className="mt-0.5" style={{ fontSize: '0.82rem', color: 'var(--gray)' }}>
                {[engine, year].filter(Boolean).join(' · ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      {isComplete && (
        <button
          onClick={handleSearch}
          className="w-full flex items-center justify-center gap-2 rounded-full font-condensed font-black italic uppercase transition-all duration-150 mt-1"
          style={{
            padding: '0.85rem 1.1rem',
            background: 'var(--yellow)',
            color: 'var(--text-dark)',
            fontSize: '1.1rem',
            letterSpacing: '0.08em',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 18px rgba(240,224,64,0.3)',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'none' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-[18px] h-[18px]">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          VER REPUESTOS COMPATIBLES
        </button>
      )}

      {/* ── Divider ── */}
      <div className="flex items-center gap-2 my-1">
        <div className="flex-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}/>
        <span className="text-[0.72rem] uppercase tracking-[0.1em] whitespace-nowrap" style={{ color: 'var(--gray)' }}>
          O BUSCÁ POR NOMBRE O CÓDIGO
        </span>
        <div className="flex-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}/>
      </div>

      {/* ── Búsqueda por texto ── */}
      <input
        type="text"
        placeholder="Introducí el nombre o número de pieza…"
        className="w-full px-[1.1rem] py-[0.78rem] rounded-full font-barlow text-[0.9rem] transition-all duration-200 focus:outline-none"
        style={{ background: 'var(--dark4)', border: '1px solid var(--slate)', color: 'var(--white)' }}
        onFocus={(e) => { e.target.style.borderColor = 'var(--yellow)'; e.target.style.boxShadow = '0 0 0 2px rgba(240,224,64,0.2)' }}
        onBlur={(e)  => { e.target.style.borderColor = 'var(--slate)';  e.target.style.boxShadow = 'none' }}
      />

      <button
        className="w-full flex items-center justify-center gap-2 rounded-full font-condensed font-black italic uppercase transition-all duration-200"
        style={{ padding: '0.85rem 1.1rem', background: 'var(--slate)', color: 'var(--white)', fontSize: '1.1rem', letterSpacing: '0.08em', border: 'none', cursor: 'pointer' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--slate2)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--slate)';  (e.currentTarget as HTMLButtonElement).style.transform = 'none' }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-[18px] h-[18px]">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        BUSCAR REPUESTO
      </button>

      <p className="text-center italic leading-[1.4]" style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>
        Solo te mostramos repuestos compatibles con tu vehículo exacto.<br />Cero margen de error.
      </p>
    </div>
  )
}
