import type { Session, User } from '@supabase/supabase-js'
import { createClient } from './supabase'

export interface Vendedor {
  id: number
  auth_user_id: string
  nombre?: string | null
  nombre_comercial?: string | null
  razon_social?: string | null
  email?: string | null
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export async function loginVendedor(email: string, password: string) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) throw error

    return {
      session: data.session,
      user: data.user,
      error: null as string | null,
    }
  } catch (error) {
    return {
      session: null,
      user: null,
      error: getErrorMessage(error, 'No se pudo iniciar sesión.'),
    }
  }
}

export async function getSession(): Promise<Session | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getSession()

    if (error) throw error
    return data.session ?? null
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  return session?.user ?? null
}

export async function getVendedorActual(): Promise<Vendedor | null> {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    const supabase = createClient()
    const { data, error } = await supabase
      .from('vendedores')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (error) throw error
    return (data as Vendedor | null) ?? null
  } catch (error) {
    console.error('Error obteniendo vendedor actual:', error)
    return null
  }
}

export async function logoutVendedor() {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) throw error
    return { error: null as string | null }
  } catch (error) {
    return {
      error: getErrorMessage(error, 'No se pudo cerrar sesión.'),
    }
  }
}
