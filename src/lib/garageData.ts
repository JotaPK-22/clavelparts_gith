export interface GarageCar {
  id: string
  brand: string
  model: string
  version: string
  year: string
  plate: string
  km: number
  photo: string        // side / original photo
  photoFront?: string  // front-facing photo for garage bay view
  color: string
}

export interface BitacoraEntry {
  id: string
  carId: string
  date: string
  type: 'compra' | 'service' | 'reparacion' | 'revision'
  description: string
  parts?: string[]
  cost: number
  km: number
  seller?: string
}

// Demo: el auto del usuario
export const demoGarageCars: GarageCar[] = [
  {
    id: 'car-1',
    brand: 'BMW',
    model: 'SERIE 1',
    version: '130i M Sport Package 3.0L',
    year: '2009',
    plate: 'HXC 704',
    km: 142500,
    photo: '/cars/bmw-serie1.jpg',
    photoFront: '/cars/bmw_frente_gt.png',
    color: 'Negro Saphir',
  },
]

export const demoBitacora: BitacoraEntry[] = [
  {
    id: 'b-1',
    carId: 'car-1',
    date: '2025-03-10',
    type: 'compra',
    description: 'Pastillas de freno delanteras',
    parts: ['Brembo P06098'],
    cost: 28500,
    km: 142000,
    seller: 'Frenos del Sur',
  },
  {
    id: 'b-2',
    carId: 'car-1',
    date: '2025-01-18',
    type: 'service',
    description: 'Service de aceite + filtro',
    parts: ['Bosch F026407006', 'Castrol Edge 5W40 5L'],
    cost: 22800,
    km: 139500,
    seller: 'Auto Repuestos GBA',
  },
  {
    id: 'b-3',
    carId: 'car-1',
    date: '2024-10-05',
    type: 'reparacion',
    description: 'Amortiguador delantero derecho',
    parts: ['Sachs 312 584'],
    cost: 54000,
    km: 135200,
    seller: 'Suspensiones Cañon',
  },
  {
    id: 'b-4',
    carId: 'car-1',
    date: '2024-07-22',
    type: 'service',
    description: 'Service completo 135.000 km',
    parts: ['Mahle LX 1804', 'Beru BF768', 'NGK PLFER7A8EG x6'],
    cost: 87000,
    km: 135000,
    seller: 'Taller Oficial BMW',
  },
  {
    id: 'b-5',
    carId: 'car-1',
    date: '2024-03-14',
    type: 'revision',
    description: 'Revisión frenos traseros — OK por 20.000 km',
    cost: 0,
    km: 128000,
  },
]

export const typeLabels: Record<BitacoraEntry['type'], string> = {
  compra:     'Compra',
  service:    'Service',
  reparacion: 'Reparación',
  revision:   'Revisión',
}

export const typeColors: Record<BitacoraEntry['type'], string> = {
  compra:     '#f0e040',
  service:    '#6ee7b7',
  reparacion: '#f97316',
  revision:   '#8a9299',
}
