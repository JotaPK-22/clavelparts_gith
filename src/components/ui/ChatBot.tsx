'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'bot' | 'user'
  text: string
}

const QUICK_REPLIES = ['Envío', 'Compatibilidad', 'Pago', 'Garantía', 'Vender']

const initialMessages: Message[] = [
  { role: 'bot', text: '¡Hola fierrero! 👋 Soy el asistente de ClavelParts. ¿En qué te puedo ayudar?' },
  { role: 'bot', text: 'Probá preguntando por envíos, compatibilidad, pagos o garantía — o tocá una de las opciones de abajo.' },
]

// ── Respuestas por keywords ────────────────────────────────────
type Reply = {
  keywords: string[]
  response: string
}

const REPLIES: Reply[] = [
  {
    keywords: ['compatib', 'sirve', 'anda en mi', 'funciona en', 'para mi auto', 'mi vehiculo', 'mi vehículo'],
    response: 'Para chequear compatibilidad ingresá tu auto en el selector del home (marca, modelo, año, versión) y te muestro solo los repuestos que andan en tu vehículo. Si te aparece "Sin repuestos disponibles", dejame tu mail y te aviso cuando alguien lo cargue.',
  },
  {
    keywords: ['envio', 'envío', 'entrega', 'andreani', 'cuanto tarda', 'cuánto tarda', 'llega', 'dias', 'días', 'shipping'],
    response: 'Trabajamos con Andreani. Envío gratis a todo el país. Tiempos: 2-4 días hábiles en CABA y GBA, 3-6 días en el resto del país. Al confirmar la compra recibís un código de seguimiento por mail.',
  },
  {
    keywords: ['pago', 'pagar', 'tarjeta', 'mercadopago', 'mercado pago', 'cuota', 'transferencia', 'efectivo', 'rapipago', 'pago facil', 'pago fácil', 'debito', 'débito', 'credito', 'crédito'],
    response: 'Pagás con MercadoPago: tarjeta de crédito o débito, dinero en cuenta, transferencia, o Rapipago / Pago Fácil. Hasta 12 cuotas sin interés según el vendedor y la promo del momento.',
  },
  {
    keywords: ['garant', 'devol', 'cambio', 'no anda', 'no funcion', 'no sirve', 'falla', 'roto', 'defectuoso'],
    response: 'Todos los repuestos tienen 30 días de garantía contra fallas de fábrica. Si la pieza no es compatible con tu auto, te la cambiamos sin costo (garantía de compatibilidad ClavelParts). Para devoluciones, escribinos desde "Mi cuenta → Mis pedidos" dentro de los 10 días de recibido.',
  },
  {
    keywords: ['vender', 'publicar', 'soy vendedor', 'alta de vendedor', 'cargar producto', 'subir repuesto', 'mi negocio', 'mi repuestera'],
    response: 'Para vender: tocá "Iniciar sesión" arriba a la derecha → "Registrate acá" → completás el formulario corto de solicitud. Te activamos la cuenta en 24-48 hs y desde el panel cargás tus repuestos con un wizard de 3 pasos. La comisión es 7% por venta (vs 16% de Mercado Libre).',
  },
  {
    keywords: ['categoria', 'categoría', 'tipo de repuesto', 'que repuestos', 'qué repuestos', 'tienen', 'venden', 'catalogo', 'catálogo'],
    response: 'Tenemos motor, frenos, suspensión y dirección, eléctrico, filtros, carrocería, ópticas y más. Lo mejor es ingresar tu auto en el selector del home — te filtro automáticamente solo lo compatible. Si te falta algo, pedímelo y te aviso cuando esté disponible.',
  },
  {
    keywords: ['cuenta', 'registr', 'login', 'logueo', 'logear', 'contraseña', 'contrasena', 'olvide', 'olvidé', 'recuper'],
    response: 'Para crear tu cuenta o ingresar: botón "Iniciar sesión" arriba a la derecha. Podés entrar con mail + contraseña o con Google. Si olvidaste tu clave hay link de recuperación en la pantalla de login.',
  },
  {
    keywords: ['humano', 'asesor', 'persona', 'agente', 'telefono', 'teléfono', 'whatsapp', 'wpp', 'numero', 'número', 'hablar con', 'contacto', 'contactar'],
    response: 'Para hablar con un asesor humano, escribinos por WhatsApp al +54 9 11 1234-5678 (lun a vie de 9 a 18 hs). Te responden en menos de 30 minutos en horario laboral.',
  },
]

const DEFAULT_RESPONSE = 'No estoy seguro de haber entendido. ¿Querés que te ayude con envíos, compatibilidad, formas de pago, garantía, o cómo vender repuestos? También podés escribirnos al WhatsApp +54 9 11 1234-5678 para hablar con un asesor.'

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

function findReply(userMsg: string): string {
  const normalized = normalize(userMsg)
  for (const reply of REPLIES) {
    if (reply.keywords.some((kw) => normalized.includes(normalize(kw)))) {
      return reply.response
    }
  }
  return DEFAULT_RESPONSE
}

