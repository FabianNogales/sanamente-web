# sanamente-web

Frontend web independiente de SanaMente (Next.js).

## Variables de entorno

Crea `.env.local` usando `.env.example`:

- `NEXT_PUBLIC_API_URL`: URL base del backend NestJS.
- `NEXT_PUBLIC_APP_URL`: URL publica del sitio web.
- `NEXT_PUBLIC_MOBILE_APP_URL`: URL de descarga/apertura de la app movil.

## Scripts

- `npm run dev`: desarrollo local.
- `npm run build`: build de produccion.
- `npm run start`: sirve el build.
- `npm run lint`: linting.

## Rutas admin web (Fase 2)

- `/`: landing publica.
- `/login`: login web para acceso administrativo.
- `/admin/login`: login especifico de admin.
- `/admin` y `/admin/overview`: dashboard.
- `/admin/users`
- `/admin/professionals`
- `/admin/professionals/[id]`
- `/admin/referrals`
- `/admin/finance`
- `/admin/packages`
- `/admin/sections`
- `/admin/config`
- `/admin/reports`

Nota: el admin antiguo en `front` no se elimino en esta fase; la limpieza queda para Fase 3.
