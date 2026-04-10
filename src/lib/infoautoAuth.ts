/**
 * InfoAuto JWT auth — token management con cache en memoria.
 *
 * Flujo:
 *  1. POST /auth/login  con Basic auth  → access_token (1h) + refresh_token (24h)
 *  2. Todas las requests: Authorization: Bearer {access_token}
 *  3. Si el token está por vencer, se renueva automáticamente vía /auth/refresh
 *
 * El token se cachea a nivel de módulo (persiste mientras el servidor Next.js esté vivo).
 * En producción reemplazar por Redis u otro store distribuido.
 */

const BASE = 'https://demo.api.infoauto.com.ar/cars'

interface TokenCache {
  accessToken: string
  refreshToken: string
  expiresAt: number      // timestamp ms — access token (1h)
  refreshExpiresAt: number  // timestamp ms — refresh token (24h)
}

let _cache: TokenCache | null = null

// ── Login con Basic auth ──────────────────────────────────────────────────────
async function login(): Promise<TokenCache> {
  const user = process.env.INFOAUTO_USER
  const pass = process.env.INFOAUTO_PASS

  if (!user || !pass) {
    throw new Error(
      'Credenciales InfoAuto no configuradas. Completá INFOAUTO_USER y INFOAUTO_PASS en .env.local'
    )
  }

  const creds = Buffer.from(`${user}:${pass}`).toString('base64')

  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { Authorization: `Basic ${creds}` },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`InfoAuto login falló: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  const now = Date.now()

  return {
    accessToken:      data.access_token,
    refreshToken:     data.refresh_token,
    expiresAt:        now + 55 * 60 * 1000,   // 55 min (5 min de buffer)
    refreshExpiresAt: now + 23 * 60 * 60 * 1000, // 23h
  }
}

// ── Refresh con Bearer refresh_token ─────────────────────────────────────────
async function refresh(refreshToken: string): Promise<TokenCache> {
  const res = await fetch(`${BASE}/auth/refresh`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${refreshToken}` },
    cache: 'no-store',
  })

  if (!res.ok) {
    // Si el refresh falla, hacemos login completo
    return login()
  }

  const data = await res.json()
  const now = Date.now()

  return {
    accessToken:      data.access_token,
    refreshToken:     _cache?.refreshToken ?? refreshToken,
    expiresAt:        now + 55 * 60 * 1000,
    refreshExpiresAt: _cache?.refreshExpiresAt ?? now + 23 * 60 * 60 * 1000,
  }
}

// ── Obtener token válido (público) ────────────────────────────────────────────
export async function getToken(): Promise<string> {
  const now = Date.now()

  // Token vigente → devolver directo
  if (_cache && now < _cache.expiresAt) {
    return _cache.accessToken
  }

  // Access token vencido pero refresh vigente → renovar
  if (_cache && now < _cache.refreshExpiresAt) {
    _cache = await refresh(_cache.refreshToken)
    return _cache.accessToken
  }

  // Sin cache o todo vencido → login completo
  _cache = await login()
  return _cache.accessToken
}

// ── Fetch genérico para la API pública de InfoAuto ────────────────────────────
export async function infoAutoGet(path: string, params?: Record<string, string>): Promise<unknown> {
  const token = await getToken()

  const url = new URL(`${BASE}/pub${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 }, // cachear 1h en Next.js data cache
  })

  if (!res.ok) {
    throw new Error(`InfoAuto API error ${res.status}: GET ${path}`)
  }

  return res.json()
}