export default function ChatBot() {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput]       = useState('')
  const [badge, setBadge]       = useState(true)
  const [typing, setTyping]     = useState(false)
  const messagesEndRef          = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function reply(userText: string) {
    if (!userText.trim()) return
    setMessages((prev) => [...prev, { role: 'user', text: userText }])
    setInput('')
    setTyping(true)
    // Pequeño delay para simular que el bot está escribiendo
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'bot', text: findReply(userText) }])
      setTyping(false)
    }, 900)
  }

  function sendMsg() {
    reply(input)
  }

  function handleQuickReply(label: string) {
    reply(label)
  }

  function handleOpen() {
    setOpen(true)
    setBadge(false)
  }

  // Solo mostramos las quick replies cuando no ha habido conversación todavía
  const showQuickReplies = messages.length === initialMessages.length && !typing

  return (
    <div className="fixed z-[500]" style={{ bottom: '2rem', right: '2rem' }}>
      {/* Chat window */}
      {open && (
        <div
          className="absolute flex flex-col overflow-hidden rounded-xl"
          style={{
            bottom: 70,
            right: 0,
            width: 340,
            background: 'var(--dark2)',
            border: '1px solid var(--dark4)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ background: 'var(--slate)' }}
          >
            <div
              className="flex items-center justify-center w-9 h-9 rounded-full text-xl flex-shrink-0"
              style={{ background: 'var(--yellow)' }}
            >
              🔧
            </div>
            <div className="flex-1">
              <div
                className="font-condensed font-extrabold uppercase text-white"
                style={{ fontSize: '1rem' }}
              >
                Soporte ClavelParts
              </div>
              <div
                className="flex items-center gap-1"
                style={{ fontSize: '0.75rem', color: '#6ee7b7' }}
              >
                <span
                  className="inline-block rounded-full"
                  style={{ width: 7, height: 7, background: '#6ee7b7' }}
                />
                En línea
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--gray)', fontSize: '1.3rem', cursor: 'pointer', lineHeight: 1 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--white)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray)')}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex flex-col gap-3 p-4 overflow-y-auto"
            style={{ minHeight: 240, maxHeight: 360 }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col gap-1 ${msg.role === 'bot' ? 'items-start' : 'items-end'}`}
              >
                <div
                  className="rounded-xl leading-[1.5]"
                  style={{
                    padding: '0.6rem 0.9rem',
                    fontSize: '0.87rem',
                    maxWidth: '85%',
                    background: msg.role === 'bot' ? 'var(--dark3)' : 'var(--slate)',
                    color: msg.role === 'bot' ? 'var(--gray2)' : 'var(--white)',
                    borderBottomLeftRadius: msg.role === 'bot' ? 3 : undefined,
                    borderBottomRightRadius: msg.role === 'user' ? 3 : undefined,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Indicador "escribiendo…" */}
            {typing && (
              <div className="flex items-start">
                <div
                  className="rounded-xl flex items-center gap-1"
                  style={{
                    padding: '0.7rem 0.9rem',
                    background: 'var(--dark3)',
                    borderBottomLeftRadius: 3,
                  }}
                >
                  <span className="typing-dot" />
                  <span className="typing-dot" style={{ animationDelay: '0.15s' }} />
                  <span className="typing-dot" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}

            {/* Quick replies — solo al inicio */}
            {showQuickReplies && (
              <div className="flex flex-wrap gap-2 mt-1">
                {QUICK_REPLIES.map((label) => (
                  <button
                    key={label}
                    onClick={() => handleQuickReply(label)}
                    className="font-condensed font-bold uppercase transition-colors"
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 999,
                      background: 'transparent',
                      border: '1px solid var(--yellow)',
                      color: 'var(--yellow)',
                      fontSize: '0.72rem',
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'var(--yellow)'
                      ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dark)'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                      ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--yellow)'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="flex gap-2 p-3 border-t"
            style={{ borderColor: 'var(--dark3)' }}
          >
            <input
              type="text"
              placeholder="Escribí tu consulta…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
              className="flex-1 rounded-[20px] font-barlow focus:outline-none transition-colors duration-200"
              style={{
                padding: '0.6rem 0.9rem',
                background: 'var(--dark3)',
                border: '1px solid var(--dark4)',
                color: 'var(--white)',
                fontSize: '0.88rem',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--slate2)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--dark4)')}
            />
            <button
              onClick={sendMsg}
              disabled={typing || !input.trim()}
              className="flex items-center justify-center rounded-full flex-shrink-0 transition-transform duration-150 hover:scale-110"
              style={{
                width: 36, height: 36,
                background: 'var(--yellow)',
                border: 'none',
                cursor: typing || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: typing || !input.trim() ? 0.5 : 1,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-dark)" strokeWidth={2.5} className="w-4 h-4">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <div className="relative">
        <button
          onClick={handleOpen}
          className="flex items-center justify-center rounded-full transition-all duration-200"
          style={{
            width: 58, height: 58,
            background: 'var(--yellow)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(240,224,64,0.35)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 28px rgba(240,224,64,0.5)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'none'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(240,224,64,0.35)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-dark)" strokeWidth={2} className="w-[26px] h-[26px]">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        </button>

        {badge && (
          <div
            className="absolute flex items-center justify-center rounded-full font-bold text-white border-2"
            style={{
              top: -2, right: -2,
              width: 18, height: 18,
              background: '#e53e3e',
              borderColor: 'var(--dark)',
              fontSize: '0.65rem',
            }}
          >
            1
          </div>
        )}
      </div>

      <style jsx>{`
        :global(.typing-dot) {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gray2);
          animation: typingBlink 1.2s infinite ease-in-out;
        }
        @keyframes typingBlink {
          0%, 60%, 100% { opacity: 0.25; transform: scale(0.85); }
          30% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
