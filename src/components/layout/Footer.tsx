'use client'

import Link from 'next/link'

// ⚠️ Placeholders — reemplazar por el email y número real cuando los tengan.
const CONTACT_EMAIL = 'hola@clavelparts.com.ar'
const CONTACT_WHATSAPP = '5491112345678' // país + área + número (Argentina)

export default function Footer() {
  return (
    <footer
      className="footer-flex flex items-center justify-between px-10 py-7 border-t flex-wrap gap-4"
      style={{ background: '#0a0b0d', borderColor: 'var(--dark3)' }}
    >
      <div
        className="font-condensed font-black italic uppercase text-white"
        style={{ fontSize: '1.4rem' }}
      >
        CLAVEL<span style={{ color: 'var(--yellow)' }}>PARTS</span>
      </div>

      <div style={{ fontSize: '0.78rem', color: '#666' }}>
        © 2026 ClavelParts · Marketplace de autopartes · Argentina
      </div>

      <div className="flex gap-6 items-center">
        <Link
          href="/solicitar-vendedor"
          className="footer-link"
          style={footerLinkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--yellow)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
        >
          Vender repuestos
        </Link>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="footer-link"
          style={footerLinkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--yellow)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
        >
          Contacto
        </a>

        <a
          href={`https://wa.me/${CONTACT_WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link flex items-center gap-1.5"
          style={footerLinkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--yellow)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}>
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
          </svg>
          WhatsApp
        </a>
      </div>
    </footer>
  )
}

const footerLinkStyle: React.CSSProperties = {
  fontSize: '0.82rem',
  color: '#888',
  textDecoration: 'none',
  fontFamily: '"Barlow Condensed", sans-serif',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  transition: 'color 0.2s',
}
