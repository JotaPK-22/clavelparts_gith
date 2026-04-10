import { useState, useEffect } from 'react'
import { getBrands, getModelsByBrand, getYearsByModel, getVersionsByModelAndYear, Brand, Model, Version } from '@/lib/supabaseVehicles'
import { getCarImageUrl } from '@/lib/vehicleData'
import { useAppStore } from '@/lib/cartStore'

export default function VehicleSelector() {
  const { setVehicle, clearVehicle, setView, setSearchQuery } = useAppStore()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [model, setModel] = useState<Model | null>(null)
  const [year, setYear] = useState<number | null>(null)
  const [version, setVersion] = useState<Version | null>(null)
  const [partQuery, setPartQuery] = useState('')

  // Estados para datos del Supabase
  const [brands, setBrands] = useState<Brand[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [years, setYears] = useState<number[]>([])
  const [versions, setVersions] = useState<Version[]>([])

  // Estados de carga
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar marcas al montar el componente
  useEffect(() => {
    const loadBrands = async () => {
      try {
        setLoading(true)
        const brandsList = await getBrands()
        setBrands(brandsList)
      } catch (err) {
        setError('Error al cargar marcas')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadBrands()
  }, [])

  // Cargar modelos cuando cambia la marca
  useEffect(() => {
    if (!brand) {
      setModels([])
      setModel(null)
      return
    }

    const loadModels = async () => {
      try {
        setLoading(true)
        const modelsList = await getModelsByBrand(brand.id)
        setModels(modelsList)
        setModel(null)
        setYears([])
        setYear(null)
        setVersions([])
        setVersion(null)
      } catch (err) {
        setError('Error al cargar modelos')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadModels()
  }, [brand])

  // Cargar años cuando cambia el modelo
  useEffect(() => {
    if (!brand || !model) {
      setYears([])
      setYear(null)
      return
    }

    const loadYears = async () => {
      try {
        setLoading(true)
        const yearsList = await getYearsByModel(model.id)
        setYears(yearsList)
        setYear(null)
        setVersions([])
        setVersion(null)
      } catch (err) {
        setError('Error al cargar años')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadYears()
  }, [brand, model])

  // Cargar versiones cuando cambia el año
  useEffect(() => {
    if (!brand || !model || !year) {
      setVersions([])
      setVersion(null)
      return
    }

    const loadVersions = async () => {
      try {
        setLoading(true)
        const versionsList = await getVersionsByModelAndYear(model.id, year)
        setVersions(versionsList)
        setVersion(null)
      } catch (err) {
        setError('Error al cargar versiones')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadVersions()
  }, [brand, model, year])

  const isComplete = Boolean(brand && model && year && version)
  const hasTextQuery = partQuery.trim().length >= 2

  function syncSelectedVehicle() {
    if (!brand || !model || !year || !version) return false

    setVehicle({
      brand: brand.nombre,
      model: model.nombre,
      engine: version.motor_codigo,
      year: year.toString(),
      versionLabel: version.version,
      versionId: version.id,
    })

    return true
  }

  function handleVehicleSearch() {
    if (!syncSelectedVehicle()) return
    setSearchQuery(partQuery)
    setView('results')
  }

  function handlePartSearch() {
    const hasVehicle = syncSelectedVehicle()

    if (!hasVehicle && !hasTextQuery) return
    if (!hasVehicle) clearVehicle()

    setSearchQuery(partQuery)
    setView('results')
  }

  const selectClass = `
    w-full px-[1.1rem] py-[0.78rem] rounded-full
    font-condensed font-bold text-[1rem] uppercase tracking-[0.05em]
    cursor-pointer transition-shadow duration-200 border-none
    text-[var(--text-dark)] bg-white select-arrow
    focus:outline-none focus:ring-2 focus:ring-[var(--yellow)]
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  return (
    <div
      className="flex flex-col justify-start gap-[0.85rem] px-[1.8rem] py-8 border-r-2"
      style={{
        background: 'var(--dark3)',
        borderColor: 'var(--dark4)',
        width: 400,
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <p
        className="text-center font-condensed font-black italic uppercase text-white mb-1"
        style={{ fontSize: '1.55rem', letterSpacing: '0.06em' }}
      >
        ¿QUÉ AUTO <span style={{ color: 'var(--yellow)' }}>TENÉS?</span>
      </p>

      {error && (
        <div className="p-3 rounded bg-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Brand */}
      <select
        className={selectClass}
        value={brand?.id || ''}
        onChange={(e) => {
          const selectedBrand = brands.find(b => b.id === parseInt(e.target.value))
          setBrand(selectedBrand || null)
        }}
        disabled={loading}
      >
        <option value="">MARCA {loading && '(Cargando...)'}</option>
        {brands.map((b) => (
          <option key={b.id} value={b.id}>{b.nombre}</option>
        ))}
      </select>

      {/* Model */}
      <select
        className={selectClass}
        value={model?.id || ''}
        onChange={(e) => {
          const selectedModel = models.find(m => m.id === parseInt(e.target.value))
          setModel(selectedModel || null)
        }}
        disabled={!brand || loading}
      >
        <option value="">MODELO {loading && '(Cargando...)'}</option>
        {models.map((m) => (
          <option key={m.id} value={m.id}>{m.nombre}</option>
        ))}
      </select>

      {/* Year */}
      <select
        className={selectClass}
        value={year || ''}
        onChange={(e) => setYear(parseInt(e.target.value) || null)}
        disabled={!model || loading}
      >
        <option value="">AÑO {loading && '(Cargando...)'}</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      {/* Version */}
      <select
        className={selectClass}
        value={version?.id || ''}
        onChange={(e) => {
          const selectedVersion = versions.find(v => v.id === parseInt(e.target.value))
          setVersion(selectedVersion || null)
        }}
        disabled={!year || loading}
      >
        <option value="">VERSIÓN {loading && '(Cargando...)'}</option>
        {versions.map((v) => (
          <option key={v.id} value={v.id}>{v.version}</option>
        ))}
      </select>

      {/* Car preview — appears once brand+model are selected */}
      {model && (
        <div
          className="rounded-lg overflow-hidden border transition-all duration-300"
          style={{ background: '#fff', borderColor: 'rgba(255,255,255,0.12)' }}
        >
          {/* White-bg car image (Imagin.studio or local photo) */}
          <div style={{ background: '#f5f5f5', position: 'relative' }}>
            <img
              src={getCarImageUrl(brand!.nombre, model.nombre, year?.toString())}
              alt={`${brand!.nombre} ${model.nombre}`}
              style={{
                width: '100%',
                height: 160,
                objectFit: 'contain',
                display: 'block',
                padding: '0.5rem 1rem',
              }}
              onError={(e) => {
                // fallback: hide if Imagin.studio doesn't have this model
                (e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
          <div className="px-4 py-3 font-condensed" style={{ background: 'var(--dark4)' }}>
            <div className="font-extrabold uppercase tracking-[0.05em]" style={{ fontSize: '1rem', color: 'var(--yellow)' }}>
              {brand!.nombre} {model.nombre}
            </div>
            {(version || year) && (
              <div className="mt-0.5" style={{ fontSize: '0.82rem', color: 'var(--gray)' }}>
                {[version?.version, year].filter(Boolean).join(' · ')}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={handleVehicleSearch}
        disabled={!isComplete || loading}
        className="w-full flex items-center justify-center gap-2 rounded-full font-condensed font-black italic uppercase transition-all duration-150 mt-1"
        style={{
          padding: '0.85rem 1.1rem',
          background: isComplete && !loading ? 'var(--yellow)' : '#999',
          color: isComplete && !loading ? 'var(--text-dark)' : '#666',
          fontSize: '1.1rem',
          letterSpacing: '0.08em',
          border: 'none',
          cursor: isComplete && !loading ? 'pointer' : 'not-allowed',
          boxShadow: '0 4px 18px rgba(240,224,64,0.3)',
          opacity: isComplete && !loading ? 1 : 0.7,
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-[18px] h-[18px]">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        {loading ? 'CARGANDO...' : isComplete ? 'VER REPUESTOS COMPATIBLES' : 'COMPLETÁ TU AUTO'}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-2 my-1">
        <div className="flex-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}/>
        <span className="text-[0.72rem] uppercase tracking-[0.1em] whitespace-nowrap" style={{ color: 'var(--gray)' }}>
          O BUSCÁ POR NOMBRE O CÓDIGO
        </span>
        <div className="flex-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}/>
      </div>

      {/* Text search */}
      <input
        type="text"
        value={partQuery}
        placeholder="Introducí el nombre o número de pieza…"
        className="w-full px-[1.1rem] py-[0.78rem] rounded-full font-barlow text-[0.9rem] transition-all duration-200 focus:outline-none"
        style={{
          background: 'var(--dark4)',
          border: '1px solid var(--slate)',
          color: 'var(--white)',
        }}
        onChange={(e) => setPartQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !loading && (hasTextQuery || isComplete)) {
            handlePartSearch()
          }
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--yellow)'
          e.target.style.boxShadow = '0 0 0 2px rgba(240,224,64,0.2)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--slate)'
          e.target.style.boxShadow = 'none'
        }}
      />

      <button
        onClick={handlePartSearch}
        disabled={(!hasTextQuery && !isComplete) || loading}
        className="w-full flex items-center justify-center gap-2 rounded-full font-condensed font-black italic uppercase transition-all duration-200"
        style={{
          padding: '0.85rem 1.1rem',
          background: hasTextQuery || isComplete ? 'var(--slate)' : '#444',
          color: 'var(--white)',
          fontSize: '1.1rem',
          letterSpacing: '0.08em',
          border: 'none',
          cursor: hasTextQuery || isComplete ? 'pointer' : 'not-allowed',
          opacity: hasTextQuery || isComplete ? 1 : 0.65,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--slate2)'
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--slate)'
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'none'
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-[18px] h-[18px]">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        {hasTextQuery ? 'BUSCAR POR NOMBRE O CÓDIGO' : isComplete ? 'BUSCAR REPUESTO' : 'ESCRIBÍ O SELECCIONÁ TU AUTO'}
      </button>

      <p className="text-center italic leading-[1.4]" style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>
        Solo te mostramos repuestos compatibles con tu vehículo exacto.<br />Cero margen de error.
      </p>
    </div>
  )
}
