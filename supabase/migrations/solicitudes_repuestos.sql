-- ClavelParts — Tabla de solicitudes de repuestos no disponibles
-- Ejecutar en Supabase SQL Editor.
--
-- Cuando un comprador busca un repuesto y no tenemos stock para su modelo,
-- puede dejar su email + descripción. Se guarda acá para:
--   1) avisarle cuando algún vendedor publique algo compatible
--   2) priorizar qué autos sumar al catálogo (señal de demanda)

create table if not exists public.solicitudes_repuestos (
  id            bigserial primary key,
  email         text not null,
  marca         text,
  modelo        text,
  anio          text,
  version       text,
  descripcion   text not null,
  notificado    boolean not null default false,
  notificado_at timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists solicitudes_repuestos_email_idx
  on public.solicitudes_repuestos (email);

create index if not exists solicitudes_repuestos_marca_modelo_idx
  on public.solicitudes_repuestos (marca, modelo);

-- RLS: cualquiera puede insertar (es un form público de "avisame"),
-- nadie puede leer salvo el rol de servicio (admin).
alter table public.solicitudes_repuestos enable row level security;

drop policy if exists "solicitudes_insert_public" on public.solicitudes_repuestos;
create policy "solicitudes_insert_public"
  on public.solicitudes_repuestos
  for insert
  to anon, authenticated
  with check (true);

-- (no policy for select → solo service_role / dashboard pueden leer)

notify pgrst, 'reload schema';
