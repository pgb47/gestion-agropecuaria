# Gestión Agropecuaria — RodeoApp

Aplicación web de gestión agropecuaria desarrollada como trabajo práctico universitario.
El sistema combina un frontend SSR (TanStack Start + Vite), una capa de automatización
de procesos con **n8n** y un **nginx** que actúa como reverse proxy (sirve la app y
resuelve CORS contra los webhooks de n8n).

## Estructura del repositorio

```
gestion-agropecuaria/
├── frontend/              ← App web (TanStack Start + React + Vite + Tailwind)
├── n8n/
│   └── workflows/         ← Workflows de n8n exportados en JSON
├── nginx/
│   └── gestion-agro.conf  ← Configuración del reverse proxy
└── README.md
```

## Componentes

### Frontend (`frontend/`)
Single Page App con renderizado en servidor construida con TanStack Start, React,
Vite, TypeScript y Tailwind. La URL del backend se configura por variable de entorno
(`VITE_API_BASE`) apuntando al webhook de n8n.

Comandos principales (desde `frontend/`):

```bash
npm install      # o: bun install
npm run dev      # entorno de desarrollo
npm run build    # build de producción
npm run preview  # previsualizar el build
```

### Automatización (`n8n/workflows/`)
Workflows de n8n que implementan la lógica de negocio y exponen los endpoints
(webhooks) que consume el frontend. Los archivos JSON se importan desde la interfaz
de n8n (**Workflows → Import from File**).

### Reverse proxy (`nginx/gestion-agro.conf`)
Configuración de nginx que:
- Sirve los assets estáticos del cliente.
- Hace proxy de `/webhook/` hacia la instancia de n8n (resolviendo CORS).
- Envía el resto del tráfico a la app Node (SSR + fallback SPA).

## Despliegue con Docker Compose

> El build de producción y el `docker-compose.yml` se gestionan en el paquete de
> despliegue del equipo. Pasos de referencia:

```bash
docker compose up -d --build      # levantar el sistema
docker compose ps                 # verificar contenedores en estado "running"
docker compose logs -f            # ver logs en tiempo real
docker compose down               # detener
```

Una vez levantado, abrir en el navegador: http://localhost:8080

## Equipos

- **Frontend (RodeoApp):** app web de gestión.
- **Equipo 2 (n8n):** workflows de automatización (JSON pendientes de importar en `n8n/workflows/`).
- **Despliegue:** configuración de nginx y orquestación con Docker Compose.
