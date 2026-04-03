export interface ModelData {
  engines: string[]
  years: string[]
  image?: string
  imaginFamily?: string     // Imagin.studio slug override
  imaginBodyStyle?: string  // 'hatchback' | 'coupe' | 'cabriolet' | 'suv' | etc.
}

export interface BrandData {
  models: Record<string, ModelData>
}

// ─── Year range helper ─────────────────────────────────────────────────────
function yr(from: number, to = 2024): string[] {
  return Array.from({ length: to - from + 1 }, (_, i) => String(to - i))
}

// ─── Vehicle catalog ───────────────────────────────────────────────────────
export const carData: Record<string, BrandData> = {
  'ALFA ROMEO': {
    models: {
      'GIULIA':  { engines: ['2.0 TB 200 CV', '2.0 TB 280 CV', '2.2 JTDm 150 CV', '2.9 V6 Biturbo Quadrifoglio 510 CV'], years: yr(2016) },
      'STELVIO': { engines: ['2.0 TB 200 CV', '2.0 TB 280 CV', '2.2 JTDm 160 CV', '2.9 V6 Biturbo Quadrifoglio 510 CV'], years: yr(2016) },
    },
  },

  BMW: {
    models: {
      'SERIE 1': {
        engines: ['116i 1.6L', '118i 2.0L', '120i 2.0L', '125i 3.0L', '130i M Sport Package 3.0L', '135i 3.0L', '118d 2.0L', '120d 2.0L', '123d 2.0L'],
        years: yr(2004),
        imaginFamily: '1er',
        imaginBodyStyle: 'hatchback',
      },
      'SERIE 1 COUPÉ': {
        engines: ['120i 2.0L', '125i 3.0L', '130i M Sport Package 3.0L', '135i 3.0L M Performance', '123d 2.0L'],
        years: yr(2007, 2013),
        imaginFamily: '1er',
        imaginBodyStyle: 'coupe',
      },
      'SERIE 1 CABRIOLET': {
        engines: ['118i 2.0L', '120i 2.0L', '125i 3.0L', '135i 3.0L'],
        years: yr(2008, 2013),
        imaginFamily: '1er',
        imaginBodyStyle: 'convertible',
      },
      'SERIE 2 COUPÉ': {
        engines: ['218i 2.0L', '220i 2.0L', '228i 2.0L', '235i 3.0L M Performance', '218d 2.0L', '220d 2.0L'],
        years: yr(2014),
        imaginFamily: '2er',
        imaginBodyStyle: 'coupe',
      },
      'SERIE 3': {
        engines: ['318i 2.0L', '320i 2.0L', '325i 2.5L', '328i 2.0L Turbo', '330i 3.0L', '335i 3.0L', '320d 2.0L', '318d 2.0L'],
        years: yr(1998),
        imaginFamily: '3er',
      },
      'SERIE 5': {
        engines: ['520i 2.0L', '523i 2.5L', '525i 3.0L', '528i 2.0L Turbo', '530i 3.0L', '535i 3.0L', '520d 2.0L', '525d 3.0L'],
        years: yr(2003),
        imaginFamily: '5er',
      },
      'X1': {
        engines: ['sDrive20i 2.0L', 'xDrive20i 2.0L', 'xDrive28i 2.0L', 'sDrive20d 2.0L', 'xDrive20d 2.0L'],
        years: yr(2009),
        imaginFamily: 'x1',
      },
      'X3': {
        engines: ['xDrive20i 2.0L', 'xDrive28i 2.0L', 'xDrive35i 3.0L', 'xDrive20d 2.0L', 'xDrive30d 3.0L'],
        years: yr(2003),
        imaginFamily: 'x3',
      },
      'X5': {
        engines: ['xDrive35i 3.0L', 'xDrive50i 4.4L', 'xDrive30d 3.0L', 'xDrive35d 3.0L', 'xDrive40i 3.0L'],
        years: yr(1999),
        imaginFamily: 'x5',
      },
    },
  },

  CHEVROLET: {
    models: {
      'ONIX':    { engines: ['1.0 TURBO 100 CV', '1.4 NAFTA 98 CV', '1.0 TURBO 116 CV LTZ'], years: yr(2012), imaginFamily: 'onix' },
      'CRUZE':   { engines: ['1.4 TURBO 153 CV', '1.8 NAFTA 141 CV', '1.6 TD 136 CV'], years: yr(2009), imaginFamily: 'cruze' },
      'TRACKER': { engines: ['1.2 TURBO 133 CV', '1.0 TURBO 116 CV', '1.4 TURBO 153 CV 4x4'], years: yr(2013), imaginFamily: 'tracker' },
      'S10':     { engines: ['2.8 TD 200 CV 4x2', '2.8 TD 200 CV 4x4', '2.5 NAFTA 155 CV', '2.8 TD 250 CV High Country'], years: yr(2012), imaginFamily: 's10' },
      'SPIN':    { engines: ['1.8 NAFTA 130 CV', '1.3 TD 90 CV'], years: yr(2012, 2022), imaginFamily: 'spin' },
    },
  },

  CITROËN: {
    models: {
      'C3':         { engines: ['1.2 PureTech 82 CV', '1.2 PureTech 110 CV', '1.5 BlueHDi 100 CV'], years: yr(2002), imaginFamily: 'c3' },
      'C4 CACTUS':  { engines: ['1.2 PureTech 110 CV', '1.6 BlueHDi 100 CV', '1.2 PureTech 130 CV'], years: yr(2014, 2022), imaginFamily: 'c4-cactus' },
      'C4':         { engines: ['1.2 PureTech 130 CV', '1.5 BlueHDi 130 CV'], years: yr(2020), imaginFamily: 'c4' },
      'BERLINGO':   { engines: ['1.5 BlueHDi 130 CV', '1.2 PureTech 110 CV', '1.6 BlueHDi 100 CV'], years: yr(1996), imaginFamily: 'berlingo' },
      'JUMPER':     { engines: ['2.2 BlueHDi 120 CV', '2.2 BlueHDi 140 CV', '2.2 BlueHDi 165 CV'], years: yr(2006), imaginFamily: 'jumper' },
    },
  },

  FIAT: {
    models: {
      'CRONOS':  { engines: ['1.3 Firefly 101 CV', '1.8 MPI 133 CV', '1.0 Turbo 130 CV'], years: yr(2017), imaginFamily: 'tipo' },
      'PALIO':   { engines: ['1.4 Fire 87 CV', '1.6 16V 104 CV', '1.8 MPI 127 CV'], years: yr(1996, 2021), imaginFamily: 'palio' },
      'TORO':    { engines: ['1.8 E.TORQ 139 CV', '2.0 TD 170 CV 4x2', '2.0 TD 170 CV 4x4', '1.3 Turbo 180 CV'], years: yr(2016), imaginFamily: 'fullback' },
      'STRADA':  { engines: ['1.3 Firefly 107 CV', '1.4 Fire 85 CV', '1.7 TD 80 CV'], years: yr(1998), imaginFamily: 'strada' },
      'ARGO':    { engines: ['1.3 Firefly 101 CV', '1.8 MPI 132 CV'], years: yr(2017), imaginFamily: 'argo' },
      'PUNTO':   { engines: ['1.4 Fire 77 CV', '1.6 MPI 97 CV', '1.3 Multijet 90 CV'], years: yr(2005, 2018), imaginFamily: 'punto' },
    },
  },

  FORD: {
    models: {
      'FOCUS':    { engines: ['1.6 NAFTA 115 CV', '2.0 NAFTA 145 CV', '1.6 TDCi 90 CV', '2.0 TDCi 115 CV', '2.3 EcoBoost 250 CV ST'], years: yr(2000, 2019), imaginFamily: 'focus' },
      'RANGER':   { engines: ['2.2 TD 150 CV 4x2', '2.2 TD 150 CV 4x4', '3.2 TD 200 CV 4x4', '2.3 EcoBoost 170 CV', '2.0 Bi-Turbo 213 CV 4x4'], years: yr(1998), imaginFamily: 'ranger' },
      'ECOSPORT': { engines: ['1.5 NAFTA 123 CV', '1.5 TD 100 CV', '2.0 NAFTA 141 CV', '1.0 EcoBoost 140 CV'], years: yr(2003, 2022), imaginFamily: 'ecosport' },
      'KA':       { engines: ['1.0 NAFTA 75 CV', '1.5 NAFTA 105 CV', '1.5 TD 75 CV'], years: yr(2008, 2021), imaginFamily: 'ka' },
      'MAVERICK': { engines: ['2.0 EcoBoost 250 CV 4x4', '2.5 HYBRID 191 CV FWD'], years: yr(2021), imaginFamily: 'maverick' },
      'TERRITORY': { engines: ['1.5 EcoBoost 200 CV AWD'], years: yr(2019), imaginFamily: 'territory' },
    },
  },

  HONDA: {
    models: {
      'CIVIC':   { engines: ['1.5 TURBO 174 CV', '2.0 NAFTA 155 CV', '1.6 VTEC 125 CV', '2.0 Type-R 310 CV'], years: yr(2000), imaginFamily: 'civic' },
      'HR-V':    { engines: ['1.8 NAFTA 141 CV', '1.5 TURBO 182 CV', '1.5 e:HEV HYBRID 131 CV'], years: yr(2014), imaginFamily: 'hr-v' },
      'CR-V':    { engines: ['1.5 TURBO 190 CV', '2.4 NAFTA 188 CV', '2.0 e:HEV HYBRID 184 CV AWD'], years: yr(2000), imaginFamily: 'cr-v' },
      'WR-V':    { engines: ['1.5 NAFTA 121 CV'], years: yr(2023), imaginFamily: 'wr-v' },
      'FIT':     { engines: ['1.5 NAFTA 120 CV', '1.5 HYBRID 109 CV'], years: yr(2008, 2020), imaginFamily: 'jazz' },
    },
  },

  HYUNDAI: {
    models: {
      'HB20':    { engines: ['1.0 TURBO 100 CV', '1.6 NAFTA 121 CV', '1.0 TURBO 120 CV'], years: yr(2012), imaginFamily: 'i20' },
      'CRETA':   { engines: ['1.6 NAFTA 127 CV', '2.0 NAFTA 149 CV', '1.4 TURBO 140 CV'], years: yr(2014), imaginFamily: 'tucson' },
      'TUCSON':  { engines: ['2.0 NAFTA 155 CV', '1.6 TURBO 177 CV', '2.0 CRDi 185 CV', '1.6 HYBRID 230 CV'], years: yr(2004), imaginFamily: 'tucson' },
      'SANTA FE': { engines: ['2.4 NAFTA 188 CV', '2.2 CRDi 200 CV', '1.6 HYBRID 265 CV AWD'], years: yr(2001), imaginFamily: 'santa-fe' },
      'IONIQ 6': { engines: ['Electric RWD 228 CV', 'Electric AWD 325 CV'], years: yr(2022), imaginFamily: 'ioniq-6' },
    },
  },

  KIA: {
    models: {
      'SPORTAGE': { engines: ['2.0 NAFTA 150 CV', '1.6 T-GDi 177 CV', '2.0 CRDi 185 CV', '1.6 HYBRID AWD 265 CV'], years: yr(2004), imaginFamily: 'sportage' },
      'RIO':      { engines: ['1.4 MPI 100 CV', '1.0 T-GDi 100 CV', '1.6 MPI 124 CV'], years: yr(2005), imaginFamily: 'rio' },
      'SELTOS':   { engines: ['1.6 NAFTA 121 CV', '1.4 T-GDi 140 CV', '1.6 CRDi 136 CV'], years: yr(2019), imaginFamily: 'seltos' },
      'SORENTO':  { engines: ['2.5 NAFTA 174 CV', '2.2 CRDi 200 CV', '1.6 HYBRID AWD 265 CV'], years: yr(2002), imaginFamily: 'sorento' },
      'STINGER':  { engines: ['2.0 T-GDi 255 CV', '3.3 T-GDi V6 370 CV'], years: yr(2017), imaginFamily: 'stinger' },
    },
  },

  'MERCEDES-BENZ': {
    models: {
      'CLASE A':  { engines: ['A200 1.3T 163 CV', 'A250 2.0T 224 CV', 'A180d 1.5TD 116 CV', 'A45 AMG 2.0T 421 CV'], years: yr(1997), imaginFamily: 'a-class' },
      'CLASE C':  { engines: ['C200 1.5T 184 CV', 'C300 2.0T 258 CV', 'C220d 2.0TD 194 CV', 'C63 AMG 4.0T V8 510 CV'], years: yr(2000), imaginFamily: 'c-class' },
      'CLASE E':  { engines: ['E200 2.0T 197 CV', 'E300 2.0T 258 CV', 'E220d 2.0TD 194 CV', 'E63 AMG S 4.0T 612 CV'], years: yr(2002), imaginFamily: 'e-class' },
      'GLA':      { engines: ['GLA200 1.3T 163 CV', 'GLA250 2.0T 224 CV', 'GLA220d 2.0TD 190 CV'], years: yr(2013), imaginFamily: 'gla' },
      'GLC':      { engines: ['GLC200 1.5T 197 CV', 'GLC300 2.0T 258 CV', 'GLC220d 2.0TD 194 CV'], years: yr(2015), imaginFamily: 'glc' },
      'SPRINTER': { engines: ['2.1 CDI 109 CV', '2.2 CDI 163 CV', '2.2 CDI 190 CV', '2.0 NAFTA 211 CV'], years: yr(1995), imaginFamily: 'sprinter' },
    },
  },

  NISSAN: {
    models: {
      'VERSA':    { engines: ['1.6 16V 114 CV', '1.6 CVT 114 CV', '1.0 TURBO 122 CV'], years: yr(2011), imaginFamily: 'versa' },
      'KICKS':    { engines: ['1.6 16V 114 CV', '1.6 CVT 114 CV', '1.6 E-POWER HYBRID 136 CV'], years: yr(2016), imaginFamily: 'juke' },
      'FRONTIER': { engines: ['2.3 TD 163 CV 4x2', '2.3 TD 163 CV 4x4', '2.5 TD 190 CV 4x4', '2.3 BiTurbo 190 CV Pro-4X'], years: yr(1997), imaginFamily: 'navara' },
      'SENTRA':   { engines: ['2.0 CVT 149 CV', '1.8 NAFTA 130 CV'], years: yr(2000), imaginFamily: 'sentra' },
      'X-TRAIL':  { engines: ['2.5 NAFTA 171 CV', '1.5 DIG-T 160 CV', '1.5 E-POWER 213 CV'], years: yr(2000), imaginFamily: 'x-trail' },
    },
  },

  OPEL: {
    models: {
      'FRONTERA': {
        engines: ['2.2 DTI (115 CV) 4x4 SUV', '2.2i (136 CV) 4x4', '3.2i V6 (205 CV) 4x4', '2.0i (116 CV)'],
        years: yr(1991, 2004),
        imaginFamily: 'frontera',
      },
      'ASTRA': {
        engines: ['1.4T 140 CV', '1.6T 180 CV', '1.6 CDTI 136 CV', '2.0 OPC 280 CV', '1.2 110 CV'],
        years: yr(1991, 2022),
        imaginFamily: 'astra',
      },
      'CORSA': {
        engines: ['1.2 85 CV', '1.4 90 CV', '1.3 CDTI 95 CV', '1.0 TURBO 115 CV'],
        years: yr(1982, 2019),
        imaginFamily: 'corsa',
      },
      'MOKKA': {
        engines: ['1.2 TURBO 130 CV', '1.4 TURBO 152 CV', 'Electric 136 CV'],
        years: yr(2012),
        imaginFamily: 'mokka',
      },
    },
  },

  PEUGEOT: {
    models: {
      '206':     { engines: ['1.4 75 CV', '1.6 109 CV', '1.9 TD 70 CV', '2.0 135 CV'], years: yr(1998, 2012), imaginFamily: '206' },
      '207':     { engines: ['1.4 VTi 95 CV', '1.6 VTi 120 CV', '1.6 THP 150 CV', '1.6 HDi 112 CV'], years: yr(2006, 2014), imaginFamily: '207' },
      '208':     { engines: ['1.2 PureTech 82 CV', '1.2 PureTech 100 CV', '1.5 BlueHDi 100 CV', 'e-208 Electric 136 CV'], years: yr(2012), imaginFamily: '208' },
      '308':     { engines: ['1.2 PureTech 130 CV', '1.6 BlueHDi 120 CV', '1.6 THP 200 CV GTi'], years: yr(2007), imaginFamily: '308' },
      '2008':    { engines: ['1.2 PureTech 130 CV', '1.5 BlueHDi 110 CV', 'e-2008 Electric 136 CV'], years: yr(2013), imaginFamily: '2008' },
      '3008':    { engines: ['1.2 PureTech 130 CV', '1.6 THP 165 CV', '2.0 BlueHDi 150 CV', 'HYBRID 300 CV AWD'], years: yr(2009), imaginFamily: '3008' },
      'PARTNER': { engines: ['1.5 BlueHDi 130 CV', '1.2 PureTech 110 CV', '1.6 BlueHDi 100 CV'], years: yr(1997), imaginFamily: 'partner' },
    },
  },

  RENAULT: {
    models: {
      'LOGAN':   { engines: ['1.6 8V 84 CV', '1.6 16V 110 CV', '1.0 Turbo 100 CV'], years: yr(2004), imaginFamily: 'logan' },
      'DUSTER':  { engines: ['1.6 16V 114 CV 4x2', '2.0 16V 143 CV 4x4', '1.5 DCi 90 CV', '1.3 TCe 130 CV', '1.3 TCe 150 CV 4x4'], years: yr(2010), imaginFamily: 'duster' },
      'SANDERO': { engines: ['1.6 8V 84 CV', '1.6 16V 110 CV', '1.6 16V 110 CV GNC', '1.0 SCe 75 CV'], years: yr(2007), imaginFamily: 'sandero' },
      'KANGOO':  { engines: ['1.6 16V 110 CV', '1.5 DCi 90 CV', '1.5 DCi 110 CV', '1.3 TCe 100 CV'], years: yr(1997), imaginFamily: 'kangoo' },
      'KWID':    { engines: ['1.0 SCe 70 CV', '1.0 Turbo 100 CV'], years: yr(2016), imaginFamily: 'kwid' },
      'FLUENCE': { engines: ['1.6 16V 110 CV', '2.0 16V 140 CV', '1.5 dCi 110 CV'], years: yr(2010, 2017), imaginFamily: 'fluence' },
    },
  },

  SUBARU: {
    models: {
      'IMPREZA':  { engines: ['1.6i 114 CV', '2.0i AWD 154 CV', '2.0i AWD STI 300 CV'], years: yr(1992), imaginFamily: 'impreza' },
      'FORESTER': { engines: ['2.0 Boxer AWD 156 CV', '2.5 Boxer AWD 173 CV', '2.0 e-BOXER HYBRID 150 CV'], years: yr(1997), imaginFamily: 'forester' },
      'XV':       { engines: ['2.0 Boxer AWD 156 CV', '1.6i AWD 114 CV', '2.0 e-BOXER HYBRID 150 CV'], years: yr(2012), imaginFamily: 'xv' },
      'OUTBACK':  { engines: ['2.5i AWD 175 CV', '3.6R AWD 260 CV', '2.4 Turbo AWD 260 CV'], years: yr(2000), imaginFamily: 'outback' },
    },
  },

  TOYOTA: {
    models: {
      'COROLLA':  { engines: ['1.8 HYBRID 122 CV', '2.0 NAFTA 177 CV', '1.8 16V 136 CV', '1.6 16V 120 CV', '2.0 GR Sport 180 CV'], years: yr(2000), imaginFamily: 'corolla' },
      'HILUX':    { engines: ['2.4 TD 150 CV 4x2', '2.4 TD 150 CV 4x4', '2.8 TD 204 CV 4x4', '2.8 TD 204 CV GR-S'], years: yr(2005), imaginFamily: 'hilux' },
      'SW4':      { engines: ['2.8 TD 204 CV 4x4 5 ASIENTOS', '2.8 TD 204 CV 4x4 7 ASIENTOS', '2.8 TD GR-S 204 CV'], years: yr(2005), imaginFamily: 'land-cruiser-prado' },
      'YARIS':    { engines: ['1.5 NAFTA 107 CV', '1.5 HYBRID 116 CV', '1.5 GR Sport 125 CV'], years: yr(2005), imaginFamily: 'yaris' },
      'RAV4':     { engines: ['2.5 HYBRID AWD 222 CV', '2.0 NAFTA 173 CV', '2.5 PLUG-IN HYBRID AWD 306 CV'], years: yr(2000), imaginFamily: 'rav4' },
      'ETIOS':    { engines: ['1.5 NAFTA 97 CV', '1.5 NAFTA 107 CV'], years: yr(2012, 2022), imaginFamily: 'etios' },
    },
  },

  VOLKSWAGEN: {
    models: {
      'GOL TREND': { engines: ['1.6 GNC', '1.6 NAFTA', '1.0 MPI 75 CV', '1.0 TSI 110 CV'], years: yr(2006, 2022), imaginFamily: 'gol' },
      'POLO':      { engines: ['1.6 MSI 110 CV', '1.4 TSI 150 CV', '1.0 TSI 95 CV', '2.0 GTI 207 CV'], years: yr(2002), imaginFamily: 'polo' },
      'VIRTUS':    { engines: ['1.6 MSI 110 CV', '1.0 TSI 128 CV', '1.4 TSI 150 CV GTS'], years: yr(2018), imaginFamily: 'vento' },
      'AMAROK':    { engines: ['2.0 TDI 140 CV 4x2', '2.0 TDI 180 CV 4x4', '3.0 TDI V6 258 CV 4x4', '3.0 TDI V6 240 CV'], years: yr(2010), imaginFamily: 'amarok' },
      'VENTO':     { engines: ['1.4 TSI 150 CV', '1.6 MSI 110 CV', '1.0 TSI 115 CV'], years: yr(2014), imaginFamily: 'jetta' },
      'TIGUAN':    { engines: ['1.4 TSI 150 CV', '2.0 TDI 150 CV', '2.0 TSI 220 CV 4Motion', '2.0 TDI 190 CV 4Motion'], years: yr(2007), imaginFamily: 'tiguan' },
      'TAOS':      { engines: ['1.4 TSI 150 CV', '1.5 TSI 150 CV'], years: yr(2021), imaginFamily: 'taos' },
      'T-CROSS':   { engines: ['1.0 TSI 116 CV', '1.4 TSI 150 CV'], years: yr(2019), imaginFamily: 't-cross' },
    },
  },
}

