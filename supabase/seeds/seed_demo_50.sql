-- ClavelParts — Seed DEMO con 50 productos plausibles
-- Ejecutar en Supabase SQL Editor.
--
-- Pobla la base con:
--   - 5 marcas top Argentina (Toyota, Ford, Chevrolet, Fiat, VW)
--   - 15 modelos (3 por marca, los más vendidos)
--   - 15 versiones (1 por modelo, año 2020-2023)
--   - 6 grupos + 14 subgrupos
--   - 10 vendedores ficticios (con auth_user_id UUID random — no pueden loguearse)
--   - 50 productos con SKU, precio en ARS, marca, descripción
--   - ~150 compatibilidades (cada producto con 2-5 vehículos)
--   - 50 fotos (usando las imágenes de /categories/ que ya tiene el proyecto)
--
-- IDEMPOTENTE: usa `where not exists (...)` en cada insert así podés
-- correrlo varias veces sin duplicar. No borra nada existente.
-- (Se evitan ON CONFLICT por si tu DB no tiene los unique constraints
-- definidos en schema.sql.)

------------------------------------------------------------
-- 0. ASEGURAR COLUMNAS (defensa contra schemas antiguos)
-- Agrega columnas que necesitamos si no existen. Es idempotente.
------------------------------------------------------------
alter table public.vendedores
  add column if not exists nombre            text,
  add column if not exists nombre_comercial  text,
  add column if not exists razon_social      text,
  add column if not exists email             text;

alter table public.productos
  add column if not exists descripcion_corta text,
  add column if not exists descripcion_larga text,
  add column if not exists marca_pieza       text,
  add column if not exists numero_parte_oem  text,
  add column if not exists imagen_url        text,
  add column if not exists vendedor          text,
  add column if not exists vendedor_id       bigint,
  add column if not exists grupo_id          bigint,
  add column if not exists subgrupo_id       bigint,
  add column if not exists activo            boolean not null default true;

alter table public.grupos
  add column if not exists orden integer not null default 100;

alter table public.subgrupos
  add column if not exists orden integer not null default 100;

------------------------------------------------------------
-- 1. MARCAS
------------------------------------------------------------
insert into public.marcas (nombre)
select v.nombre
from (values ('Toyota'), ('Ford'), ('Chevrolet'), ('Fiat'), ('Volkswagen')) as v(nombre)
where not exists (
  select 1 from public.marcas existing where existing.nombre = v.nombre
);

------------------------------------------------------------
-- 2. MODELOS (3 por marca, los más vendidos en AR)
------------------------------------------------------------
insert into public.modelos (marca_id, nombre)
select m.id, mod.nombre
from public.marcas m
join (values
  ('Toyota',     'Hilux'),
  ('Toyota',     'Corolla'),
  ('Toyota',     'Etios'),
  ('Ford',       'Focus'),
  ('Ford',       'EcoSport'),
  ('Ford',       'Ranger'),
  ('Chevrolet',  'Onix'),
  ('Chevrolet',  'Cruze'),
  ('Chevrolet',  'Tracker'),
  ('Fiat',       'Cronos'),
  ('Fiat',       'Toro'),
  ('Fiat',       'Argo'),
  ('Volkswagen', 'Gol'),
  ('Volkswagen', 'Polo'),
  ('Volkswagen', 'Amarok')
) as mod(marca, nombre) on mod.marca = m.nombre
where not exists (
  select 1 from public.modelos existing
  where existing.marca_id = m.id and existing.nombre = mod.nombre
);

------------------------------------------------------------
-- 3. VERSIONES (1 por modelo)
------------------------------------------------------------
insert into public.versiones (modelo_id, anio, version, motor_codigo)
select md.id, v.anio, v.version, v.motor_codigo
from public.modelos md
join public.marcas mc on mc.id = md.marca_id
join (values
  ('Toyota',     'Hilux',     2022, 'SRV 4x4',        '1GD-FTV'),
  ('Toyota',     'Corolla',   2021, 'XEI 2.0 CVT',    '2ZR-FAE'),
  ('Toyota',     'Etios',     2020, 'XLS 1.5',        '2NR-FE'),
  ('Ford',       'Focus',     2019, 'Titanium 2.0',   'DURATEC'),
  ('Ford',       'EcoSport',  2020, 'Freestyle 1.5',  'DRAGON'),
  ('Ford',       'Ranger',    2022, 'XLT 3.2 4x4',    'P5AT'),
  ('Chevrolet',  'Onix',      2021, 'LTZ 1.4',        'L2C'),
  ('Chevrolet',  'Cruze',     2020, 'LT 1.4 Turbo',   'LE2'),
  ('Chevrolet',  'Tracker',   2022, 'Premier 1.2T',   'LIH'),
  ('Fiat',       'Cronos',    2022, 'Drive 1.3',      'FIREFLY'),
  ('Fiat',       'Toro',      2021, 'Volcano 2.0 4x4','EVO'),
  ('Fiat',       'Argo',      2020, 'Drive 1.3',      'FIREFLY'),
  ('Volkswagen', 'Gol',       2020, 'Trendline 1.6',  'MSI'),
  ('Volkswagen', 'Polo',      2021, 'Highline 1.6',   'MSI'),
  ('Volkswagen', 'Amarok',    2022, 'Highline V6',    '3.0 TDI')
) as v(marca, modelo, anio, version, motor_codigo)
  on v.marca = mc.nombre and v.modelo = md.nombre
