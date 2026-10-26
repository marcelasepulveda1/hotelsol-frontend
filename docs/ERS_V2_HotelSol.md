# Especificación de Requerimientos de Software (ERS) — Versión 2

**Proyecto:** HotelSol — Sistema de reservas en línea (Frontend)
**Asignatura:** DSY1104 Desarrollo Fullstack II — Evaluación Parcial 2
**Autora:** Marcela Sepúlveda Huircán
**Institución:** Duoc UC
**Fecha:** 25 de octubre de 2026
**Repositorio:** https://github.com/marcelasepulveda1/hotelsol-frontend

---

## Control de versiones

| Versión | Fecha | Descripción |
|---|---|---|
| 1.0 | Evaluación Parcial 1 | Primera versión de los requerimientos (levantamiento inicial). |
| 2.0 | 25-10-2026 | Se actualiza al caso HotelSol y al frontend en React: se agregan requerimientos de base de datos simulada con CRUD, persistencia en localStorage, panel de administración, registro/inicio de sesión, contacto y pruebas unitarias. |

---

## 1. Introducción

### 1.1 Propósito
Este documento describe los requerimientos del frontend del sistema de reservas de **HotelSol**. Sirve como guía para el desarrollo, las pruebas y la presentación del proyecto.

### 1.2 Alcance
El sistema permite a los huéspedes **buscar habitaciones, revisar su detalle, armar una reserva con servicios adicionales y confirmarla en línea**, evitando reservar una habitación que ya está ocupada en esas fechas (sobreventa).
Además, incluye un **panel de administración** para gestionar las habitaciones y revisar las reservas.

En esta etapa **no hay backend**: los datos se guardan en un archivo JavaScript que funciona como base de datos simulada y se persisten en el `localStorage` del navegador.

### 1.3 Definiciones
| Término | Significado |
|---|---|
| Huésped / cliente | Persona que reserva una habitación. |
| Administrador | Personal del hotel que gestiona habitaciones y reservas. |
| Sobreventa | Vender la misma habitación dos veces para fechas que se cruzan. |
| Check-in / Check-out | Fecha de llegada / fecha de salida. |
| BD simulada | Archivo `src/data/db.js` con los datos y las funciones CRUD. |
| CRUD | Crear, leer (listar), actualizar y eliminar registros. |

### 1.4 Descripción del caso
HotelSol es un hotel boutique ubicado en Providencia que hoy registra sus reservas en cuaderno y planillas Excel. Esto produce errores como reservas duplicadas (sobreventa), pérdida de información y poca visibilidad del estado de las habitaciones. El hotel necesita un sistema web donde los clientes reserven en línea y el personal administre la información.

**Datos del caso usados en el sistema:**
- Habitaciones **HB001 a HB006** (Single, Doble, Doble Twin, Superior, Suite y Familiar).
- Servicios **SV001 a SV007** (desayuno, almuerzo, cena, estacionamiento, lavandería, entre otros).
- Reservas **RS001 a RS005** con estados *Reservado, Hospedado y Check-out*.

---

## 2. Descripción general

### 2.1 Usuarios del sistema
| Usuario | Qué puede hacer |
|---|---|
| Visitante | Ver habitaciones, ofertas, detalle, información del hotel y enviar mensajes de contacto. |
| Cliente registrado | Lo mismo que el visitante, más iniciar sesión y reservar. |
| Administrador | Acceder al panel de administración: dashboard, CRUD de habitaciones y listado de reservas. |

### 2.2 Tecnologías
- **React 18** con **Vite** (componentes, props y estado con `useState`).
- **React Router** para la navegación entre vistas.
- **Context API** para el estado global de la reserva y del usuario conectado.
- **Bootstrap 5** para el diseño responsivo.
- **localStorage** para la persistencia de la BD simulada.
- **Vitest + React Testing Library** para pruebas unitarias y cobertura.

### 2.3 Restricciones
- Solo frontend, sin servidor ni base de datos real.
- Los datos quedan guardados en el navegador del usuario.
- Las contraseñas se guardan en texto plano solo porque es una simulación; en un sistema real se deben cifrar en el backend.

---

## 3. Requerimientos funcionales