// ─── Brands list ───────────────────────────────────────────────────────────
export const brands = Object.keys(carData).sort()

export function getModels(brand: string): string[] {
  return Object.keys(carData[brand]?.models ?? {}).sort()
}

export function getEngines(brand: string, model: string): string[] {
  return carData[brand]?.models[model]?.engines ?? []
}

export function getYears(brand: string, model: string): string[] {
  return carData[brand]?.models[model]?.years ?? []
}

// ─── Imagin.studio make slugs ──────────────────────────────────────────────
const imaginMakes: Record<string, string> = {
  'ALFA ROMEO':    'alfa-romeo',
  'BMW':           'bmw',
  'CHEVROLET':     'chevrolet',
  'CITROËN':       'citroen',
  'FIAT':          'fiat',
  'FORD':          'ford',
  'HONDA':         'honda',
  'HYUNDAI':       'hyundai',
  'KIA':           'kia',
  'MERCEDES-BENZ': 'mercedes-benz',
  'NISSAN':        'nissan',
  'OPEL':          'opel',
  'PEUGEOT':       'peugeot',
  'RENAULT':       'renault',
  'SUBARU':        'subaru',
  'TOYOTA':        'toyota',
  'VOLKSWAGEN':    'volkswagen',
}

// Fallback model slugs for models without imaginFamily on ModelData
const imaginModelFallback: Record<string, Record<string, string>> = {
  BMW:          { 'SERIE 1': '1er', 'SERIE 3': '3er', 'SERIE 5': '5er' },
  VOLKSWAGEN:   { 'GOL TREND': 'gol', 'VENTO': 'jetta', 'VIRTUS': 'vento' },
  'MERCEDES-BENZ': { 'CLASE A': 'a-class', 'CLASE C': 'c-class', 'CLASE E': 'e-class' },
}