where not exists (
  select 1 from public.versiones existing
  where existing.modelo_id = md.id
    and existing.anio = v.anio
    and existing.version = v.version
    and existing.motor_codigo = v.motor_codigo
);

------------------------------------------------------------
-- 4. GRUPOS
------------------------------------------------------------
insert into public.grupos (nombre, orden)
select v.nombre, v.orden
from (values
  ('Motor',                  1),
  ('Frenos',                 2),
  ('Suspensión y Dirección', 3),
  ('Eléctrico',              4),
  ('Carrocería',             5),
  ('Filtros',                6)
) as v(nombre, orden)
where not exists (
  select 1 from public.grupos existing where existing.nombre = v.nombre
);

------------------------------------------------------------
-- 5. SUBGRUPOS
------------------------------------------------------------
insert into public.subgrupos (grupo_id, nombre, orden)
select g.id, s.subgrupo, s.orden
from public.grupos g
join (values
  ('Motor',                  'Juntas de motor',           1),
  ('Motor',                  'Bombas',                    2),
  ('Motor',                  'Correas y distribución',    3),
  ('Frenos',                 'Pastillas',                 1),
  ('Frenos',                 'Discos y campanas',         2),
  ('Frenos',                 'Cilindros y calipers',      3),
  ('Suspensión y Dirección', 'Amortiguadores',            1),
  ('Suspensión y Dirección', 'Rotulas y bujes',           2),
  ('Eléctrico',              'Sensores',                  1),
  ('Eléctrico',              'Bujías y bobinas',          2),
  ('Eléctrico',              'Iluminación',               3),
  ('Filtros',                'Aire',                      1),
  ('Filtros',                'Aceite',                    2),
  ('Filtros',                'Combustible',               3),
  ('Carrocería',             'Ópticas',                   1)
) as s(grupo, subgrupo, orden) on s.grupo = g.nombre
where not exists (
  select 1 from public.subgrupos existing
  where existing.grupo_id = g.id and existing.nombre = s.subgrupo
);

------------------------------------------------------------
-- 6. VENDEDORES FICTICIOS
-- (UUIDs random — no pueden loguearse, son solo para mostrar)
------------------------------------------------------------
insert into public.vendedores (auth_user_id, nombre, nombre_comercial, razon_social, email)
select gen_random_uuid(), v.nombre, v.nombre_comercial, v.razon_social, v.email
from (values
  ('Centenario',       'Repuestos Centenario',     'Repuestos Centenario SRL',     'ventas@centenario.com.ar'),
  ('Belgrano Auto',    'AutoParts Belgrano',       'AutoParts Belgrano SA',        'info@autopartsbelgrano.com.ar'),
  ('Casa Repuesto',    'Casa del Repuesto',        'Casa del Repuesto SRL',        'pedidos@casarepuesto.com.ar'),
  ('La Esquina',       'Repuestera La Esquina',    'La Esquina Repuestos SRL',     'contacto@laesquinarep.com.ar'),
  ('MultiPiezas',      'MultiPiezas Norte',        'MultiPiezas Norte SA',         'hola@multipiezas.com.ar'),
  ('Pilar Repuestos',  'Repuestos del Pilar',      'Repuestos del Pilar SRL',      'ventas@pilarrep.com.ar'),
  ('Quilmes Auto',     'Auto Center Quilmes',      'Auto Center Quilmes SA',       'info@quilmesauto.com.ar'),
  ('Mendoza Rep',      'Repuestera Mendoza',       'Mendoza Repuestos SRL',        'ventas@mendozarep.com.ar'),
  ('CrossParts',       'CrossParts Córdoba',       'CrossParts Córdoba SA',        'info@crossparts.com.ar'),
  ('Río Cuarto Rep',   'Repuestos Río Cuarto',     'Río Cuarto Repuestos SRL',     'pedidos@riocuartorep.com.ar')
) as v(nombre, nombre_comercial, razon_social, email)
where not exists (
  select 1 from public.vendedores existing where existing.email = v.email
);

------------------------------------------------------------
-- 7. PRODUCTOS (50)
------------------------------------------------------------
-- Usamos una CTE para cargar todo de una con IDs resueltos por nombre.

