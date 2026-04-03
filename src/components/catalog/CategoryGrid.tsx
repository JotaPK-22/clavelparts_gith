'use client'

const categories = [
  { id: 'neumaticos',   name: 'Neumáticos y llantas', emoji: '🛞' },
  { id: 'frenos',       name: 'Frenos',                emoji: '🛑' },
  { id: 'motor',        name: 'Motor',                 emoji: '⚙️' },
  { id: 'filtros',      name: 'Filtros',               emoji: '🔶' },
  { id: 'amortiguacion',name: 'Amortiguación',         emoji: '🌀' },
  { id: 'embrague',     name: 'Embrague',              emoji: '⚡' },
  { id: 'electrico',    name: 'Sistema eléctrico',     emoji: '🔋' },
  { id: 'aceites',      name: 'Aceites y líquidos',    emoji: '🛢️' },
  { id: 'correas',      name: 'Correas y cadenas',     emoji: '〰️' },
  { id: 'carroceria',   name: 'Carrocería',            emoji: '🚘' },
  { id: 'suspension',   name: 'Suspensión',            emoji: '🔩' },
  { id: 'otros',        name: 'Otras categorías',      emoji: '📦' },
]

export default function CategoryGrid() {
  return (
    <section className="px-10 py-[4.5rem]" style={{ background: 'var(--light-bg)' }}>
      <div className="text-center mb-[2.8rem]">
        <h2
          className="font-condensed font-black italic uppercase tracking-[0.06em]"
          style={{ fontSize: '1.8rem', color: 'var(--text-dark)' }}
        >
          ENCONTRÁ REPUESTOS EN NUESTRO CATÁLOGO
        </h2>
      </div>

      <div
        className="grid gap-4 max-w-[1200px] mx-auto mb-8"
        style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}
      >
        {categories.map((cat) => (
          <a
            key={cat.id}
            href="#"
            className="cat-card flex flex-col items-center gap-[0.6rem] no-underline rounded-md py-5 px-3 transition-all duration-200"
            style={{
              background: 'var(--light-card)',
              border: '1px solid #e0e4e8',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.transform = 'translateY(-3px)'
              el.style.borderColor = 'var(--slate2)'
              el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.transform = 'none'
              el.style.borderColor = '#e0e4e8'
              el.style.boxShadow = 'none'
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{ fontSize: '3.5rem', height: 100, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' }}
            >
              {cat.emoji}
            </div>
            <div className="w-[7px] h-[7px] rounded-full" style={{ background: 'var(--slate2)' }} />
            <div
              className="text-center leading-[1.3] font-barlow font-semibold"
              style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}
            >
              {cat.name}
            </div>
          </a>
        ))}
      </div>

      <div className="text-center">
        <button
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