function resolveImagingSlug(brand: string, model: string): { make: string; modelFamily: string; bodyStyle?: string } {
  const make       = imaginMakes[brand] ?? brand.toLowerCase().replace(/\s+/g, '-')
  const modelData  = carData[brand]?.models[model]
  const modelFamily =
    modelData?.imaginFamily ??
    imaginModelFallback[brand]?.[model] ??
    model.toLowerCase().replace(/\s+/g, '-')
  return { make, modelFamily, bodyStyle: modelData?.imaginBodyStyle }
}

/**
 * 3/4-front view image for the vehicle selector (white background).
 * Returns a local generation photo when Imagin.studio's demo key lacks it.
 */
export function getCarImageUrl(brand: string, model: string, year?: string): string {
  const local = getGenerationOverride(brand, model, year)
  if (local) return local

  const { make, modelFamily, bodyStyle } = resolveImagingSlug(brand, model)
  const params = new URLSearchParams({
    customer: 'img',
    make,
    modelFamily,
    angle: '34',
    zoomType: 'fullscreen',
    width: '800',
  })
  if (year)      params.set('modelYear', year)
  if (bodyStyle) params.set('bodyStyle', bodyStyle)
  return `https://cdn.imagin.studio/getimage?${params}`
}

/**
 * Front-facing view for the garage bay (Mi Garage screen).
 * Returns a local generation photo when Imagin.studio's demo key lacks it.
 */