with productos_data as (
  select
    p.sku, p.producto, p.descripcion_corta, p.descripcion_larga,
    p.marca_pieza, p.numero_parte_oem, p.precio, p.stock,
    p.tipo_pieza, p.grupo, p.subgrupo, p.vendedor, p.imagen_url
  from (values
    -- ── FILTROS (10) ─────────────────────────────────────
    ('FA-VW-GOL-001',     'Filtro de aire VW Gol 1.6 MSI',           'Filtro original Mahle para VW Gol 1.6',                     'Filtro de aire de alto flujo, papel multicapa. Compatible con motores 1.6 MSI 2014-2023. Reemplazo recomendado cada 15.000 km.',                'Mahle',  'LX 1976',     8500,  18, 'filtro de aire',     'Filtros', 'Aire',         'Repuestos Centenario',     '/categories/lubricacion.png'),
    ('FA-CHEV-ONIX-001',  'Filtro de aire Chevrolet Onix 1.4',       'Filtro Mann-Filter para Onix 2018+',                        'Filtro de aire premium con sello hermético. Recomendado por GM Argentina. Vida útil 15.000 km en uso normal, 7.500 km en zonas con polvo.',  'Mann',   '52483 53',    9200,  25, 'filtro de aire',     'Filtros', 'Aire',         'AutoParts Belgrano',       '/categories/lubricacion.png'),
    ('FA-FORD-FOCUS-001', 'Filtro de aire Ford Focus 2.0',           'Filtro Bosch para Ford Focus Titanium',                     'Filtro de aire OEM para Ford Focus 1.6 y 2.0 Duratec. Excelente capacidad de retención.',                                                       'Bosch',  '1457433542',  7800,  12, 'filtro de aire',     'Filtros', 'Aire',         'Casa del Repuesto',        '/categories/lubricacion.png'),
    ('FAC-TOY-COR-001',   'Filtro de aceite Toyota Corolla 1.8/2.0', 'Filtro de aceite original Denso',                           'Filtro de aceite tipo cartucho para motores 1ZR/2ZR. Cambio cada 10.000 km junto con aceite sintético.',                                         'Denso',  '04152-37010', 4500,  40, 'filtro de aceite',   'Filtros', 'Aceite',       'Repuestera La Esquina',    '/categories/lubricacion.png'),
    ('FAC-CHEV-CRZ-001',  'Filtro de aceite Chevrolet Cruze 1.4T',   'Filtro Mahle para motores LE2 Turbo',                       'Filtro de aceite específico para Cruze Turbo. Apto para aceites 5W30 sintéticos.',                                                              'Mahle',  'OC1183',      5200,  30, 'filtro de aceite',   'Filtros', 'Aceite',       'MultiPiezas Norte',        '/categories/lubricacion.png'),
    ('FAC-FIAT-CRO-001',  'Filtro de aceite Fiat Cronos 1.3 Firefly','Filtro Tecfil compatible con motor Firefly',                'Filtro premium para Fiat Cronos, Argo y Mobi. Resistente a altas temperaturas.',                                                                'Tecfil', 'PSL576',      3900,  35, 'filtro de aceite',   'Filtros', 'Aceite',       'Repuestos del Pilar',      '/categories/lubricacion.png'),
    ('FC-FORD-RAN-001',   'Filtro de combustible Ford Ranger 3.2',   'Filtro de gasoil para Ford Ranger XLT 3.2',                 'Filtro de combustible diesel con separador de agua. Reemplazo cada 20.000 km.',                                                                 'Bosch',  'F026402024',  15800, 8,  'filtro combustible', 'Filtros', 'Combustible',  'Auto Center Quilmes',      '/categories/lubricacion.png'),
    ('FC-TOY-HIL-001',    'Filtro de combustible Toyota Hilux 2.8',  'Filtro Denso para Hilux GD-6 2016+',                        'Filtro de gasoil premium con elemento filtrante de papel fenólico. Vida útil 20.000 km.',                                                       'Denso',  '23390-OL010', 18500, 10, 'filtro combustible', 'Filtros', 'Combustible',  'Repuestera Mendoza',       '/categories/lubricacion.png'),
    ('FAC-VW-POLO-001',   'Filtro de aceite VW Polo 1.6 MSI',        'Filtro Mahle para Polo y Virtus',                           'Filtro de aceite con válvula antidrenaje. Compatible con todos los motores 1.6 MSI.',                                                           'Mahle',  'OC470',       4100,  28, 'filtro de aceite',   'Filtros', 'Aceite',       'CrossParts Córdoba',       '/categories/lubricacion.png'),
    ('FA-FIAT-TORO-001',  'Filtro de aire Fiat Toro 2.0 Diesel',     'Filtro Mann-Filter para Toro Volcano',                      'Filtro de aire de servicio pesado para Fiat Toro 2.0 Multijet 4x4.',                                                                            'Mann',   'C26012',      11200, 14, 'filtro de aire',     'Filtros', 'Aire',         'Repuestos Río Cuarto',     '/categories/lubricacion.png'),

    -- ── FRENOS (10) ──────────────────────────────────────
    ('PD-CHEV-ONIX-001',  'Pastillas freno delanteras Chevrolet Onix','Set 4 pastillas TRW originales',                            'Pastillas de freno cerámicas para Chevrolet Onix LTZ. Bajo nivel de polvo y silenciosas. Incluye sensor de desgaste.',                          'TRW',    'GDB1773',     22500, 22, 'pastillas',          'Frenos',  'Pastillas',    'Repuestos Centenario',     '/categories/frenos.png'),
    ('PD-TOY-HIL-001',    'Pastillas freno delanteras Toyota Hilux', 'Pastillas Bremtec semi-metálicas Hilux',                    'Set 4 pastillas reforzadas para Hilux SRV 4x4. Excelente rendimiento en frenado bajo carga.',                                                  'Bremtec','BT11140',     32800, 18, 'pastillas',          'Frenos',  'Pastillas',    'AutoParts Belgrano',       '/categories/frenos.png'),
    ('PT-FORD-FOC-001',   'Pastillas freno traseras Ford Focus',     'Pastillas Ferodo para Focus Titanium',                      'Set 4 pastillas traseras Ferodo Premier. Reemplazo recomendado cada 30.000 km.',                                                                'Ferodo', 'FDB4259',     18900, 15, 'pastillas',          'Frenos',  'Pastillas',    'Casa del Repuesto',        '/categories/frenos.png'),
    ('DD-CHEV-CRZ-001',   'Disco freno delantero Cruze (par)',       'Par discos ventilados Brembo',                              'Discos de freno delanteros ventilados Ø 276mm. Ideal para uso urbano y mixto.',                                                                 'Brembo', '09.9772.10',  42500, 10, 'discos',             'Frenos',  'Discos y campanas','Repuestera La Esquina', '/categories/frenos.png'),
    ('DD-VW-AMA-001',     'Disco freno delantero Amarok V6 (par)',   'Discos perforados ATE para Amarok Highline',                'Par de discos delanteros ventilados Ø 350mm. Compatible con Amarok V6 3.0 TDI.',                                                                'ATE',    '24.0132-0205',58900, 6,  'discos',             'Frenos',  'Discos y campanas','MultiPiezas Norte',    '/categories/frenos.png'),
    ('LF-NA-DOT4-001',    'Líquido de freno DOT4 (500ml)',           'Líquido de freno sintético Bosch DOT4',                     'Líquido de freno sintético de alta performance. Punto de ebullición 230°C. Aplicable a todos los autos modernos.',                              'Bosch',  '1987479107',  3500,  60, 'liquido freno',      'Frenos',  'Cilindros y calipers','Repuestos del Pilar', '/categories/frenos.png'),
    ('CL-FIAT-CRO-001',   'Caliper trasero Fiat Cronos (lado izq)',  'Caliper original ATE para Cronos Drive',                    'Caliper trasero izquierdo con kit de pistones nuevo. Listo para instalar.',                                                                     'ATE',    '24.3505-1707',38900, 5,  'caliper',            'Frenos',  'Cilindros y calipers','Auto Center Quilmes', '/categories/frenos.png'),
    ('PT-TOY-COR-001',    'Pastillas freno traseras Toyota Corolla', 'Set 4 pastillas Akebono para Corolla XEI',                  'Pastillas traseras Akebono cerámicas. Bajo desgaste, silenciosas.',                                                                              'Akebono','AN-687WK',    19500, 20, 'pastillas',          'Frenos',  'Pastillas',    'Repuestera Mendoza',       '/categories/frenos.png'),
    ('CM-VW-GOL-001',     'Cilindro maestro freno VW Gol',           'Cilindro maestro TRW para Gol Trendline',                   'Cilindro maestro tandem para VW Gol 1.6. Incluye depósito y juntas.',                                                                            'TRW',    'PML431',      28500, 7,  'cilindro maestro',   'Frenos',  'Cilindros y calipers','CrossParts Córdoba', '/categories/frenos.png'),
    ('PD-FORD-ECO-001',   'Pastillas freno delanteras EcoSport',     'Set 4 pastillas Frasle para Ford EcoSport Freestyle',       'Pastillas semi-metálicas para EcoSport 1.5. Excelente relación calidad-precio.',                                                                 'Frasle', 'PD1149',      14800, 28, 'pastillas',          'Frenos',  'Pastillas',    'Repuestos Río Cuarto',     '/categories/frenos.png'),

    -- ── SUSPENSIÓN Y DIRECCIÓN (10) ──────────────────────
    ('AM-VW-GOL-001',     'Amortiguador delantero VW Gol (par)',     'Par amortiguadores Sachs para Gol Trendline',               'Par de amortiguadores delanteros Sachs Advantage. Confort y durabilidad.',                                                                       'Sachs',  '290835',      48900, 12, 'amortiguador',       'Suspensión y Dirección','Amortiguadores','Repuestos Centenario','/categories/suspension.png'),
    ('AM-CHEV-ONIX-001',  'Amortiguador trasero Onix (par)',         'Par amortiguadores Monroe para Chevrolet Onix',             'Par amortiguadores Monroe Original para Onix LTZ. Comfort drive.',                                                                                'Monroe', 'G7400',       42500, 14, 'amortiguador',       'Suspensión y Dirección','Amortiguadores','AutoParts Belgrano',  '/categories/suspension.png'),
    ('AM-TOY-HIL-001',    'Amortiguador delantero Hilux (par)',      'Par amortiguadores KYB para Hilux SRV 4x4',                 'Par amortiguadores KYB Excel-G para Hilux. Ideal para uso off-road y caminos de ripio.',                                                          'KYB',    '341406',      72500, 8,  'amortiguador',       'Suspensión y Dirección','Amortiguadores','Casa del Repuesto',   '/categories/suspension.png'),
    ('RT-FORD-FOC-001',   'Rótula delantera Ford Focus',             'Rótula TRW para Focus Titanium 2.0',                        'Rótula de suspensión delantera TRW. Acero forjado, sello hermético.',                                                                             'TRW',    'JBJ7567',     14500, 20, 'rotula',             'Suspensión y Dirección','Rotulas y bujes','Repuestera La Esquina','/categories/suspension.png'),
    ('AM-FIAT-CRO-001',   'Amortiguador trasero Cronos (par)',       'Par amortiguadores Cofap para Fiat Cronos',                 'Par amortiguadores Cofap a gas. Compatible con Cronos Drive 1.3.',                                                                                'Cofap',  'GP31837',     38900, 16, 'amortiguador',       'Suspensión y Dirección','Amortiguadores','MultiPiezas Norte',   '/categories/suspension.png'),
    ('BJ-CHEV-CRZ-001',   'Bujes de parrilla Cruze (kit)',           'Kit bujes parrilla Sampa para Chevrolet Cruze',             'Kit completo de bujes de parrilla delantera. 4 piezas. Caucho de alta densidad.',                                                                 'Sampa',  '050.215',     22500, 11, 'bujes',              'Suspensión y Dirección','Rotulas y bujes','Repuestos del Pilar',  '/categories/suspension.png'),
    ('AM-VW-AMA-001',     'Amortiguador delantero Amarok (par)',     'Par amortiguadores Bilstein para VW Amarok V6',             'Par amortiguadores Bilstein B6 reforzados. Ideales para uso intensivo y carga.',                                                                  'Bilstein','24-185615',  98500, 5,  'amortiguador',       'Suspensión y Dirección','Amortiguadores','Auto Center Quilmes', '/categories/suspension.png'),
    ('RT-TOY-COR-001',    'Rótula inferior Toyota Corolla',          'Rótula 555 Japan para Corolla XEI',                         'Rótula inferior de control 555 fabricación japonesa. Excelente durabilidad.',                                                                     '555',    'SB-3992',     16500, 18, 'rotula',             'Suspensión y Dirección','Rotulas y bujes','Repuestera Mendoza',  '/categories/suspension.png'),
    ('AM-FORD-RAN-001',   'Amortiguador trasero Ranger (par)',       'Par amortiguadores Rancho RS5000 Ranger XLT',               'Par amortiguadores Rancho para Ford Ranger 3.2. Ideal para off-road y uso pesado.',                                                               'Rancho', 'RS55236',     89500, 4,  'amortiguador',       'Suspensión y Dirección','Amortiguadores','CrossParts Córdoba',  '/categories/suspension.png'),
    ('BJ-VW-POLO-001',    'Buje de bandeja VW Polo',                 'Buje Sampa para VW Polo Highline',                          'Buje de bandeja delantera VW Polo. Caucho hidráulico.',                                                                                            'Sampa',  '040.024',     8900,  25, 'bujes',              'Suspensión y Dirección','Rotulas y bujes','Repuestos Río Cuarto', '/categories/suspension.png'),

    -- ── ELÉCTRICO (10) ───────────────────────────────────
    ('BJ-VW-GOL-002',     'Bujías NGK VW Gol 1.6 MSI (set 4)',       'Set 4 bujías NGK para VW Gol Trendline',                    'Set de 4 bujías NGK Iridium IX para motor 1.6 MSI. Cambio cada 60.000 km.',                                                                       'NGK',    'BKR6E-11',    18500, 30, 'bujias',             'Eléctrico','Bujías y bobinas','Repuestos Centenario',   '/categories/encendido.png'),
    ('BJ-TOY-COR-002',    'Bujías Denso Iridium Corolla (set 4)',    'Set 4 bujías Denso Iridium para Corolla XEI',               'Bujías de larga duración Denso Iridium Power. Mayor eficiencia y respuesta.',                                                                     'Denso',  'IKH20',       24500, 22, 'bujias',             'Eléctrico','Bujías y bobinas','AutoParts Belgrano',     '/categories/encendido.png'),
    ('BB-CHEV-ONIX-001',  'Bobina de encendido Chevrolet Onix',      'Bobina Bosch para Onix LTZ 1.4',                            'Bobina de encendido individual para cilindro 1. Garantía 2 años.',                                                                                'Bosch',  '0986221024',  19800, 15, 'bobina',             'Eléctrico','Bujías y bobinas','Casa del Repuesto',      '/categories/encendido.png'),
    ('SE-FORD-FOC-001',   'Sensor MAP Ford Focus',                   'Sensor MAP Bosch para Focus Titanium 2.0',                  'Sensor de presión absoluta del múltiple. Plug and play.',                                                                                          'Bosch',  '0261230253',  22500, 8,  'sensor map',         'Eléctrico','Sensores',     'Repuestera La Esquina',    '/categories/encendido.png'),
    ('SO-VW-AMA-001',     'Sensor oxígeno Amarok V6',                'Sonda lambda NTK para VW Amarok 3.0 TDI',                   'Sensor de oxígeno banda ancha NTK. Conexión OEM directa.',                                                                                         'NTK',    '93535',       45800, 6,  'sensor oxigeno',     'Eléctrico','Sensores',     'MultiPiezas Norte',        '/categories/encendido.png'),
    ('FL-NA-H7-001',      'Lámpara H7 Philips X-tremeVision (par)',  'Par lámparas Philips H7 +130%',                             'Par de lámparas H7 Philips X-tremeVision +130% más luz. 12V 55W.',                                                                                  'Philips','12972XV+S2',  9800,  40, 'lampara h7',         'Eléctrico','Iluminación', 'Repuestos del Pilar',      '/categories/electricidad.png'),
    ('FL-NA-H4-001',      'Lámpara H4 Osram Night Breaker (par)',    'Par lámparas Osram H4 +150%',                               'Par lámparas H4 Osram Night Breaker Laser. Compatible con la mayoría de autos AR.',                                                                'Osram',  '64193NB200',  11200, 35, 'lampara h4',         'Eléctrico','Iluminación', 'Auto Center Quilmes',      '/categories/electricidad.png'),
    ('SE-TOY-HIL-001',    'Sensor TPS Toyota Hilux',                 'Sensor posición acelerador OEM Hilux 2.8',                  'Sensor de posición del acelerador electrónico. OEM Toyota.',                                                                                       'Toyota', '89281-71010', 38500, 4,  'sensor tps',         'Eléctrico','Sensores',     'Repuestera Mendoza',       '/categories/encendido.png'),
    ('BB-FIAT-CRO-001',   'Bobina encendido Fiat Cronos 1.3',        'Bobina Magneti Marelli para Fiat Cronos Drive',             'Bobina de encendido para motor Firefly. Compatible con Cronos, Argo y Mobi.',                                                                      'M.Marelli','BAE800AI',  16500, 12, 'bobina',             'Eléctrico','Bujías y bobinas','CrossParts Córdoba',  '/categories/encendido.png'),
    ('LF-NA-LED-001',     'Kit luces LED H4 universal',              'Kit luces LED H4 6000K 8000 lúmenes',                       'Kit conversión LED H4 con ventilación activa. 6000K luz blanca. Universal.',                                                                       'Aozoom', 'AZ-H4-PRO',   25800, 18, 'led h4',             'Eléctrico','Iluminación', 'Repuestos Río Cuarto',     '/categories/electricidad.png'),

    -- ── MOTOR (10) ───────────────────────────────────────
    ('CD-FIAT-CRO-001',   'Correa distribución Cronos 1.3 Firefly',  'Correa Gates para motor Firefly',                           'Correa de distribución Gates Power Grip. Cambio recomendado cada 60.000 km.',                                                                      'Gates',  '5677XS',      18500, 20, 'correa distribucion','Motor',   'Correas y distribución','Repuestos Centenario','/categories/motor.png'),
    ('CD-VW-POLO-001',    'Kit distribución VW Polo 1.6',            'Kit completo Contitech: correa + tensores + bomba',         'Kit completo de distribución Contitech para VW Polo 1.6 MSI. Incluye correa, tensor, polea loca y bomba de agua.',                                'Contitech','CT1139WP1',  78500, 6,  'kit distribucion',   'Motor',   'Correas y distribución','AutoParts Belgrano', '/categories/motor.png'),
    ('BA-CHEV-ONIX-001',  'Bomba de agua Onix 1.4',                  'Bomba SKF para Chevrolet Onix LTZ',                         'Bomba de agua SKF con sello mecánico reforzado. Garantía 2 años.',                                                                                 'SKF',    'VKPC85630',   28500, 9,  'bomba agua',         'Motor',   'Bombas',       'Casa del Repuesto',        '/categories/motor.png'),
    ('JT-VW-GOL-001',     'Junta tapa válvulas VW Gol',              'Junta Goetze para Gol 1.6 MSI',                             'Junta de tapa de válvulas de silicona. Resistente a altas temperaturas.',                                                                          'Goetze', '50-029537-00',12500, 22, 'junta',              'Motor',   'Juntas de motor','Repuestera La Esquina',  '/categories/motor.png'),
    ('TM-CHEV-CRZ-001',   'Termostato Chevrolet Cruze 1.4T',         'Termostato Wahler para Cruze LT Turbo',                     'Termostato con carcasa para Cruze 1.4 Turbo LE2. Apertura a 87°C.',                                                                                'Wahler', '410187D',     18900, 8,  'termostato',         'Motor',   'Juntas de motor','MultiPiezas Norte',      '/categories/motor.png'),
    ('BA-FORD-FOC-001',   'Bomba combustible Ford Focus',            'Bomba de combustible eléctrica Bosch para Focus',           'Bomba de combustible eléctrica con regulador integrado. Para Focus Titanium 2.0.',                                                                 'Bosch',  '0580314084',  62500, 5,  'bomba combustible',  'Motor',   'Bombas',       'Repuestos del Pilar',      '/categories/motor.png'),
    ('CD-TOY-COR-001',    'Correa distribución Corolla 1.8/2.0',     'Correa Gates para motor 1ZR/2ZR',                           'Correa de distribución Gates con dientes redondeados. Ideal para motores VVT-i.',                                                                  'Gates',  '5491XS',      16800, 15, 'correa distribucion','Motor',   'Correas y distribución','Auto Center Quilmes', '/categories/motor.png'),
    ('JT-FIAT-TORO-001',  'Junta carter Fiat Toro 2.0 Diesel',       'Junta de carter Reinz para Fiat Toro Volcano',              'Junta de carter de aluminio con sellante incorporado. Compatible con Toro 2.0 Multijet.',                                                          'Reinz',  '154322001',   8500,  18, 'junta',              'Motor',   'Juntas de motor','Repuestera Mendoza',     '/categories/motor.png'),
    ('BA-TOY-HIL-001',    'Bomba aceite Toyota Hilux 2.8',           'Bomba de aceite GD-6 original',                             'Bomba de aceite reforzada para motor 1GD-FTV. Apta para uso intensivo.',                                                                            'Toyota', '15100-11070', 89500, 3,  'bomba aceite',       'Motor',   'Bombas',       'CrossParts Córdoba',       '/categories/motor.png'),
    ('CD-FORD-ECO-001',   'Correa distribución EcoSport 1.5 Dragon', 'Correa Continental para Ford EcoSport',                     'Correa de distribución Continental para motor Dragon 1.5. Recambio cada 80.000 km.',                                                               'Conti',  'CT1139',      14500, 12, 'correa distribucion','Motor',   'Correas y distribución','Repuestos Río Cuarto','/categories/motor.png')
  ) as p(sku, producto, descripcion_corta, descripcion_larga, marca_pieza, numero_parte_oem, precio, stock, tipo_pieza, grupo, subgrupo, vendedor, imagen_url)
)
insert into public.productos (
  sku, producto, descripcion_corta, descripcion_larga,
  marca_pieza, numero_parte_oem, precio, stock,
  tipo_pieza, grupo_id, subgrupo_id, vendedor_id, vendedor, imagen_url, activo
)
select
  pd.sku, pd.producto, pd.descripcion_corta, pd.descripcion_larga,
  pd.marca_pieza, pd.numero_parte_oem, pd.precio, pd.stock,
  pd.tipo_pieza,
  g.id  as grupo_id,
  sg.id as subgrupo_id,
  v.id  as vendedor_id,
  pd.vendedor,
  pd.imagen_url,
  true
