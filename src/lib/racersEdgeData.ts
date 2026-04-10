export type RECategory = 'motor' | 'suspension' | 'llantas' | 'frenos' | 'carroceria' | 'interior'

export interface REProduct {
  id: string
  name: string
  brand: string
  category: RECategory
  price: number
  priceUnit?: string
  description: string
  specs?: string
  universal: boolean
  emoji: string
  tag?: 'NUEVO' | 'TOP SELLER' | 'OFERTA'
}

export const RE_CATEGORIES: { key: RECategory | 'todos'; label: string; emoji: string }[] = [
  { key: 'todos',      label: 'TODOS',       emoji: '⚡' },
  { key: 'motor',      label: 'MOTOR',       emoji: '🔥' },
  { key: 'suspension', label: 'SUSPENSIÓN',  emoji: '⚙️' },
  { key: 'llantas',    label: 'LLANTAS',     emoji: '🛞' },
  { key: 'frenos',     label: 'FRENOS',      emoji: '🔴' },
  { key: 'carroceria', label: 'CARROCERÍA',  emoji: '🏎️' },
  { key: 'interior',   label: 'INTERIOR',    emoji: '🪑' },
]

export const CATEGORY_COLOR: Record<RECategory, string> = {
  motor:      '#ff4400',
  suspension: '#6644ff',
  llantas:    '#44aaff',
  frenos:     '#cc1111',
  carroceria: '#ff8800',
  interior:   '#44cc88',
}