export function getCarGarageImageUrl(brand: string, model: string, year?: string): string {
  const local = getGenerationOverride(brand, model, year)
  if (local) return local

  const { make, modelFamily, bodyStyle } = resolveImagingSlug(brand, model)
  const params = new URLSearchParams({
    customer: 'img',
    make,
    modelFamily,
    angle: '01',
    zoomType: 'fullscreen',
    width: '600',
  })
  if (year)      params.set('modelYear', year)
  if (bodyStyle) params.set('bodyStyle', bodyStyle)
  return `https://cdn.imagin.studio/getimage?${params}`
}

// ─── Generation-specific image overrides ─────────────────────────────────
// Used when Imagin.studio's demo key doesn't carry the render for that generation.
// Key: "BRAND|MODEL", value: array of { from, to, image } sorted from oldest to newest.

type GenImage = { from: number; to: number; image: string }

const generationOverrides: Record<string, GenImage[]> = {
  // BMW E87/E81 (2004-2011): demo key returns F40 as fallback — use real photo.
  'BMW|SERIE 1':          [{ from: 2004, to: 2011, image: '/cars/bmw_serie1_e87.jpg' }],
  'BMW|SERIE 1 COUPÉ':    [{ from: 2007, to: 2013, image: '/cars/bmw_serie1_e87.jpg' }],
  'BMW|SERIE 1 CABRIOLET':[{ from: 2008, to: 2013, image: '/cars/bmw_serie1_e87.jpg' }],
}

/** Returns a local image path for this generation, or null if Imagin.studio should be used. */
function getGenerationOverride(brand: string, model: string, year?: string): string | null {
  if (!year) return null
  const key  = `${brand}|${model}`
  const gens = generationOverrides[key]
  if (!gens) return null
  const y = parseInt(year, 10)
  return gens.find(g => y >= g.from && y <= g.to)?.image ?? null
}
