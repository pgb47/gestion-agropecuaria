# Gestion Agro — Despliegue con Docker Compose

## Requisitos
- Docker con Docker Compose instalado

## Estructura
```
gestion-agro/
├── dist/               ← build de produccion (client + server)
├── Dockerfile          ← imagen Node para la app SSR
├── docker-compose.yml  ← orquesta app Node + nginx
├── nginx.conf          ← configuracion nginx
└── package.json
```

## Levantar el sistema (un solo comando)

```bash
docker compose up -d --build
```

Abrir en el navegador: http://localhost:8080

## Verificar que esta corriendo

```bash
docker compose ps
```

Deberia mostrar dos contenedores en estado "running": rodeoapp y nginx.

## Ver logs

```bash
# Logs de la app Node
docker compose logs app

# Logs de nginx
docker compose logs nginx

# Todos los logs en tiempo real
docker compose logs -f
```

## Detener

```bash
docker compose down
```

## Actualizar el build (si el E3 manda una nueva version)

```bash
# 1. Reemplazar la carpeta dist/ con la nueva
# 2. Reconstruir y reiniciar
docker compose down
docker compose up -d --build
```