from productos_data pd
left join public.grupos    g  on g.nombre = pd.grupo
left join public.subgrupos sg on sg.nombre = pd.subgrupo and sg.grupo_id = g.id
left join public.vendedores v on v.nombre_comercial = pd.vendedor
where not exists (
  select 1 from public.productos existing where existing.sku = pd.sku
);

------------------------------------------------------------
-- 8. COMPATIBILIDADES (cada producto con varios vehículos)
------------------------------------------------------------
-- Mapeamos cada producto a las versiones compatibles (por modelo).
-- Cada producto SKU lleva entre 1 y 5 modelos compatibles según su naturaleza
-- (un filtro de aceite genérico es compatible con muchos, un caliper con un solo modelo).

with compat_map as (
  select * from (values
    -- Filtros (suelen ser compatibles con varios autos)
    ('FA-VW-GOL-001',     'Volkswagen', 'Gol'),
    ('FA-VW-GOL-001',     'Volkswagen', 'Polo'),
    ('FA-CHEV-ONIX-001',  'Chevrolet',  'Onix'),
    ('FA-CHEV-ONIX-001',  'Chevrolet',  'Tracker'),
    ('FA-FORD-FOCUS-001', 'Ford',       'Focus'),
    ('FA-FORD-FOCUS-001', 'Ford',       'EcoSport'),
    ('FAC-TOY-COR-001',   'Toyota',     'Corolla'),
    ('FAC-TOY-COR-001',   'Toyota',     'Etios'),
    ('FAC-CHEV-CRZ-001',  'Chevrolet',  'Cruze'),
    ('FAC-CHEV-CRZ-001',  'Chevrolet',  'Tracker'),
    ('FAC-FIAT-CRO-001',  'Fiat',       'Cronos'),
    ('FAC-FIAT-CRO-001',  'Fiat',       'Argo'),
    ('FC-FORD-RAN-001',   'Ford',       'Ranger'),
    ('FC-TOY-HIL-001',    'Toyota',     'Hilux'),
    ('FAC-VW-POLO-001',   'Volkswagen', 'Polo'),
    ('FAC-VW-POLO-001',   'Volkswagen', 'Gol'),
    ('FA-FIAT-TORO-001',  'Fiat',       'Toro'),

    -- Frenos (más específicos por modelo)
    ('PD-CHEV-ONIX-001',  'Chevrolet',  'Onix'),
    ('PD-CHEV-ONIX-001',  'Chevrolet',  'Tracker'),
    ('PD-TOY-HIL-001',    'Toyota',     'Hilux'),
    ('PT-FORD-FOC-001',   'Ford',       'Focus'),
    ('DD-CHEV-CRZ-001',   'Chevrolet',  'Cruze'),
    ('DD-VW-AMA-001',     'Volkswagen', 'Amarok'),
    ('LF-NA-DOT4-001',    'Toyota',     'Corolla'),
    ('LF-NA-DOT4-001',    'Toyota',     'Hilux'),
    ('LF-NA-DOT4-001',    'Volkswagen', 'Gol'),
    ('LF-NA-DOT4-001',    'Volkswagen', 'Polo'),
    ('LF-NA-DOT4-001',    'Ford',       'Focus'),
    ('LF-NA-DOT4-001',    'Ford',       'EcoSport'),
    ('LF-NA-DOT4-001',    'Chevrolet',  'Onix'),
    ('LF-NA-DOT4-001',    'Fiat',       'Cronos'),
    ('CL-FIAT-CRO-001',   'Fiat',       'Cronos'),
    ('CL-FIAT-CRO-001',   'Fiat',       'Argo'),
    ('PT-TOY-COR-001',    'Toyota',     'Corolla'),
    ('CM-VW-GOL-001',     'Volkswagen', 'Gol'),
    ('PD-FORD-ECO-001',   'Ford',       'EcoSport'),

    -- Suspensión y Dirección
    ('AM-VW-GOL-001',     'Volkswagen', 'Gol'),
    ('AM-CHEV-ONIX-001',  'Chevrolet',  'Onix'),
    ('AM-TOY-HIL-001',    'Toyota',     'Hilux'),
    ('RT-FORD-FOC-001',   'Ford',       'Focus'),
    ('RT-FORD-FOC-001',   'Ford',       'EcoSport'),
    ('AM-FIAT-CRO-001',   'Fiat',       'Cronos'),
    ('AM-FIAT-CRO-001',   'Fiat',       'Argo'),
    ('BJ-CHEV-CRZ-001',   'Chevrolet',  'Cruze'),
    ('AM-VW-AMA-001',     'Volkswagen', 'Amarok'),
    ('RT-TOY-COR-001',    'Toyota',     'Corolla'),
    ('RT-TOY-COR-001',    'Toyota',     'Etios'),
    ('AM-FORD-RAN-001',   'Ford',       'Ranger'),
    ('BJ-VW-POLO-001',    'Volkswagen', 'Polo'),

    -- Eléctrico
    ('BJ-VW-GOL-002',     'Volkswagen', 'Gol'),
    ('BJ-VW-GOL-002',     'Volkswagen', 'Polo'),
    ('BJ-TOY-COR-002',    'Toyota',     'Corolla'),
    ('BJ-TOY-COR-002',    'Toyota',     'Etios'),
    ('BB-CHEV-ONIX-001',  'Chevrolet',  'Onix'),
    ('SE-FORD-FOC-001',   'Ford',       'Focus'),
    ('SE-FORD-FOC-001',   'Ford',       'EcoSport'),
    ('SO-VW-AMA-001',     'Volkswagen', 'Amarok'),
    ('FL-NA-H7-001',      'Toyota',     'Corolla'),
    ('FL-NA-H7-001',      'Volkswagen', 'Polo'),
    ('FL-NA-H7-001',      'Chevrolet',  'Cruze'),
    ('FL-NA-H7-001',      'Fiat',       'Cronos'),
    ('FL-NA-H7-001',      'Ford',       'Focus'),
    ('FL-NA-H4-001',      'Volkswagen', 'Gol'),
    ('FL-NA-H4-001',      'Chevrolet',  'Onix'),
    ('FL-NA-H4-001',      'Toyota',     'Etios'),
    ('FL-NA-H4-001',      'Ford',       'EcoSport'),
    ('FL-NA-H4-001',      'Fiat',       'Argo'),
    ('SE-TOY-HIL-001',    'Toyota',     'Hilux'),
    ('BB-FIAT-CRO-001',   'Fiat',       'Cronos'),
    ('BB-FIAT-CRO-001',   'Fiat',       'Argo'),
    ('LF-NA-LED-001',     'Volkswagen', 'Gol'),
    ('LF-NA-LED-001',     'Chevrolet',  'Onix'),
    ('LF-NA-LED-001',     'Fiat',       'Cronos'),
    ('LF-NA-LED-001',     'Ford',       'EcoSport'),

    -- Motor
    ('CD-FIAT-CRO-001',   'Fiat',       'Cronos'),
    ('CD-FIAT-CRO-001',   'Fiat',       'Argo'),
    ('CD-VW-POLO-001',    'Volkswagen', 'Polo'),
    ('BA-CHEV-ONIX-001',  'Chevrolet',  'Onix'),
    ('JT-VW-GOL-001',     'Volkswagen', 'Gol'),
    ('TM-CHEV-CRZ-001',   'Chevrolet',  'Cruze'),
    ('BA-FORD-FOC-001',   'Ford',       'Focus'),
    ('CD-TOY-COR-001',    'Toyota',     'Corolla'),
    ('JT-FIAT-TORO-001',  'Fiat',       'Toro'),
    ('BA-TOY-HIL-001',    'Toyota',     'Hilux'),
    ('CD-FORD-ECO-001',   'Ford',       'EcoSport')
  ) as t(sku, marca, modelo)
)
insert into public.compatibilidades (producto_id, version_id)
select
  p.id as producto_id,
  v.id as version_id
