'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'bot' | 'user'
  text: string
}

const initialMessages: Message[] = [
  { role: 'bot', text: '¡Hola fierrero! 👋 Soy el asistente de ClavelParts. ¿En qué te puedo ayudar?' },
  { role: 'bot', text: 'Podés consultarme sobre compatibilidad de repuestos, tu pedido, o cualquier duda técnica.' },
]

export default function ChatBot() {
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput]     = useState('')
  const [badge, setBadge]     = useState(true)
  const messagesEndRef          = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMsg() {
    const text = input.trim()
    if (!text) return
    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('')
    // Simulated bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: '¡Gracias por tu mensaje! Pronto conectaremos esto con un agente real. Por ahora el producto está en modo demo. 🔧' },
      ])
    }, 900)
  }

  function handleOpen() {
    setOpen(true)
    setBadge(false)
  }

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
            style={{ minHeight: 200, maxHeight: 260 }}
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
              className="flex items-center justify-center rounded-full flex-shrink-0 transition-transform duration-150 hover:scale-110"
              style={{
                width: 36, height: 36,
                background: 'var(--yellow)',
                border: 'none',
                cursor: 'pointer',
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
    </div>
  )
}
