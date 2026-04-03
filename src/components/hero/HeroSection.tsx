'use client'

import VehicleSelector from './VehicleSelector'

export default function HeroSection() {
  return (
    <section
      className="grid"
      style={{
        gridTemplateColumns: '400px 1fr',
        minHeight: 'calc(100vh - 126px)',
      }}
    >
      {/* LEFT — Vehicle selector */}
      <VehicleSelector />

      {/* RIGHT — Visual */}
      <div className="relative overflow-hidden flex flex-col justify-end">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #0c0e10 0%, #141a22 55%, #0f1419 100%)' }}
        />
        <div className="hero-bg-grid absolute inset-0" />

        {/* Ghost car SVG */}
        <svg
          viewBox="0 0 900 380"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute"
          style={{ right: '-3%', bottom: '15%', width: '68%', opacity: 0.13 }}
        >
          <path d="M50 280 Q80 180 200 140 L380 100 L560 100 L720 140 Q840 180 860 280 L860 320 L50 320 Z" fill="white"/>
          <ellipse cx="220" cy="320" rx="80" ry="80" fill="white"/>
          <ellipse cx="680" cy="320" rx="80" ry="80" fill="white"/>
          <ellipse cx="220" cy="320" rx="40" ry="40" fill="#333"/>
          <ellipse cx="680" cy="320" rx="40" ry="40" fill="#333"/>
          <rect x="220" y="112" width="150" height="85" rx="12" fill="#aaa" opacity="0.5"/>
          <rect x="390" y="112" width="200" height="85" rx="12" fill="#aaa" opacity="0.5"/>
          <rect x="60" y="255" width="120" height="35" rx="6" fill="#f0e040" opacity="0.6"/>
          <rect x="720" y="255" width="120" height="35" rx="6" fill="#f0e040" opacity="0.4"/>
        </svg>

        {/* Overlay + text */}
        <div
          className="relative z-[2] px-[3.2rem] pb-[2.8rem] pt-12"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.25) 65%, transparent 100%)' }}
        >
          <span
            className="inline-block font-condensed font-bold uppercase mb-[1.1rem]"
            style={{
              background: 'var(--slate)',
              color: 'var(--gray2)',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              padding: '0.28rem 0.9rem',
              borderRadius: 3,
            }}
          >
            🔧 MARKETPLACE DE AUTOPARTES · ARGENTINA
          </span>

          <h1
            className="font-condensed font-black italic uppercase text-white"
            style={{
              fontSize: '4.5rem',
              lineHeight: 0.9,
              textShadow: '0 2px 24px rgba(0,0,0,0.7)',
              marginBottom: '1rem',
            }}
          >
            EL REPUESTO<br />
            <span style={{ color: 'var(--yellow)' }}>CORRECTO,</span><br />
            GARANTIZADO.
          </h1>

          <p
            className="mb-[1.8rem] leading-[1.6]"
            style={{ fontSize: '1rem', color: 'var(--gray)', maxWidth: 460 }}
          >
            Todos los repuestos disponibles en un solo lugar. Encontrá lo que necesitás en minutos, con compatibilidad verificada para tu vehículo exacto.
          </p>

          <a
            href="#waitlist"
            className="inline-flex items-center gap-[0.55rem] font-condensed font-black italic uppercase no-underline transition-all duration-150"
            style={{
              background: 'var(--yellow)',
              color: 'var(--text-dark)',
              fontSize: '1.1rem',
              letterSpacing: '0.08em',
              padding: '0.85rem 1.9rem',
              borderRadius: 4,
              boxShadow: '0 4px 18px rgba(240,224,64,0.22)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'
              ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 26px rgba(240,224,64,0.38)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'none'
              ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 18px rgba(240,224,64,0.22)'
            }}
          >
            QUIERO ACCESO ANTICIPADO
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>

        {/* Dots */}
        <div className="absolute bottom-7 right-[3.2rem] z-[3] flex gap-[0.45rem]">
          {[true, false, false].map((active, i) => (
            <div
              key={i}
              className="w-[9px] h-[9px] rounded-full cursor-pointer transition-colors duration-200"
              style={{ background: active ? 'var(--white)' : 'rgba(255,255,255,0.21)' }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