from compat_map cm
join public.productos p on p.sku = cm.sku
join public.marcas    m on m.nombre = cm.marca
join public.modelos   md on md.nombre = cm.modelo and md.marca_id = m.id
join public.versiones v on v.modelo_id = md.id
where not exists (
  select 1 from public.compatibilidades existing
  where existing.producto_id = p.id and existing.version_id = v.id
);

------------------------------------------------------------
-- 9. FOTOS DE PRODUCTO (1 por producto, usando imagen_url)
------------------------------------------------------------
insert into public.fotos_producto (producto_id, url, orden)
select p.id, p.imagen_url, 1
from public.productos p
where p.imagen_url is not null
  and not exists (
    select 1 from public.fotos_producto fp where fp.producto_id = p.id and fp.orden = 1
  );

------------------------------------------------------------
-- LISTO! Refrescamos el cache de PostgREST.
------------------------------------------------------------
notify pgrst, 'reload schema';

-- Verificación rápida: corré esto en una nueva query después de ejecutar
-- el seed para confirmar que cargó todo:
--
--   select 'marcas' as t, count(*) from public.marcas
--   union all select 'modelos', count(*) from public.modelos
--   union all select 'versiones', count(*) from public.versiones
--   union all select 'vendedores', count(*) from public.vendedores
--   union all select 'productos', count(*) from public.productos
--   union all select 'compatibilidades', count(*) from public.compatibilidades;
