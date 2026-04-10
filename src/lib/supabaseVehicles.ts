import { supabase } from './supabase'

export interface Brand {
  id: number
  nombre: string
}

export interface Model {
  id: number
  marca_id: number
  nombre: string
}

export interface Version {
  id: number
  modelo_id: number
  anio: number
  version: string
  motor_codigo: string
}

export interface Group {
  id: number
  nombre: string
  orden: number
}

export interface Subgroup {
  id: number
  grupo_id: number
  nombre: string
  orden: number
}

// Obtener marcas que realmente tienen modelos/versiones cargadas
export async function getBrands(): Promise<Brand[]> {
  try {
    const [brandsRes, modelsRes, versionsRes] = await Promise.all([
      supabase.from('marcas').select('*').order('nombre'),
      supabase.from('modelos').select('id, marca_id'),
      supabase.from('versiones').select('modelo_id'),
    ])

    if (brandsRes.error) throw brandsRes.error
    if (modelsRes.error) throw modelsRes.error
    if (versionsRes.error) throw versionsRes.error

    const models = modelsRes.data || []
    const validModelIds = new Set((versionsRes.data || []).map((item) => item.modelo_id))
    const validBrandIds = new Set(
      models
        .filter((model) => validModelIds.has(model.id))
        .map((model) => model.marca_id)
    )

    return (brandsRes.data || []).filter((brand) => validBrandIds.has(brand.id))
  } catch (error) {
    console.error('Error fetching brands:', error)
    return []
  }
}

// Obtener modelos por marca con al menos una versión cargada
export async function getModelsByBrand(brandId: number): Promise<Model[]> {
  try {
    const { data, error } = await supabase
      .from('modelos')
      .select('*')
      .eq('marca_id', brandId)
      .order('nombre')

    if (error) throw error

    const models = data || []
    if (models.length === 0) return []

    const modelIds = models.map((model) => model.id)
    const { data: versions, error: versionsError } = await supabase
      .from('versiones')
      .select('modelo_id')
      .in('modelo_id', modelIds)

    if (versionsError) throw versionsError

    const validModelIds = new Set((versions || []).map((item) => item.modelo_id))
    return models.filter((model) => validModelIds.has(model.id))
  } catch (error) {
    console.error('Error fetching models:', error)
    return []
  }
}

export async function getYearsByModel(modelId: number): Promise<number[]> {
  try {
    const { data, error } = await supabase
      .from('versiones')
      .select('anio')
      .eq('modelo_id', modelId)

    if (error) throw error

    const years = Array.from(new Set((data || []).map((item) => item.anio)))
    return years.sort((a, b) => b - a)
  } catch (error) {
    console.error('Error fetching years:', error)
    return []
  }
}

export async function getVersionsByModelAndYear(modelId: number, year: number): Promise<Version[]> {
  try {
    const { data, error } = await supabase
      .from('versiones')
      .select('*')
      .eq('modelo_id', modelId)
      .eq('anio', year)
      .order('version')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching versions:', error)
    return []
  }
}

export async function getGroups(): Promise<Group[]> {
  try {
    const { data, error } = await supabase
      .from('grupos')
      .select('*')
      .order('orden')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching groups:', error)
    return []
  }
}

export async function getSubgroupsByGroup(groupId: number): Promise<Subgroup[]> {
  try {
    const { data, error } = await supabase
      .from('subgrupos')
      .select('*')
      .eq('grupo_id', groupId)
      .order('orden')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching subgroups:', error)
    return []
  }
}