### 3.1 Catálogo de habitaciones
| ID | Requerimiento | Vista |
|---|---|---|
| RF01 | El sistema debe mostrar en la página de inicio las habitaciones destacadas. | Inicio |
| RF02 | El sistema debe listar todas las habitaciones con tipo, capacidad, precio y estado. | Habitaciones |
| RF03 | El usuario debe poder **buscar** habitaciones escribiendo un texto (tipo o descripción). | Habitaciones |
| RF04 | El usuario debe poder **filtrar** habitaciones por tipo. | Habitaciones |
| RF05 | El sistema debe mostrar una página con las habitaciones que están **en oferta**. | Ofertas |
| RF06 | El usuario debe poder ver el **detalle** de una habitación. | Detalle |

### 3.2 Reserva
| ID | Requerimiento | Vista |
|---|---|---|
| RF07 | El usuario debe poder elegir fecha de llegada y salida y agregar la habitación a su reserva. | Detalle |
| RF08 | El sistema debe validar que la fecha de salida sea posterior a la de llegada. | Detalle |
| RF09 | El sistema debe **impedir la sobreventa**: no permitir reservar una habitación que ya tiene una reserva activa en fechas que se cruzan, ni una que esté en mantención. | Detalle / Checkout |
| RF10 | El usuario debe poder agregar y quitar **servicios adicionales** a su reserva. | Mi reserva |
| RF11 | El sistema debe calcular las noches, el subtotal de la habitación, el total de servicios y el total final. | Mi reserva |
| RF12 | El usuario debe poder vaciar su reserva. | Mi reserva |
| RF13 | El usuario debe ingresar sus datos (nombre, apellidos, correo y teléfono opcional) en un formulario validado. | Checkout |
| RF14 | Al confirmar, el sistema debe crear la reserva con un código correlativo (RS006, RS007…) y estado *Reservado*. | Checkout |
| RF15 | El sistema debe mostrar una página de **reserva exitosa** con el código, o una página de **error** con el motivo. | Resultado |

### 3.3 Usuarios
| ID | Requerimiento | Vista |
|---|---|---|
| RF16 | El visitante debe poder **registrarse** con nombre, correo y contraseña. | Registro |
| RF17 | El registro debe validar: nombre obligatorio, correo con formato válido, contraseña de mínimo 6 caracteres, confirmación igual a la contraseña y correo no repetido. | Registro |
| RF18 | El usuario debe poder **iniciar sesión** con correo y contraseña; si son incorrectos se muestra un mensaje de error. | Login |
| RF19 | Al iniciar sesión, el menú debe mostrar el nombre del usuario y un botón para salir. | Navbar |
| RF20 | El enlace al panel **Admin** solo debe aparecer cuando inicia sesión un usuario con rol administrador. | Navbar |

### 3.4 Contacto e información
| ID | Requerimiento | Vista |
|---|---|---|
| RF21 | El sistema debe mostrar información del hotel. | Nosotros |
| RF22 | El usuario debe poder enviar un **mensaje de contacto** (nombre, correo, asunto y mensaje de al menos 10 caracteres). El mensaje queda guardado en la BD simulada. | Contacto |

### 3.5 Administración
| ID | Requerimiento | Vista |
|---|---|---|
| RF23 | El administrador debe ver un **dashboard** con total de habitaciones, reservas activas y habitaciones fuera de servicio. | Admin — Dashboard |
| RF24 | El administrador debe poder **crear** habitaciones (código no repetido, tipo, precio, capacidad, oferta). | Admin — Habitaciones |
| RF25 | El administrador debe poder **editar** una habitación (por ejemplo, cambiar su estado a *Mantención*). | Admin — Habitaciones |
| RF26 | El administrador debe poder **eliminar** una habitación. | Admin — Habitaciones |
| RF27 | El administrador debe poder ver el **listado de reservas** con su estado. | Admin — Reservas |

---

## 4. Requerimientos no funcionales

| ID | Tipo | Requerimiento |
|---|---|---|
| RNF01 | Usabilidad | El sitio debe ser **responsivo** (celular, tablet y computador) usando la grilla de Bootstrap. |
| RNF02 | Usabilidad | Los formularios deben mostrar los errores junto al campo correspondiente (`is-invalid` + `invalid-feedback`). |
| RNF03 | Persistencia | Los datos deben mantenerse al recargar la página gracias a `localStorage`. |
| RNF04 | Mantenibilidad | El código debe estar organizado en componentes reutilizables (`Boton`, `HabitacionCard`, `Filtros`, `ListaHabitaciones`, `Navbar`, `Footer`) y separado en carpetas (`components`, `pages`, `data`, `context`). |
| RNF05 | Calidad | El proyecto debe tener pruebas unitarias con **cobertura mínima de 80%** en líneas, ramas, funciones y sentencias. |
| RNF06 | Rendimiento | Las búsquedas y filtros deben actualizar la lista inmediatamente al escribir (sin recargar la página). |
| RNF07 | Control de versiones | El código debe estar en un repositorio público de GitHub. |

