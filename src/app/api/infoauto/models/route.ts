import { NextResponse } from 'next/server'
import { infoAutoGet } from '@/lib/infoautoAuth'

// GET /api/infoauto/models?brand_id=X&group_id=Y
// Devuelve los modelos (versiones) dentro de un grupo — ej: "130i M Sport 3.0L", "118i 2.0L"
// Cada modelo incluye prices_from y prices_to para generar el rango de años
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const brandId = searchParams.get('brand_id')
  const groupId = searchParams.get('group_id')

  if (!brandId || !groupId) {
    return NextResponse.json(
      { error: 'Parámetros brand_id y group_id requeridos' },
      { status: 400 }
    )
  }

  try {
    const data = await infoAutoGet(`/brands/${brandId}/groups/${groupId}/models/`, { page_size: '100' })
    return NextResponse.json(data)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
