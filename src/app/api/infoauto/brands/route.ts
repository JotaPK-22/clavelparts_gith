import { NextResponse } from 'next/server'
import { infoAutoGet } from '@/lib/infoautoAuth'

// GET /api/infoauto/brands
// Devuelve todas las marcas de InfoAuto (filtradas: solo las que tienen precios usados)
export async function GET() {
  try {
    const data = await infoAutoGet('/brands/', { prices: 'true', page_size: '100' })
    return NextResponse.json(data)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
