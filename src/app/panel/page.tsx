'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  getSession,
  getVendedorActual,
  logoutVendedor,
  type Vendedor,
} from '@/lib/vendedorAuth'
import {
  crearProductoVendedor,
  getProductosVendedorActual,
  type ProductoVendedorResumen,
} from '@/lib/vendedorProducts'

interface ProductFormState {
  sku: string
  producto: string
  tipo_pieza: string
  marca_pieza: string
  numero_parte_oem: string
  precio: string
  precio_oferta: string
  stock: string
  imagen_url: string
}

const initialForm: ProductFormState = {
  sku: '',
  producto: '',
  tipo_pieza: '',
  marca_pieza: '',
  numero_parte_oem: '',
  precio: '',
  precio_oferta: '',
  stock: '0',
  imagen_url: '',
}

export default function PanelVendedorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [vendedor, setVendedor] = useState<Vendedor | null>(null)
  const [productos, setProductos] = useState<ProductoVendedorResumen[]>([])
  const [form, setForm] = useState<ProductFormState>(initialForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadPanel = async () => {
      try {
        setLoading(true)
        setError('')

        const session = await getSession()
        if (!session?.user) {
          router.replace('/login/vendedor')
          return
        }

        setUserEmail(session.user.email ?? '')

        const vendedorActual = await getVendedorActual()
        setVendedor(vendedorActual)

        if (vendedorActual) {
          const productsResult = await getProductosVendedorActual()
          if (productsResult.error) {
            setError(productsResult.error)
          }
          setProductos(productsResult.data)
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'No se pudo cargar el panel.')
      } finally {
        setLoading(false)
      }
    }

    void loadPanel()
  }, [router])

  async function handleLogout() {
    await logoutVendedor()
    router.replace('/login/vendedor')
  }

  function updateField<K extends keyof ProductFormState>(field: K, value: ProductFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const result = await crearProductoVendedor({
        sku: form.sku,
        producto: form.producto,
        tipo_pieza: form.tipo_pieza,
        marca_pieza: form.marca_pieza,
        numero_parte_oem: form.numero_parte_oem,
        precio: Number(form.precio),
        precio_oferta: form.precio_oferta ? Number(form.precio_oferta) : null,
        stock: Number(form.stock || 0),
        imagen_url: form.imagen_url,
      })

      if (result.error) {
        setError(result.error)
        return
      }

      setSuccess('Producto cargado correctamente en Supabase.')
      setForm(initialForm)

      const productsResult = await getProductosVendedorActual()
      if (!productsResult.error) {
        setProductos(productsResult.data)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo crear el producto.')
    } finally {
      setSaving(false)
    }
  }

  const nombreVendedor =
    vendedor?.nombre_comercial || vendedor?.nombre || vendedor?.razon_social || 'Vendedor'
  const productosActivos = productos.filter((item) => item.activo !== false).length
  const stockTotal = productos.reduce((acc, item) => acc + Number(item.stock ?? 0), 0)

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--dark)' }}>
        <div style={{ color: 'var(--gray2)' }}>Cargando panel vendedor...</div>
      </main>
    )
  }

  if (!vendedor) {
    return (
      <main className="min-h-screen px-4 py-10" style={{ background: 'var(--dark)' }}>
        <div className="max-w-2xl mx-auto rounded-xl border p-6" style={{ background: 'var(--dark2)', borderColor: 'var(--dark4)' }}>
          <h1 className="font-condensed font-black italic uppercase mb-3" style={{ fontSize: '2rem', color: 'var(--yellow)' }}>
            Panel vendedor
          </h1>
          <p className="mb-2" style={{ color: 'var(--gray2)' }}>
            No estás habilitado como vendedor.
          </p>
          <p className="mb-6 text-sm" style={{ color: 'var(--gray)' }}>
            Usuario actual: {userEmail || 'sin email'}
          </p>
          <button
            onClick={handleLogout}
            className="rounded-md px-4 py-2 font-condensed font-bold uppercase"
            style={{ background: 'var(--slate)', color: 'var(--white)' }}
          >
            Cerrar sesión
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-8" style={{ background: 'var(--dark)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-condensed font-black italic uppercase" style={{ fontSize: '2.2rem', color: 'var(--yellow)' }}>
              Bienvenido, {nombreVendedor}
            </h1>
            <p style={{ color: 'var(--gray2)' }}>{userEmail}</p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-md px-4 py-2 font-condensed font-bold uppercase"
            style={{ background: 'var(--slate)', color: 'var(--white)' }}
          >
            Cerrar sesión
          </button>
        </div>

        {(error || success) && (
          <div
            className="rounded-md px-4 py-3 mb-6"
            style={{
              background: error ? 'rgba(220,38,38,0.18)' : 'rgba(34,197,94,0.16)',
              color: error ? '#fecaca' : '#bbf7d0',
            }}
          >
            {error || success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-xl border p-5" style={{ background: 'var(--dark2)', borderColor: 'var(--dark4)' }}>
            <div className="mb-5">
              <h2 className="font-condensed font-extrabold uppercase" style={{ fontSize: '1.35rem', color: 'var(--white)' }}>
                Cargar producto
              </h2>
              <p style={{ color: 'var(--gray)' }}>
                Este formulario inserta directo en `public.productos` usando tu `vendedor_id`.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm uppercase" style={{ color: 'var(--gray2)' }}>SKU</label>
                <input value={form.sku} onChange={(e) => updateField('sku', e.target.value)} className="w-full rounded-md px-3 py-2 border" style={{ background: 'var(--dark3)', borderColor: 'var(--dark4)', color: 'var(--white)' }} required />
              </div>

              <div>
                <label className="block mb-2 text-sm uppercase" style={{ color: 'var(--gray2)' }}>Tipo de pieza</label>
                <input value={form.tipo_pieza} onChange={(e) => updateField('tipo_pieza', e.target.value)} className="w-full rounded-md px-3 py-2 border" style={{ background: 'var(--dark3)', borderColor: 'var(--dark4)', color: 'var(--white)' }} required />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm uppercase" style={{ color: 'var(--gray2)' }}>Producto</label>
                <input value={form.producto} onChange={(e) => updateField('producto', e.target.value)} className="w-full rounded-md px-3 py-2 border" style={{ background: 'var(--dark3)', borderColor: 'var(--dark4)', color: 'var(--white)' }} required />
              </div>

              <div>
                <label className="block mb-2 text-sm uppercase" style={{ color: 'var(--gray2)' }}>Marca de la pieza</label>
                <input value={form.marca_pieza} onChange={(e) => updateField('marca_pieza', e.target.value)} className="w-full rounded-md px-3 py-2 border" style={{ background: 'var(--dark3)', borderColor: 'var(--dark4)', color: 'var(--white)' }} />
              </div>

              <div>
                <label className="block mb-2 text-sm uppercase" style={{ color: 'var(--gray2)' }}>Número OEM</label>
                <input value={form.numero_parte_oem} onChange={(e) => updateField('numero_parte_oem', e.target.value)} className="w-full rounded-md px-3 py-2 border" style={{ background: 'var(--dark3)', borderColor: 'var(--dark4)', color: 'var(--white)' }} />
              </div>

              <div>
                <label className="block mb-2 text-sm uppercase" style={{ color: 'var(--gray2)' }}>Precio</label>
                <input type="number" min="0" value={form.precio} onChange={(e) => updateField('precio', e.target.value)} className="w-full rounded-md px-3 py-2 border" style={{ background: 'var(--dark3)', borderColor: 'var(--dark4)', color: 'var(--white)' }} required />
              </div>

              <div>
                <label className="block mb-2 text-sm uppercase" style={{ color: 'var(--gray2)' }}>Precio oferta</label>
                <input type="number" min="0" value={form.precio_oferta} onChange={(e) => updateField('precio_oferta', e.target.value)} className="w-full rounded-md px-3 py-2 border" style={{ background: 'var(--dark3)', borderColor: 'var(--dark4)', color: 'var(--white)' }} />
              </div>

              <div>
                <label className="block mb-2 text-sm uppercase" style={{ color: 'var(--gray2)' }}>Stock</label>
                <input type="number" min="0" value={form.stock} onChange={(e) => updateField('stock', e.target.value)} className="w-full rounded-md px-3 py-2 border" style={{ background: 'var(--dark3)', borderColor: 'var(--dark4)', color: 'var(--white)' }} required />
              </div>

              <div>
                <label className="block mb-2 text-sm uppercase" style={{ color: 'var(--gray2)' }}>Imagen URL</label>
                <input value={form.imagen_url} onChange={(e) => updateField('imagen_url', e.target.value)} className="w-full rounded-md px-3 py-2 border" style={{ background: 'var(--dark3)', borderColor: 'var(--dark4)', color: 'var(--white)' }} />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md px-4 py-3 font-condensed font-black italic uppercase"
                  style={{ background: 'var(--yellow)', color: 'var(--text-dark)', opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? 'GUARDANDO...' : 'GUARDAR PRODUCTO'}
                </button>
              </div>
            </form>
          </section>

          <aside className="rounded-xl border p-5" style={{ background: 'var(--dark2)', borderColor: 'var(--dark4)' }}>
            <h2 className="font-condensed font-extrabold uppercase mb-4" style={{ fontSize: '1.35rem', color: 'var(--white)' }}>
              Datos del vendedor
            </h2>

            <div className="space-y-2 text-sm" style={{ color: 'var(--gray2)' }}>
              <p><strong>ID vendedor:</strong> {vendedor.id}</p>
              <p><strong>Auth user:</strong> {vendedor.auth_user_id}</p>
              <p><strong>Nombre:</strong> {nombreVendedor}</p>
            </div>

            <div className="mt-6">
              <h3 className="font-condensed font-bold uppercase mb-3" style={{ color: 'var(--yellow)' }}>
                Resumen del catálogo
              </h3>

              <div className="grid gap-3">
                <div className="rounded-md px-3 py-3 border" style={{ background: 'var(--dark3)', borderColor: 'var(--dark4)' }}>
                  <div className="text-sm" style={{ color: 'var(--gray)' }}>Productos cargados</div>
                  <div className="font-condensed font-extrabold" style={{ color: 'var(--white)', fontSize: '1.3rem' }}>{productos.length}</div>
                </div>
                <div className="rounded-md px-3 py-3 border" style={{ background: 'var(--dark3)', borderColor: 'var(--dark4)' }}>
                  <div className="text-sm" style={{ color: 'var(--gray)' }}>Productos activos</div>
                  <div className="font-condensed font-extrabold" style={{ color: 'var(--white)', fontSize: '1.3rem' }}>{productosActivos}</div>
                </div>
                <div className="rounded-md px-3 py-3 border" style={{ background: 'var(--dark3)', borderColor: 'var(--dark4)' }}>
                  <div className="text-sm" style={{ color: 'var(--gray)' }}>Stock total</div>
                  <div className="font-condensed font-extrabold" style={{ color: 'var(--white)', fontSize: '1.3rem' }}>{stockTotal}</div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className="rounded-xl border p-5 mt-6" style={{ background: 'var(--dark2)', borderColor: 'var(--dark4)' }}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-condensed font-extrabold uppercase" style={{ fontSize: '1.35rem', color: 'var(--white)' }}>
                Tus productos
              </h2>
              <p style={{ color: 'var(--gray)' }}>
                Vista tipo catálogo de los repuestos que cargaste en Supabase.
              </p>
            </div>
            <div className="font-condensed font-bold uppercase" style={{ color: 'var(--yellow)' }}>
              {productos.length} item{productos.length !== 1 ? 's' : ''}
            </div>
          </div>

          {productos.length === 0 ? (
            <p style={{ color: 'var(--gray)' }}>Todavía no cargaste productos.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {productos.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-xl border"
                  style={{ background: 'var(--dark3)', borderColor: 'var(--dark4)' }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{ height: 150, background: '#11161b' }}
                  >
                    {item.imagen_url ? (
                      <img
                        src={item.imagen_url}
                        alt={item.producto}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="font-condensed font-bold uppercase" style={{ color: 'var(--gray)' }}>
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="mb-2 font-condensed font-black uppercase" style={{ color: 'var(--white)', fontSize: '1.05rem', lineHeight: 1.1 }}>
                      {item.producto}
                    </div>

                    <div className="mb-3 text-sm" style={{ color: 'var(--gray2)' }}>
                      {(item.marca_pieza || 'Sin marca')} · SKU: {item.sku}
                    </div>

                    <div className="mb-3 flex items-center justify-between text-sm" style={{ color: 'var(--gray)' }}>
                      <span>Stock: {item.stock ?? 0}</span>
                      <span style={{ color: item.activo === false ? '#fca5a5' : '#86efac' }}>
                        {item.activo === false ? 'Pausado' : 'Activo'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="font-condensed font-black" style={{ color: 'var(--yellow)', fontSize: '1.35rem' }}>
                        ${Number(item.precio ?? 0).toLocaleString('es-AR')}
                      </div>
                      <button
                        type="button"
                        className="rounded-md px-3 py-2 font-condensed font-bold uppercase"
                        style={{ background: 'var(--slate)', color: 'var(--white)' }}
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
