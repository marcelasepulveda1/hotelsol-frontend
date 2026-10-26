# HotelSol — Frontend (Evaluación Parcial 2, DSY1104 Fullstack II)

Autora: Marcela Sepúlveda Huircán · Duoc UC

Frontend en **React + Vite** para el caso **HotelSol**, hotel boutique de Providencia que hoy gestiona reservas en cuaderno y Excel. Este sistema permite reservar en línea con control de disponibilidad (evita la sobreventa) y administrar habitaciones.

## Tecnologías
- React 18 + Vite
- React Router (navegación entre vistas)
- Bootstrap 5 (diseño responsivo)
- localStorage (persistencia de la base de datos simulada)
- Vitest + React Testing Library (pruebas unitarias y cobertura)

## Cómo ejecutar
```bash
npm install
npm run dev        # levanta el sitio en http://localhost:5173
npm test           # ejecuta las pruebas
npm run coverage   # pruebas + reporte de cobertura
```

## Vistas
| Tienda (huésped) | Administración |
|---|---|
| Inicio, Habitaciones (con buscador y filtro), Detalle de habitación, Ofertas, Mi reserva (carrito + servicios), Checkout (formulario validado), Reserva exitosa / con error, Nosotros, Contacto, Login y Registro | Dashboard, CRUD de habitaciones, Listado de reservas |

## Usuarios de prueba
| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@hotelsol.cl | admin123 |
| Cliente | juan@correo.cl | juan123 |

El enlace **Admin** del menú aparece solo al iniciar sesión como administrador.

## Estructura
```
src/
├── data/db.js            Base de datos simulada + CRUD + control de disponibilidad
├── context/              Estado global de la reserva (Context API)
├── components/           Componentes reutilizables (Boton, HabitacionCard, Filtros…)
├── pages/                Vistas de la tienda
├── pages/admin/          Vistas del panel de administración
└── __tests__/            Pruebas unitarias
docs/                     ERS V2 y documento de cobertura
```

## Pruebas
23 pruebas: renderizado, renderizado condicional, props, estado, eventos y uso de mocks (`vi.fn()` y `vi.spyOn()`).
Cobertura actual: 97% líneas, 93% ramas, 100% funciones (umbral exigido: 80%).

## Documentos de la entrega
- [ERS versión 2](docs/ERS_V2_HotelSol.md)
- [Documento de cobertura de testing](docs/Cobertura_Testing.md)
