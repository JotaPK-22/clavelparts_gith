-- ClavelParts · datos demo mínimos para probar el catálogo de repuestos
-- Ejecutar después de schema.sql

insert into public.marcas (nombre)
values ('BMW'), ('ALFA ROMEO')
on conflict (nombre) do nothing;

insert into public.modelos (marca_id, nombre)
select m.id, x.nombre
from public.marcas m
join (values
  ('BMW', 'SERIE 1'),
  ('ALFA ROMEO', 'GIULIA')
) as x(marca_nombre, nombre)
  on x.marca_nombre = m.nombre
on conflict (marca_id, nombre) do nothing;

insert into public.versiones (modelo_id, anio, version, motor_codigo)
select mo.id, x.anio, x.version, x.motor_codigo
from public.modelos mo
join public.marcas ma on ma.id = mo.marca_id
join (values
  ('BMW', 'SERIE 1', 2009, '130i M Sport Package 3.0L', 'N52B30'),
  ('BMW', 'SERIE 1', 2010, '130i M Sport Package 3.0L', 'N52B30'),
  ('ALFA ROMEO', 'GIULIA', 2024, '2.0 TB 200 CV', 'AR2.0TB')
) as x(marca_nombre, modelo_nombre, anio, version, motor_codigo)
  on x.marca_nombre = ma.nombre and x.modelo_nombre = mo.nombre
on conflict (modelo_id, anio, version, motor_codigo) do nothing;

insert into public.grupos (nombre, orden)
values
  ('Frenos', 10),
  ('Lubricación', 20),
  ('Suspensión', 30),
  ('Embrague', 40)
on conflict (nombre) do nothing;

insert into public.subgrupos (grupo_id, nombre, orden)
select g.id, x.nombre, x.orden
from public.grupos g
join (values
  ('Frenos', 'Pastillas', 10),
  ('Frenos', 'Discos', 20),
  ('Lubricación', 'Filtros', 10),
  ('Suspensión', 'Amortiguadores', 10),
  ('Embrague', 'Kits', 10)
) as x(grupo_nombre, nombre, orden)
  on x.grupo_nombre = g.nombre
on conflict (grupo_id, nombre) do nothing;

insert into public.productos (
  grupo_id,
  subgrupo_id,
  tipo_pieza,
  sku,
  producto,
  marca_pieza,
  numero_parte_oem,
  precio,
  precio_oferta,
  stock,
  liquidacion,
  activo,
  especificaciones,
  vendedor,
  imagen_url
)
select
  g.id,
  sg.id,
  x.tipo_pieza,
  x.sku,
  x.producto,
  x.marca_pieza,
  x.numero_parte_oem,
  x.precio,
  x.precio_oferta,
  x.stock,
  x.liquidacion,
  true,
  x.especificaciones::jsonb,
  x.vendedor,
  null
from (
  values
    ('Frenos', 'Pastillas', 'Pastillas de freno', 'P06098', 'Pastillas de freno delanteras', 'Brembo', 'P06098', 28500, 25900, 12, false, '{"eje":"delantero"}', 'Frenos del Sur'),
    ('Lubricación', 'Filtros', 'Filtro de aceite', 'F026407006', 'Filtro de aceite', 'Bosch', 'F026407006', 8200, null, 18, false, '{"tipo":"aceite"}', 'Auto Repuestos GBA'),
    ('Suspensión', 'Amortiguadores', 'Amortiguador', '312-584', 'Amortiguador delantero (x1)', 'Sachs', '312 584', 54000, null, 6, false, '{"lado":"delantero"}', 'Suspensiones Cañon'),
    ('Frenos', 'Discos', 'Disco de freno', '09.C328.11', 'Disco de freno delantero', 'Brembo', '09.C328.11', 42800, null, 10, false, '{"diametro_mm":330}', 'Frenos del Sur'),
    ('Lubricación', 'Filtros', 'Filtro de aire', 'LX-1804', 'Filtro de aire', 'Mahle', 'LX 1804', 11400, 9900, 15, false, '{"tipo":"aire"}', 'Auto Repuestos GBA'),
    ('Embrague', 'Kits', 'Kit de embrague', '835067', 'Kit de embrague completo', 'Valeo', '835067', 118000, 109000, 4, true, '{"incluye":"disco+placa+ruleman"}', 'Importadora BSport')
) as x(grupo_nombre, subgrupo_nombre, tipo_pieza, sku, producto, marca_pieza, numero_parte_oem, precio, precio_oferta, stock, liquidacion, especificaciones, vendedor)
join public.grupos g on g.nombre = x.grupo_nombre
join public.subgrupos sg on sg.grupo_id = g.id and sg.nombre = x.subgrupo_nombre
on conflict (sku) do update set
  precio = excluded.precio,
  precio_oferta = excluded.precio_oferta,
  stock = excluded.stock,
  liquidacion = excluded.liquidacion,
  activo = true;

insert into public.compatibilidades (producto_id, version_id)
select p.id, v.id
from public.productos p
cross join public.versiones v
join public.modelos mo on mo.id = v.modelo_id
join public.marcas ma on ma.id = mo.marca_id
where ma.nombre = 'BMW'
  and mo.nombre = 'SERIE 1'
  and v.anio = 2009
  and v.version = '130i M Sport Package 3.0L'
on conflict (producto_id, version_id) do nothing;
