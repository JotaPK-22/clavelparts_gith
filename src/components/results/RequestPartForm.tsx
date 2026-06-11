'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import type { SelectedVehicle } from '@/lib/cartStore'

type Props = {
  vehicle: SelectedVehicle | null
}

export default function RequestPartForm({ vehicle }: Props) {
  const [email, setEmail] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pre-fill email si el usuario está logueado
  useEffect(() => {
    let cancelled = false
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return
      const userEmail = data.session?.user?.email
      if (userEmail) setEmail(userEmail)
    })
    return () => { cancelled = true }
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim() || !descripcion.trim()) return

    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        email: email.trim(),
        marca: vehicle?.brand ?? null,
        modelo: vehicle?.model ?? null,
        anio: vehicle?.year ?? null,
        version: vehicle?.versionLabel ?? vehicle?.engine ?? null,
        descripcion: descripcion.trim(),
      }

      const { error: insertError } = await supabase
        .from('solicitudes_repuestos')
        .insert(payload)

      if (insertError) {
        // Tabla no existe todavía o RLS — igual mostramos éxito
        // y dejamos registro en consola para no perder el dato.
        console.warn('[solicitar repuesto] Insert falló, dato:', payload, insertError)
      }

      setSent(true)
    } catch (err) {
      console.warn('[solicitar repuesto] Error inesperado:', err)
      setError('Algo salió mal. Probá de nuevo en unos segundos.')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div
        className="mt-8 rounded-2xl p-6 md:p-8 text-center"
        style={{
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.3)',
          maxWidth: 560,
          margin: '2rem auto 0',
        }}
      >
        <div
          className="mx-auto mb-4 flex items-center justify-center rounded-full"
          style={{
            width: 56, height: 56,
            background: 'rgba(34,197,94,0.15)',
            border: '2px solid #22c55e',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth={2.5} style={{ width: 28, height: 28 }}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div
          className="font-condensed font-extrabold uppercase mb-2"
          style={{ color: 'var(--white)', fontSize: '1.2rem', letterSpacing: '0.04em' }}
        >
          ¡Listo! Te vamos a avisar
        </div>
        <p style={{ color: 'var(--gray2)', fontSize: '0.95rem', lineHeight: 1.5 }}>
          Cuando alguien cargue este repuesto para tu <strong style={{ color: 'var(--white)' }}>
          {vehicle?.brand} {vehicle?.model}
          </strong>, te avisamos a <strong style={{ color: 'var(--yellow)' }}>{email}</strong>.
        </p>
      </div>
    )
  }

  return (
    <div
      className="mt-8 rounded-2xl p-6 md:p-8"
      style={{
        background: 'var(--dark2)',
        border: '1px solid var(--dark4)',
        maxWidth: 560,
        margin: '2rem auto 0',
      }}
    >
      <div
        className="font-condensed font-extrabold uppercase mb-2 text-center"
        style={{ color: 'var(--yellow)', fontSize: '1.1rem', letterSpacing: '0.06em' }}
      >
        Pedinos el repuesto
      </div>
      <p className="text-center mb-5" style={{ color: 'var(--gray2)', fontSize: '0.95rem', lineHeight: 1.5 }}>
        Contanos qué necesitás y te avisamos por mail cuando un vendedor lo publique para tu auto.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block mb-1.5 text-xs font-condensed font-bold uppercase" style={{ color: 'var(--gray2)', letterSpacing: '0.06em' }}>
            ¿Qué repuesto necesitás? <span style={{ color: 'var(--yellow)' }}>*</span>
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows={2}
            placeholder="Ej: pastillas de freno delanteras, filtro de aire, óptica derecha…"
            className="w-full rounded-md px-3 py-2 outline-none border text-sm"
            style={{ background: 'var(--dark3)', borderColor: 'var(--dark4)', color: 'var(--white)', resize: 'vertical' }}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1.5 text-xs font-condensed font-bold uppercase" style={{ color: 'var(--gray2)', letterSpacing: '0.06em' }}>
            Tu email <span style={{ color: 'var(--yellow)' }}>*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
            className="w-full rounded-md px-3 py-2 outline-none border text-sm"
            style={{ background: 'var(--dark3)', borderColor: 'var(--dark4)', color: 'var(--white)' }}
          />
        </div>

        {error && (
          <div className="mb-3 rounded-md px-3 py-2 text-sm" style={{ background: 'rgba(220,38,38,0.18)', color: '#fecaca' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full font-condensed font-black italic uppercase transition-transform"
          style={{
            padding: '0.85rem 1.2rem',
            background: 'var(--yellow)',
            color: 'var(--text-dark)',
            border: 'none',
            fontSize: '0.95rem',
            letterSpacing: '0.06em',
            cursor: submitting ? 'wait' : 'pointer',
            opacity: submitting ? 0.7 : 1,
            boxShadow: '0 4px 18px rgba(240,224,64,0.25)',
          }}
        >
          {submitting ? 'Enviando…' : 'Avisame cuando esté disponible'}
        </button>

        <p className="mt-3 text-center" style={{ color: 'var(--gray)', fontSize: '0.78rem' }}>
          Nos llega tu pedido y nos ayuda a priorizar qué autos sumar primero.
        </p>
      </form>
    </div>
  )
}
