'use client'

import { useState } from 'react'
import { brands, getModels, getEngines, getYears, getCarImageUrl } from '@/lib/vehicleData'
import { useAppStore } from '@/lib/cartStore'

export default function VehicleSelector() {
  const { setVehicle, setView } = useAppStore()
  const [brand, setBrand]   = useState('')
  const [model, setModel]   = useState('')
  const [engine, setEngine] = useState('')
  const [year, setYear]     = useState('')

  const models  = brand  ? getModels(brand)         : []
  const engines = model  ? getEngines(brand, model)  : []
  const years   = model  ? getYears(brand, model)    : []

  const isComplete   = brand && model && engine && year
  // Imagin.studio image: appears from brand+model, updates live when year changes
  const previewImage = model ? getCarImageUrl(brand, model, year || undefined) : null

  function handleSearch() {
    if (!isComplete) return
    setVehicle({ brand, model, engine, year })
    setView('results')
  }

  const selectClass = `
    w-full px-[1.1rem] py-[0.78rem] rounded-full
    font-condensed font-bold text-[1rem] uppercase tracking-[0.05em]
    cursor-pointer transition-shadow duration-200 border-none
    text-[var(--text-dark)] bg-white select-arrow
    focus:outline-none focus:ring-2 focus:ring-[var(--yellow)]
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

      {/* Brand */}
      <select className={selectClass} value={brand} onChange={(e) => { setBrand(e.target.value); setModel(''); setEngine(''); setYear('') }}>
        <option value="">MARCA</option>
        {brands.map((b) => <option key={b}>{b}</option>)}
      </select>

      {/* Model */}
      <select className={selectClass} value={model} disabled={!brand} onChange={(e) => { setModel(e.target.value); setEngine(''); setYear('') }}>
        <option value="">MODELO</option>
        {models.map((m) => <option key={m}>{m}</option>)}
      </select>

      {/* Engine/Version */}
      <select className={selectClass} value={engine} disabled={!model} onChange={(e) => { setEngine(e.target.value); setYear('') }}>
        <option value="">MOTOR / VERSIÓN</option>
        {engines.map((eng) => <option key={eng}>{eng}</option>)}
      </select>

      {/* Year */}
      <select className={selectClass} value={year} disabled={!engine} onChange={(e) => setYear(e.target.value)}>
        <option value="">AÑO</option>
        {years.map((y) => <option key={y}>{y}</option>)}
      </select>

      {/* Car preview — appears once brand+model are selected */}
      {previewImage && (
        <div
          className="rounded-lg overflow-hidden border transition-all duration-300"
          style={{ background: '#fff', borderColor: 'rgba(255,255,255,0.12)' }}
        >
          {/* White-bg car image (Imagin.studio or local photo) */}
          <div style={{ background: '#f5f5f5', position: 'relative' }}>
            <img
              src={previewImage}
              alt={`${brand} ${model}`}
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
              {brand} {model}
            </div>
            {(engine || year) && (
              <div className="mt-0.5" style={{ fontSize: '0.82rem', color: 'var(--gray)' }}>
                {[engine, year].filter(Boolean).join(' · ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
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
        placeholder="Introducí el nombre o número de pieza…"
        className="w-full px-[1.1rem] py-[0.78rem] rounded-full font-barlow text-[0.9rem] transition-all duration-200 focus:outline-none"
        style={{
          background: 'var(--dark4)',
          border: '1px solid var(--slate)',
          color: 'var(--white)',
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
        className="w-full flex items-center justify-center gap-2 rounded-full font-condensed font-black italic uppercase transition-all duration-200"
        style={{
          padding: '0.85rem 1.1rem',
          background: 'var(--slate)',
          color: 'var(--white)',
          fontSize: '1.1rem',
          letterSpacing: '0.08em',
          border: 'none',
          cursor: 'pointer',
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
        BUSCAR REPUESTO
      </button>

      <p className="text-center italic leading-[1.4]" style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>
        Solo te mostramos repuestos compatibles con tu vehículo exacto.<br />Cero margen de error.
      </p>
    </div>
  )
}
