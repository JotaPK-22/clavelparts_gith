'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/cartStore'
import { supabase } from '@/lib/supabase'

type Step = 1 | 2 | 3

const STEPS: { id: Step; label: string }[] = [
  { id: 1, label: 'Datos' },
  { id: 2, label: 'Pago' },
  { id: 3, label: 'Confirmación' },
]

function StepBar({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      {STEPS.map((step, i) => {
        const active = step.id === current
        const done = step.id < current
        return (
          <div key={step.id} className="flex items-center gap-3 flex-1">
            <div
              className="flex items-center justify-center rounded-full font-condensed font-black"
              style={{
                width: 34, height: 34,
                background: active ? 'var(--yellow)' : done ? 'var(--slate)' : 'var(--dark3)',
                color: active ? 'var(--text-dark)' : done ? 'var(--yellow)' : 'var(--gray)',
                border: `1px solid ${active || done ? 'var(--yellow)' : 'var(--dark4)'}`,
                fontSize: '0.9rem',
                flexShrink: 0,
              }}
            >
              {done ? '✓' : step.id}
            </div>
            <div
              className="font-condensed font-bold uppercase text-sm"
              style={{ color: active ? 'var(--white)' : 'var(--gray)', letterSpacing: '0.06em' }}
            >
              {step.label}
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px" style={{ background: done ? 'var(--yellow)' : 'var(--dark4)' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function generateOrderNumber() {
  const part = () => Math.floor(Math.random() * 9000 + 1000)
  return `CP-${part()}-${part()}`
}

function generateTrackingNumber() {
  return `AR${Math.floor(Math.random() * 9_000_000_000 + 1_000_000_000)}`
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart, setView } = useAppStore()
  const total = cartTotal()

  const [step, setStep] = useState<Step>(1)
  const [orderNumber, setOrderNumber] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [processing, setProcessing] = useState(false)

  // Form state
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [calle, setCalle] = useState('')
  const [numero, setNumero] = useState('')
  const [cp, setCp] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [provincia, setProvincia] = useState('Buenos Aires')

  const sellers = useMemo(() => {
    const set = new Set(cart.map((item) => item.seller))
    return Array.from(set)
  }, [cart])

  // Si el carrito está vacío y no terminamos la compra todavía, redirigir al home
  useEffect(() => {
    if (cart.length === 0 && step !== 3) {
      setView('home')
      router.replace('/')
    }
  }, [cart.length, step, router, setView])

  function handleSubmitStep1(e: FormEvent) {
    e.preventDefault()
    setStep(2)
  }

  async function handleSubmitStep2(e: FormEvent) {
    e.preventDefault()
    setProcessing(true)

    const order = generateOrderNumber()
    const tracking = generateTrackingNumber()

    // Persistimos en Supabase (tabla `pedidos_demo`). Si falla — porque
    // la tabla no existe todavía, RLS o no hay conexión — igual mostramos
    // confirmación al usuario y dejamos log en consola. La demo no se
    // tiene que romper por un problema de backend.
    try {
      const payload = {
        order_number: order,
        nombre, apellido, email, telefono,
        calle, numero, cp, ciudad, provincia,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          seller: item.seller,
          price: item.price,
          qty: item.qty,
          subtotal: item.price * item.qty,
        })),
        subtotal: total,
        envio: 0,
        total,
        tracking_number: tracking,
        is_demo: true,
      }
      const { error: insertError } = await supabase
        .from('pedidos_demo')
        .insert(payload)
      if (insertError) {
        console.warn('[checkout] No se pudo guardar el pedido en DB. Payload:', payload, insertError)
      }
    } catch (err) {
      console.warn('[checkout] Error inesperado guardando pedido:', err)
    }

    // Simulamos delay de procesamiento de pago para sentir el "click → pago"
    setTimeout(() => {
      setOrderNumber(order)
      setTrackingNumber(tracking)
      clearCart()
      setProcessing(false)
      setStep(3)
    }, 1500)
  }

  function handleVolverHome() {
    setView('home')
    router.push('/')
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen px-4 py-6 md:py-10" style={{ background: 'var(--dark)' }}>
      <div className="mx-auto w-full max-w-3xl">

        {/* Volver al carrito (solo en pasos 1 y 2) */}
        {step !== 3 && (
          <button
            type="button"
            onClick={() => {
              setView('cart')
              router.push('/')
            }}
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
            Volver al carrito
          </button>
        )}

        {/* Título */}
        <h1
          className="font-condensed font-black italic uppercase mb-2"
          style={{ fontSize: '2rem', color: 'var(--yellow)', letterSpacing: '0.04em' }}
        >
          {step === 3 ? '¡Pedido confirmado!' : 'Finalizar compra'}
        </h1>

        {step === 3 && (
          <p style={{ color: 'var(--gray2)', marginBottom: '1.6rem' }}>
            Te enviamos el detalle por mail. Gracias por elegir ClavelParts.
          </p>
        )}

        {step !== 3 && <StepBar current={step} />}

        {/* ── PASO 1: Datos del comprador ── */}
        {step === 1 && (
          <form onSubmit={handleSubmitStep1}>
            <Card title="Datos personales">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nombre" required>
                  <input
                    type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                    required className={inputClass} style={inputStyle}
                  />
                </Field>
                <Field label="Apellido" required>
                  <input
                    type="text" value={apellido} onChange={(e) => setApellido(e.target.value)}
                    required className={inputClass} style={inputStyle}
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    required className={inputClass} style={inputStyle}
                    placeholder="tu@email.com"
                  />
                </Field>
                <Field label="Teléfono" required>
                  <input
                    type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)}
                    required className={inputClass} style={inputStyle}
                    placeholder="11 1234 5678"
                  />
                </Field>
              </div>
            </Card>

            <Card title="Dirección de envío" className="mt-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <Field label="Calle" required>
                    <input
                      type="text" value={calle} onChange={(e) => setCalle(e.target.value)}
                      required className={inputClass} style={inputStyle}
                    />
                  </Field>
                </div>
                <Field label="Número" required>
                  <input
                    type="text" value={numero} onChange={(e) => setNumero(e.target.value)}
                    required className={inputClass} style={inputStyle}
                  />
                </Field>
                <Field label="Código postal" required>
                  <input
                    type="text" value={cp} onChange={(e) => setCp(e.target.value)}
                    required className={inputClass} style={inputStyle}
                    placeholder="1414"
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Ciudad" required>
                    <input
                      type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)}
                      required className={inputClass} style={inputStyle}
                    />
                  </Field>
                </div>
                <div className="md:col-span-3">
                  <Field label="Provincia" required>
                    <select
                      value={provincia} onChange={(e) => setProvincia(e.target.value)}
                      required className={inputClass} style={inputStyle}
                    >
                      {[
                        'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
                        'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones',
                        'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
                        'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
                      ].map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </Field>
                </div>
              </div>
            </Card>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="rounded-full font-condensed font-black italic uppercase transition-transform"
                style={primaryBtn}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none' }}
              >
                Continuar al pago →
              </button>
            </div>
          </form>
        )}

        {/* ── PASO 2: Resumen + pago ── */}
        {step === 2 && (
          <form onSubmit={handleSubmitStep2}>
            <Card title="Resumen del pedido">
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: 'var(--dark3)' }}>
                    <div
                      className="flex-shrink-0 rounded-md flex items-center justify-center overflow-hidden"
                      style={{ width: 56, height: 56, background: 'var(--dark3)' }}
                    >
                      {item.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span className="text-xs" style={{ color: 'var(--gray)' }}>—</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-condensed font-bold text-sm truncate" style={{ color: 'var(--white)' }}>
                        {item.name}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--gray)' }}>
                        {item.seller} · Cantidad: {item.qty}
                      </div>
                    </div>
                    <div className="font-condensed font-extrabold text-sm" style={{ color: 'var(--yellow)' }}>
                      ${(item.price * item.qty).toLocaleString('es-AR')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-sm pt-3 border-t" style={{ borderColor: 'var(--dark3)' }}>
                <Row label="Subtotal" value={`$${total.toLocaleString('es-AR')}`} />
                <Row label="Envío Andreani" value="Gratis" valueColor="#86efac" />
                <div className="flex justify-between items-center pt-3 mt-2 border-t-2" style={{ borderColor: 'var(--yellow)' }}>
                  <span className="font-condensed font-extrabold uppercase" style={{ color: 'var(--white)', fontSize: '1rem' }}>Total</span>
                  <span className="font-condensed font-black" style={{ color: 'var(--yellow)', fontSize: '1.7rem' }}>
                    ${total.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            </Card>

            <Card title="Medio de pago" className="mt-5">
              <label
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer border"
                style={{ background: 'var(--dark3)', borderColor: 'var(--yellow)' }}
              >
                <input type="radio" name="payment" defaultChecked />
                <div className="flex-1">
                  <div className="font-condensed font-bold" style={{ color: 'var(--white)' }}>MercadoPago</div>
                  <div className="text-xs" style={{ color: 'var(--gray)' }}>
                    Tarjeta, débito, transferencia o dinero en cuenta. Hasta 12 cuotas sin interés.
                  </div>
                </div>
                <span style={{ color: 'var(--yellow)', fontSize: '0.85rem', fontWeight: 700 }}>Recomendado</span>
              </label>

              <div className="mt-4 p-3 rounded-md text-xs" style={{ background: 'rgba(240,224,64,0.08)', border: '1px solid rgba(240,224,64,0.2)', color: 'var(--gray2)' }}>
                💡 Tu pedido tiene <strong style={{ color: 'var(--white)' }}>{sellers.length} vendedor{sellers.length === 1 ? '' : 'es'}</strong>. ClavelParts garantiza la entrega consolidada y la compatibilidad de las piezas.
              </div>
            </Card>

            <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-full px-5 py-3 font-condensed font-bold uppercase text-sm transition-colors"
                style={{
                  background: 'transparent',
                  color: 'var(--gray2)',
                  border: '1px solid var(--dark4)',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                }}
              >
                ← Volver a datos
              </button>
              <button
                type="submit"
                disabled={processing}
                className="rounded-full font-condensed font-black italic uppercase transition-transform"
                style={{ ...primaryBtn, opacity: processing ? 0.7 : 1, cursor: processing ? 'wait' : 'pointer' }}
              >
                {processing ? 'Procesando…' : `Pagar $${total.toLocaleString('es-AR')} →`}
              </button>
            </div>

            <div className="mt-4 text-center text-xs" style={{ color: 'var(--gray)' }}>
              🔒 Pago 100% seguro procesado por MercadoPago
            </div>
          </form>
        )}

        {/* ── PASO 3: Confirmación ── */}
        {step === 3 && (
          <div>
            <div className="rounded-2xl border p-6 md:p-8 text-center" style={{ background: 'var(--dark2)', borderColor: 'var(--dark4)' }}>
              {/* Check verde grande */}
              <div
                className="mx-auto mb-5 flex items-center justify-center rounded-full"
                style={{
                  width: 80, height: 80,
                  background: 'rgba(34,197,94,0.15)',
                  border: '2px solid #22c55e',
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth={2.5} style={{ width: 40, height: 40 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div className="font-condensed font-extrabold uppercase mb-2" style={{ color: 'var(--white)', fontSize: '1.3rem', letterSpacing: '0.05em' }}>
                Pedido N° {orderNumber}
              </div>
              <p className="mb-6" style={{ color: 'var(--gray2)' }}>
                Te enviamos el detalle a <strong style={{ color: 'var(--yellow)' }}>{email || 'tu email'}</strong>
              </p>

              <div
                className="rounded-lg p-4 mx-auto text-left max-w-md mb-6"
                style={{ background: 'var(--dark3)', border: '1px solid var(--dark4)' }}
              >
                <div className="text-xs uppercase font-condensed mb-2" style={{ color: 'var(--gray)', letterSpacing: '0.08em' }}>
                  📦 Seguimiento Andreani
                </div>
                <div className="font-mono text-sm" style={{ color: 'var(--white)' }}>
                  {trackingNumber}
                </div>
                <div className="text-xs mt-2" style={{ color: 'var(--gray2)' }}>
                  Estimación: 2-4 días hábiles. Vas a recibir actualizaciones por mail.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleVolverHome}
                  className="rounded-full font-condensed font-black italic uppercase"
                  style={primaryBtn}
                >
                  Volver al home
                </button>
                <button
                  type="button"
                  onClick={() => alert('Próximamente: panel de pedidos del comprador')}
                  className="rounded-full px-5 py-3 font-condensed font-bold uppercase text-sm"
                  style={{
                    background: 'transparent',
                    color: 'var(--gray2)',
                    border: '1px solid var(--dark4)',
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                  }}
                >
                  Ver mis pedidos
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ── Subcomponents ──────────────────────────────────────────────

function Card({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border p-5 md:p-6 ${className}`}
      style={{ background: 'var(--dark2)', borderColor: 'var(--dark4)' }}
    >
      <div
        className="font-condensed font-extrabold uppercase mb-4"
        style={{ color: 'var(--yellow)', fontSize: '1.05rem', letterSpacing: '0.06em' }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-condensed font-bold uppercase" style={{ color: 'var(--gray2)', letterSpacing: '0.06em' }}>
        {label} {required && <span style={{ color: 'var(--yellow)' }}>*</span>}
      </div>
      {children}
    </label>
  )
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex justify-between py-1">
      <span style={{ color: 'var(--gray)' }}>{label}</span>
      <span style={{ color: valueColor ?? 'var(--white)', fontWeight: 600 }}>{value}</span>
    </div>
  )
}

const inputClass = 'w-full rounded-md px-3 py-2 outline-none border text-sm'
const inputStyle: React.CSSProperties = {
  background: 'var(--dark3)',
  borderColor: 'var(--dark4)',
  color: 'var(--white)',
}

const primaryBtn: React.CSSProperties = {
  background: 'var(--yellow)',
  color: 'var(--text-dark)',
  border: 'none',
  padding: '0.85rem 1.6rem',
  fontSize: '1rem',
  letterSpacing: '0.06em',
  cursor: 'pointer',
  boxShadow: '0 4px 18px rgba(240,224,64,0.3)',
}
