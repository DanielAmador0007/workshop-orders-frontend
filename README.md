# Workshop Orders Frontend

Frontend React para el sistema de gestión de órdenes de trabajo de taller mecánico. Consume la API REST [workshop-orders-api](https://github.com/DanielAmador0007/workshop-orders-api).

## Tech Stack

- **React 18** con TypeScript estricto
- **Vite 5** — bundler ultrarrápido
- **Tailwind CSS 3** — estilos utility-first
- **React Router 6** — enrutamiento SPA con rutas protegidas
- **Axios** — cliente HTTP con interceptores JWT
- **React Hook Form + Zod** — formularios con validación declarativa
- **react-hot-toast** — notificaciones

## Funcionalidades

- **Autenticación** — Registro e inicio de sesión con JWT
- **Clientes (CRUD)** — Crear, listar, editar y eliminar clientes
- **Vehículos (CRUD)** — Gestión de vehículos asociados a clientes
- **Órdenes de trabajo (CRUD + flujo)** — Crear órdenes, editar, eliminar y avanzar el estado:
  `RECEIVED → IN_PROGRESS → COMPLETED → DELIVERED`
- **Filtros** — Filtrar órdenes por estado
- **Paginación** — Todas las listas con paginación

## Requisitos

- Node.js 18+
- Backend corriendo en `http://localhost:3000` (o configurar `VITE_API_URL`)

## Instalación

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

Abre http://localhost:5173

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `VITE_API_URL` | URL base del backend API | `http://localhost:3000` |

## Build de producción

```bash
npm run build
npm run preview
```

## Estructura del proyecto

```
src/
├── api/           # Servicios HTTP (Axios)
├── components/
│   ├── layout/    # AppLayout, ProtectedRoute
│   └── ui/        # Button, Input, Modal, Select, etc.
├── contexts/      # AuthContext (JWT + estado global)
├── hooks/         # usePaginated (paginación genérica)
├── pages/
│   ├── auth/      # Login, Register
│   ├── customers/ # CRUD clientes
│   ├── vehicles/  # CRUD vehículos
│   └── work-orders/ # CRUD + flujo de estados
├── types/         # Interfaces TypeScript
├── App.tsx        # Router principal
└── main.tsx       # Entry point
```

## Deploy

Desplegado en **Railway** con la variable `VITE_API_URL` apuntando al backend en producción.