---

## 5. Modelo de datos (BD simulada)

Archivo: `src/data/db.js` — clave de `localStorage`: `hotelsol_db`

| Colección | Campos |
|---|---|
| habitaciones | codigo, tipo, descripcion, capacidad, precio, estado (Disponible / Mantención / Fuera de servicio), oferta |
| servicios | codigo, nombre, precio |
| reservas | codigo, huesped, habitacion, checkIn, checkOut, estado (Reservado / Check-in / Hospedado / Check-out) |
| usuarios | nombre, correo, clave, rol (admin / cliente) |
| mensajes | nombre, correo, asunto, mensaje, fecha |

**Funciones principales:**

| Función | Qué hace |
|---|---|
| `cargarDB()` / `guardarDB()` / `reiniciarDB()` | Leer, guardar y restaurar los datos en localStorage. |
| `listarHabitaciones()`, `obtenerHabitacion()`, `crearHabitacion()`, `actualizarHabitacion()`, `eliminarHabitacion()` | CRUD de habitaciones. |
| `hayCruce()`, `estaDisponible()` | Revisan si las fechas se cruzan con una reserva activa (control de sobreventa). |
| `crearReserva()` | Crea la reserva solo si la habitación está disponible. |
| `registrarUsuario()`, `iniciarSesion()` | Registro e inicio de sesión. |
| `guardarMensaje()`, `listarMensajes()` | Mensajes del formulario de contacto. |
| `calcularNoches()` | Noches entre dos fechas. |

**Usuarios de prueba:**

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@hotelsol.cl | admin123 |
| Cliente | juan@correo.cl | juan123 |

---

## 6. Mapa de vistas

| Ruta | Vista | Tipo |
|---|---|---|
| `/` | Inicio | Tienda |
| `/habitaciones` | Listado con buscador y filtro | Tienda |
| `/habitaciones/:codigo` | Detalle de habitación | Tienda |
| `/ofertas` | Habitaciones en oferta | Tienda |
| `/reserva` | Mi reserva (carrito + servicios) | Tienda |
| `/checkout` | Datos del huésped | Tienda |
| `/reserva-exitosa` · `/reserva-error` | Resultado de la reserva | Tienda |
| `/nosotros` | Información del hotel | Tienda |
| `/contacto` | Formulario de contacto | Tienda |
| `/login` · `/registro` | Inicio de sesión y registro | Usuarios |
| `/admin` | Dashboard | Administración |
| `/admin/habitaciones` | CRUD de habitaciones | Administración |
| `/admin/reservas` | Listado de reservas | Administración |

---

## 7. Casos de uso principales

**CU01 — Reservar una habitación**
1. El huésped busca o filtra habitaciones y entra al detalle.
2. Ingresa fecha de llegada y salida y presiona *Agregar a mi reserva*.
3. El sistema valida las fechas y la disponibilidad (RF08, RF09).
4. El huésped agrega servicios opcionales y presiona *Continuar al pago*.
5. Completa sus datos y confirma.
6. El sistema crea la reserva y muestra el código.
*Flujo alternativo:* si la habitación ya está reservada en esas fechas, se muestra un mensaje de error y no se crea la reserva.

**CU02 — Registrarse e iniciar sesión**
1. El visitante completa el formulario de registro.
2. El sistema valida los datos y que el correo no exista.
3. El usuario queda conectado y su nombre aparece en el menú.

**CU03 — Administrar habitaciones**
1. El administrador inicia sesión y entra al panel.
2. Crea, edita o elimina habitaciones.
3. Los cambios se guardan en localStorage y se reflejan en la tienda.

---

## 8. Pruebas

Las pruebas unitarias se hicieron con **Vitest + React Testing Library**. El detalle de las pruebas y el análisis de cobertura está en el documento [`Cobertura_Testing.md`](Cobertura_Testing.md).
