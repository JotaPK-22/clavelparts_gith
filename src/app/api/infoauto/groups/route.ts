import { NextResponse } from 'next/server'
import { infoAutoGet } from '@/lib/infoautoAuth'

// GET /api/infoauto/groups?brand_id=X
// Devuelve los grupos (familias de modelos) de una marca — ej: "Serie 1", "Serie 3"
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const brandId = searchParams.get('brand_id')

  if (!brandId) {
    return NextResponse.json({ error: 'Parámetro brand_id requerido' }, { status: 400 })
  }

  try {
    const data = await infoAutoGet(`/brands/${brandId}/groups/`, { page_size: '100' })
    return NextResponse.json(data)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
