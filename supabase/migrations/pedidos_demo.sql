-- ClavelParts — Tabla DEMO de pedidos
-- Ejecutar en Supabase SQL Editor.
--
-- IMPORTANTE: esta tabla es para la demo / showroom. El checkout actual
-- es mock (no hay pago real con MercadoPago todavía). Cuando enchufemos
-- pagos reales y envíos, se crea otra tabla `pedidos` con el modelo
-- definitivo y `pedidos_demo` queda solo como histórico de pruebas.

create table if not exists public.pedidos_demo (
  id              bigserial primary key,
  order_number    text not null unique,
  -- Datos del comprador
  nombre          text not null,
  apellido        text not null,
  email           text not null,
  telefono        text,
  -- Dirección de envío
  calle           text,
  numero          text,
  cp              text,
  ciudad          text,
  provincia       text,
  -- Items + total (jsonb permite guardar el carrito tal cual)
  items           jsonb not null,
  subtotal        numeric not null,
  envio           numeric not null default 0,
  total           numeric not null,
  -- Tracking simulado
  tracking_number text,
  -- Flag para distinguir demo de prod cuando enchufemos pagos reales
  is_demo         boolean not null default true,
  created_at      timestamptz not null default now()
);

create index if not exists pedidos_demo_email_idx
  on public.pedidos_demo (email);

create index if not exists pedidos_demo_order_number_idx
  on public.pedidos_demo (order_number);

create index if not exists pedidos_demo_created_at_idx
  on public.pedidos_demo (created_at desc);

-- RLS: cualquiera puede insertar (checkout es público para compradores
-- logueados o no). Nadie puede leer salvo service_role.
alter table public.pedidos_demo enable row level security;

drop policy if exists "pedidos_demo_insert_public" on public.pedidos_demo;
create policy "pedidos_demo_insert_public"
  on public.pedidos_demo
  for insert
  to anon, authenticated
  with check (true);

-- (no policy for select → solo dashboard / admin leen)

notify pgrst, 'reload schema';