export const reProducts: REProduct[] = [
  // ── MOTOR ──
  {
    id: 're1', name: 'Kit Turbo Stage 2', brand: 'BorgWarner', category: 'motor',
    price: 485000, description: 'Refuerza la entrega de potencia hasta un 40% sobre stock. Incluye turbocompresor, juntas y hardware.',
    specs: '+40% potencia · Acero inoxidable', universal: false, emoji: '🔥', tag: 'TOP SELLER',
  },
  {
    id: 're2', name: 'Filtro de Aire de Alto Flujo', brand: 'K&N', category: 'motor',
    price: 38500, description: 'Mejora la admisión de aire con filtro lavable y reutilizable. Compatible con caja de aire original.',
    specs: 'Lavable y reutilizable · 1.000.000 km garantía', universal: true, emoji: '🌪️',
  },
  {
    id: 're3', name: 'Escape Deportivo Cat-Back', brand: 'Milltek Sport', category: 'motor',
    price: 195000, description: 'Sistema cat-back doble salida en acero 304. Sonido deportivo profundo sin drone a velocidad crucero.',
    specs: 'Acero AISI 304 · Cat-back · Doble salida', universal: false, emoji: '💨', tag: 'NUEVO',
  },
  {
    id: 're4', name: 'Intercooler de Alta Eficiencia', brand: 'Wagner Tuning', category: 'motor',
    price: 145000, description: 'Reduce la temperatura del aire de admisión hasta 30°C. Plug & play para modelos turbo.',
    specs: '-30°C admisión · Plug & play', universal: false, emoji: '❄️',
  },
  {
    id: 're5', name: 'Tune ECU Etapa 1', brand: 'EuroTune', category: 'motor',
    price: 89000, description: 'Reprogramación de unidad de control para maximizar potencia y torque manteniendo confiabilidad y garantía.',
    specs: '+25 HP / +40 Nm estimado · Stage 1', universal: false, emoji: '💻', tag: 'TOP SELLER',
  },
  {
    id: 're6', name: 'Kit Admisión de Aire Frío', brand: 'AEM Induction', category: 'motor',
    price: 65000, description: 'Reemplaza la caja de fábrica con sistema de alto caudal. Sonido intake agresivo y respuesta inmediata.',
    specs: 'Alto caudal · Filtro cónico · Universal', universal: true, emoji: '🌬️',
  },

  // ── SUSPENSIÓN ──
  {
    id: 're7', name: 'Kit Coilovers KW Variant 3', brand: 'KW Suspension', category: 'suspension',
    price: 420000, description: 'Regulación independiente de compresión y rebote. Altura ajustable ±30mm. El estándar del tuning serio.',
    specs: '±30mm altura · Compr. y rebote ajustable', universal: false, emoji: '🔩', tag: 'TOP SELLER',
  },
  {
    id: 're8', name: 'Muelles Deportivos Pro-Kit', brand: 'Eibach', category: 'suspension',
    price: 89000, description: 'Reduce la altura 25-35mm mejorando el centro de gravedad y la estética. Progresivos, no endurecen en extremo.',
    specs: '-25/35mm altura · Progresivos', universal: false, emoji: '🌀',
  },
  {
    id: 're9', name: 'Barra Estabilizadora Delantera', brand: 'Whiteline', category: 'suspension',
    price: 68000, description: 'Aumenta el diámetro de la barra antivuelco reduciendo el rolido en curva sin sacrificar el confort.',
    specs: '24mm → 26mm · Silentblock poliuretano', universal: false, emoji: '⚡',
  },
  {
    id: 're10', name: 'Strut Brace Delantero', brand: 'Raceland', category: 'suspension',
    price: 45000, description: 'Rigidiza el chasis en la zona del tren delantero para mayor precisión de dirección. Aluminio aeronáutico.',
    specs: 'Aluminio 6061 · Bolt-on sin modificaciones', universal: false, emoji: '🔧',
  },

  // ── LLANTAS ──
  {
    id: 're11', name: 'Enkei RPF1 18×9.5 ET38', brand: 'Enkei', category: 'llantas',
    price: 125000, priceUnit: 'c/u', description: 'La más liviana de su categoría. Fabricada con Flow Form Technology. Favorita en motorsport amateur mundial.',
    specs: '18×9.5 ET38 · PCD 5×120 · CB 72.6', universal: true, emoji: '⭕', tag: 'TOP SELLER',
  },
  {
    id: 're12', name: 'BBS CH-R 19×8.5 ET32', brand: 'BBS', category: 'llantas',
    price: 285000, priceUnit: 'c/u', description: 'Diseño tela de araña en 10 rayos. Forjada en una sola pieza. El estándar de calidad premium europeo.',
    specs: '19×8.5 ET32 · PCD 5×120 · CB 72.6', universal: true, emoji: '🔘',
  },
  {
    id: 're13', name: 'Rays Volk TE37 Saga 18×9', brand: 'Rays Engineering', category: 'llantas',
    price: 320000, priceUnit: 'c/u', description: 'Ícono del tuning japonés. Forjada en aluminio 2024, 6 radios, máxima rigidez con el mínimo peso posible.',
    specs: '18×9 ET35 · PCD 5×120 · CB 72.6', universal: true, emoji: '🟡', tag: 'NUEVO',
  },
  {
    id: 're14', name: 'Work Emotion CR Kai 17×8', brand: 'Work Wheels', category: 'llantas',
    price: 210000, priceUnit: 'c/u', description: 'Estética japonesa clásica, múltiples offsets disponibles. Liviana y resistente para uso diario y pista.',
    specs: '17×8 ET35 · PCD 5×120 · CB 72.6', universal: true, emoji: '⚪',
  },

  // ── FRENOS ──
  {
    id: 're15', name: 'Kit Frenos Brembo GT 4 pistones', brand: 'Brembo', category: 'frenos',
    price: 580000, description: 'Sistema gran turismo con pinzas monobloque de 4 pistones y discos ventilados de 330mm. Frenada brutal.',
    specs: '4 pistones · Discos 330mm ventilados', universal: false, emoji: '🔴', tag: 'TOP SELLER',
  },
  {
    id: 're16', name: 'Pastillas EBC Redstuff Sport', brand: 'EBC Brakes', category: 'frenos',
    price: 45000, description: 'Pastillas de polvo cerámico para uso mixto calle/pista. Bajo polvo, excelente mordida en frío y en caliente.',
    specs: 'Cerámico · Calle/pista · Bajo polvo', universal: false, emoji: '🟥',
  },
  {
    id: 're17', name: 'Líneas de Freno Trenzadas', brand: 'Goodridge', category: 'frenos',
    price: 38000, description: 'Reemplazan las mangueras de goma eliminando la expansión hidráulica. Pedal más firme, respuesta más directa.',
    specs: 'Acero inox trenzado · Kit 4 líneas', universal: true, emoji: '🔗',
  },

  // ── CARROCERÍA ──
  {
    id: 're18', name: 'Kit Carrocería M Performance', brand: 'BMW M Performance', category: 'carroceria',
    price: 280000, description: 'Kit genuino con parachoques delantero, laterales y trasero. Acabado en negro texturado imitación carbono.',
    specs: 'Genuino BMW · ABS + fibra carbono', universal: false, emoji: '🏎️', tag: 'NUEVO',
  },
  {
    id: 're19', name: 'Alerón Trasero Ajustable', brand: 'Seibon Carbon', category: 'carroceria',
    price: 165000, description: 'Fibra de carbono auténtica, ajuste de 0° a 15°. Aporta downforce real a velocidades de autopista.',
    specs: 'Fibra carbono auténtica · 0°-15° ajuste', universal: true, emoji: '🪁',
  },
  {
    id: 're20', name: 'Difusor Trasero en Carbono', brand: 'Vorsteiner', category: 'carroceria',
    price: 95000, description: 'Difusor de 3 canales en fibra de carbono 2×2 tejido. Mejora extracción de aire bajo el vehículo.',
    specs: 'Carbono 2×2 tejido · 3 canales · Bolt-on', universal: false, emoji: '⬇️',
  },

  // ── INTERIOR ──
  {
    id: 're21', name: 'Butaca Deportiva Pro 2000', brand: 'Sparco', category: 'interior',
    price: 198000, description: 'Butaca homologada FIA con concha en fibra de vidrio. Compatible con arnés de 4 puntos. Múltiples colores.',
    specs: 'Homologada FIA · Fibra de vidrio', universal: true, emoji: '🪑', tag: 'TOP SELLER',
  },
  {
    id: 're22', name: 'Volante de Carreras 350mm', brand: 'Momo', category: 'interior',
    price: 75000, description: 'Aro de cuero cosido a mano, diámetro 350mm. Requiere cubo adaptador (vendido por separado).',
    specs: '350mm · Cuero cosido · Sin airbag', universal: true, emoji: '🎯',
  },
  {
    id: 're23', name: 'Manómetro Presión de Turbo', brand: 'Defi', category: 'interior',
    price: 48000, description: 'Reloj OLED de presión de turbo con función peak hold. Iluminación ajustable en múltiples colores.',
    specs: 'Display OLED · Peak hold · -1 a 2 bar', universal: true, emoji: '⏱️', tag: 'NUEVO',
  },
  {
    id: 're24', name: 'Cinturón de Seguridad 4 Puntos', brand: 'Sabelt', category: 'interior',
    price: 35000, description: 'Arnés homologado FIA para uso en pista. Ancho 3" en hombros y 2" en cintura. Negro y rojo disponibles.',
    specs: 'Homologado FIA · 3" hombros / 2" cintura', universal: true, emoji: '🔒',
  },
  {
    id: 're25', name: 'Pedales Deportivos en Aluminio', brand: 'NRG Innovations', category: 'interior',
    price: 18500, description: 'Set de 3 pedales en aluminio anodizado antideslizante. Sin modificaciones requeridas, fijación mecánica.',
    specs: 'Set 3 piezas · Antideslizante · Bolt-on', universal: true, emoji: '🦶',
  },
]
