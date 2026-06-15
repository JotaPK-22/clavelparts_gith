import { create } from 'zustand'

export interface CartProduct {
  id: string
  name: string
  brand: string
  ref: string
  price: number
  seller: string
  sellerRating: number
  delivery: string
  category: string
  image?: string
  qty: number
}

export interface SelectedVehicle {
  brand: string
  model: string
  engine: string
  year: string
  versionLabel?: string
  versionId?: number
}

interface AppState {
  // Cart
  cart: CartProduct[]
  addToCart: (product: Omit<CartProduct, 'qty'>) => void
  removeFromCart: (id: string) => void
  updateQty: (id: string, delta: number) => void
  clearCart: () => void
  cartTotal: () => number
  cartCount: () => number

  // Selected vehicle
  vehicle: SelectedVehicle | null
  setVehicle: (v: SelectedVehicle) => void
  clearVehicle: () => void

  // Search state
  searchQuery: string
  setSearchQuery: (query: string) => void
  clearSearchQuery: () => void

  // UI state
  currentView: 'home' | 'results' | 'cart' | 'garage' | 'racers-edge-home' | 'racers-edge-catalog'
  setView: (v: 'home' | 'results' | 'cart' | 'garage' | 'racers-edge-home' | 'racers-edge-catalog') => void
  syncViewFromUrl: () => void

  // Catalog filter state — accesible global así Navbar/CategoryGrid pueden
  // fijar el filtro desde fuera de ResultsGrid sin pasar por sessionStorage.
  catalogSelectedGroup: string
  catalogSelectedSubgroup: string
  setCatalogSelectedGroup: (g: string) => void
  setCatalogSelectedSubgroup: (s: string) => void
}

type AppView = 'home' | 'results' | 'cart' | 'garage' | 'racers-edge-home' | 'racers-edge-catalog'

const VALID_VIEWS: AppView[] = ['home', 'results', 'cart', 'garage', 'racers-edge-home', 'racers-edge-catalog']

// Empuja la vista actual a la URL (?view=results) si estamos en /.
// Esto hace que el botón "atrás" del navegador funcione naturalmente
// entre vistas internas. No toca nada si estamos en otra ruta.
function pushUrlForView(v: AppView) {
  if (typeof window === 'undefined') return
  if (window.location.pathname !== '/') return

  const params = new URLSearchParams(window.location.search)
  if (v === 'home') {
    params.delete('view')
  } else {
    params.set('view', v)
  }
  const search = params.toString()
  const newUrl = search ? `/?${search}` : '/'
  const currentUrl = window.location.pathname + window.location.search
  if (newUrl !== currentUrl) {
    window.history.pushState({ view: v }, '', newUrl)
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  // ── Cart ──
  cart: [],

  addToCart: (product) => {
    // Defensa: si el id viene vacío, undefined, "undefined" o "null"
    // (alguna mal-resolución desde la DB / vista), generamos un id único
    // ad-hoc así no se acumulan distintos productos en el mismo bucket
    // del carrito. También logueamos para detectarlo en consola.
    const rawId = product.id
    const isBadId = !rawId || rawId === 'undefined' || rawId === 'null'
    if (isBadId) {
      console.warn('[cart] addToCart recibió un id inválido — generando uno único.', product)
    }
    const safeId = isBadId
      ? `nope-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      : rawId
    const safeProduct = { ...product, id: safeId }

    const { cart } = get()
    const existing = cart.find((p) => p.id === safeProduct.id)
    if (existing) {
      set({ cart: cart.map((p) => p.id === safeProduct.id ? { ...p, qty: p.qty + 1 } : p) })
    } else {
      set({ cart: [...cart, { ...safeProduct, qty: 1 }] })
    }
  },

  removeFromCart: (id) => {
    set({ cart: get().cart.filter((p) => p.id !== id) })
  },

  updateQty: (id, delta) => {
    const updated = get().cart
      .map((p) => p.id === id ? { ...p, qty: p.qty + delta } : p)
      .filter((p) => p.qty > 0)
    set({ cart: updated })
  },

  clearCart: () => set({ cart: [] }),

  cartTotal: () => get().cart.reduce((acc, p) => acc + p.price * p.qty, 0),

  cartCount: () => get().cart.reduce((acc, p) => acc + p.qty, 0),

  // ── Vehicle ──
  vehicle: null,
  setVehicle: (v) => set({ vehicle: v }),
  clearVehicle: () => set({ vehicle: null }),

  // ── Search ──
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query.trim() }),
  clearSearchQuery: () => set({ searchQuery: '' }),

  // ── UI ──
  currentView: 'home',
  setView: (v) => {
    set({ currentView: v })
    pushUrlForView(v)
  },
  syncViewFromUrl: () => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const raw = params.get('view')
    const view = (VALID_VIEWS as string[]).includes(raw ?? '') ? (raw as AppView) : 'home'
    set({ currentView: view })
  },

  // ── Catalog filter ──
  catalogSelectedGroup: 'TODOS',
  catalogSelectedSubgroup: 'TODO',
  setCatalogSelectedGroup: (g) => set({ catalogSelectedGroup: g }),
  setCatalogSelectedSubgroup: (s) => set({ catalogSelectedSubgroup: s }),
}))

// ── Demo products (BMW Serie 1 130i 2009) ──
export const demoProducts: Omit<CartProduct, 'qty'>[] = [
  { id: '1', name: 'Pastillas de freno delanteras', brand: 'Brembo',  ref: 'P06098',        price: 28500,  seller: 'Frenos del Sur',       sellerRating: 5, delivery: '3-5',  category: 'frenos' },
  { id: '2', name: 'Filtro de aceite',               brand: 'Bosch',   ref: 'F026407006',    price: 8200,   seller: 'Auto Repuestos GBA',   sellerRating: 5, delivery: '2-4',  category: 'filtros' },
  { id: '3', name: 'Amortiguador delantero (x1)',    brand: 'Sachs',   ref: '312 584',       price: 54000,  seller: 'Suspensiones Cañon',   sellerRating: 4, delivery: '5-7',  category: 'amortiguacion' },
  { id: '4', name: 'Disco de freno delantero',       brand: 'Brembo',  ref: '09.C328.11',    price: 42800,  seller: 'Frenos del Sur',       sellerRating: 5, delivery: '3-5',  category: 'frenos' },
  { id: '5', name: 'Filtro de aire',                 brand: 'Mahle',   ref: 'LX 1804',       price: 11400,  seller: 'Auto Repuestos GBA',   sellerRating: 5, delivery: '2-4',  category: 'filtros' },
  { id: '6', name: 'Kit de embrague completo',       brand: 'Valeo',   ref: '835067',        price: 118000, seller: 'Importadora BSport',   sellerRating: 4, delivery: '7-10', category: 'embrague' },
]
