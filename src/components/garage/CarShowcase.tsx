import { useState, useEffect } from 'react';


interface GarageCar {
  id: string;
  brand: string;
  model: string;
  version: string;
  year: string | number;
  km: number;
  plate: string;
  photoFront?: string;
}

const defaultCar: GarageCar = {
  id: '1',
  brand: 'BMW',
  model: 'SERIE 1',
  version: '130i M Sport Package 3.0L',
  year: 2009,
  km: 142500,
  plate: 'HXC 704',
};

const defaultGarageCarImage = '/cars/Bmw-serie1-frente.jpeg';
const garageBackgroundImage = '/cars/garage.jpeg';

const notificationBadgeStyle: React.CSSProperties = {
  background: '#e3df05',
  color: '#000',
  borderRadius: '50%',
  width: '18px',
  height: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.7rem',
  fontWeight: 'bold',
  marginLeft: 'auto',
};

export default function CarShowcase({ car = defaultCar }: { car?: GarageCar }) {
  const [shutterOpen, setShutterOpen] = useState(false);

  useEffect(() => {
    setShutterOpen(false);
    const timer = setTimeout(() => setShutterOpen(true), 1000);
    return () => clearTimeout(timer);
  }, [car.id]);

  const carImage = car.photoFront ?? defaultGarageCarImage;

  return (
    <div className="relative w-full h-screen overflow-hidden flex" style={{ background: '#0a0a0a' }}>

      {/* ── SECCIÓN IZQUIERDA: EL GARAGE ── */}
      <div className="flex-1 flex flex-col relative" style={{ zIndex: 10 }}>

        {/* Header Superior */}
        <div className="flex items-center justify-between px-6 py-4" style={{ zIndex: 30 }}>
          <span className="text-xs tracking-widest cursor-pointer" style={{ color: 'hsl(var(--foreground))' }}>
            ← VOLVER
          </span>
          <div className="text-center">
            <h1 className="text-sm font-black tracking-[0.3em]" style={{ color: 'hsl(var(--foreground))' }}>
              MI GARAGE
            </h1>
          </div>
          <div style={{ width: '60px' }} />
        </div>

        {/* MARCO DEL VISUALIZADOR */}
        <div className="flex-1 relative mx-4 mb-2 overflow-hidden rounded-sm" style={{ border: '1px solid #222' }}>

          {/* Fondo del Garage */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${garageBackgroundImage})`, filter: 'brightness(0.7)' }}
          />

          {/* Suelo Negro */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{ height: '15%', background: 'linear-gradient(to top, #000 60%, transparent)' }}
          />

          {/* El Auto */}
          <div className="absolute inset-0 flex items-end justify-center" style={{ paddingBottom: '5%' }}>
            <img
              src={carImage}
              alt={`${car.brand} ${car.model}`}
              className="object-contain drop-shadow-2xl"
              style={{ maxHeight: '75%', maxWidth: '85%' }}
            />
          </div>

          {/* Persiana Industrial */}
          <div
            className="absolute inset-0 origin-top"
            style={{
              transform: shutterOpen ? 'scaleY(0)' : 'scaleY(1)',
              transition: 'transform 1.8s cubic-bezier(0.22, 1, 0.36, 1)',
              backgroundImage:
                'repeating-linear-gradient(180deg, hsl(0 0% 28%) 0px, hsl(0 0% 35%) 3px, hsl(0 0% 22%) 6px, hsl(0 0% 30%) 9px)',
              zIndex: 20,
            }}
          >
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{ height: '30px', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
            />
          </div>

          {/* Vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_80px_20px_rgba(0,0,0,0.6)]" />
        </div>

        {/* Info Inferior del Vehículo */}
        <div className="px-6 py-3">
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'hsl(var(--foreground))' }}>
            {car.brand} {car.model}
          </h2>
          <p className="text-xs mt-1 tracking-wide" style={{ color: 'hsl(var(--foreground) / 0.4)' }}>
            {car.version} · {car.year} · {car.km.toLocaleString('es-AR')} KM
          </p>
        </div>
      </div>

      {/* ── PANEL LATERAL DERECHO ── */}
      <div
        className="flex flex-col"
        style={{
          width: '280px',
          background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)',
          borderLeft: '1px solid #1a1a1a',
          zIndex: 20,
        }}
      >
        {/* Estado Superior */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid #1a1a1a' }}>
          <span style={{ color: '#4ade80', fontSize: '0.5rem' }}>●</span>
          <span className="text-xs font-bold tracking-wider" style={{ color: '#fff' }}>JUAMPI</span>
          <span className="text-xs ml-auto" style={{ color: '#555' }}>1 AUTO</span>
        </div>

        {/* Perfil */}
        <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: '1px solid #1a1a1a' }}>
          <div
            className="flex items-center justify-center rounded-full font-black text-lg"
            style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, hsl(var(--foreground)), #b8860b)',
              color: '#000',
            }}
          >
            J
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: '#fff' }}>JUAMPI</p>
            <p className="text-xs" style={{ color: '#666' }}>Comprador · Buenos Aires</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 text-center py-3" style={{ borderBottom: '1px solid #1a1a1a' }}>
          {[
            { value: '1', label: 'AUTO' },
            { value: '6', label: 'COMPRAS' },
            { value: '7', label: 'FAVORITOS' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-lg font-black" style={{ color: 'hsl(var(--foreground))' }}>{stat.value}</p>
              <p className="text-[0.6rem] tracking-wider" style={{ color: '#555' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Menú */}
        <nav className="flex-1 overflow-y-auto py-2">
          {/* Elemento activo */}
          <div
            className="flex items-center gap-3 px-4 py-3 cursor-pointer"
            style={{ background: 'rgba(255,200,0,0.08)', borderLeft: '3px solid hsl(var(--foreground))' }}
          >
            <span style={{ fontSize: '1.2rem' }}>🚗</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold" style={{ color: 'hsl(var(--foreground))' }}>MIS AUTOS</p>
              <p className="text-[0.65rem] truncate" style={{ color: '#666' }}>{car.brand} {car.model}</p>
            </div>
            <span
              className="flex items-center justify-center rounded-full text-xs font-bold"
              style={{
                width: '20px',
                height: '20px',
                background: 'hsl(var(--foreground))',
                color: '#000',
              }}
            >
              1
            </span>
          </div>

          {/* Resto del menú */}
          {[
            { icon: '📦', title: 'MIS COMPRAS', subtitle: 'Último pedido hace 3 días' },
            { icon: '⭐', title: 'FAVORITOS', subtitle: '7 repuestos guardados', notification: '7' },
            { icon: '🔔', title: 'ALERTAS', subtitle: '2 novedades para tu BMW', notification: '2' },
            { icon: '👤', title: 'MI PERFIL', subtitle: '' },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
              style={{ borderLeft: '3px solid transparent' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold" style={{ color: '#aaa' }}>{item.title}</p>
                {item.subtitle && <p className="text-[0.65rem] truncate" style={{ color: '#444' }}>{item.subtitle}</p>}
              </div>
              {item.notification && <span style={notificationBadgeStyle}>{item.notification}</span>}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid #1a1a1a' }}>
          <span className="text-[0.6rem] tracking-wider" style={{ color: '#333' }}>USER ID: 00492_JP</span>
          <span className="text-[0.6rem]" style={{ color: '#4ade80' }}>● ONLINE</span>
        </div>
      </div>
    </div>
  );
}
