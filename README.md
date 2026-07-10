# Eduplain Frontend

Frontend React + TypeScript + Vite para Eduplain. El primer módulo disponible es **Syllabus Lab**: sube un PDF y consume la API Django para convertirlo a Markdown.

## Requisitos

- [Bun](https://bun.sh/) 1.3+
- Backend [`EduPlain_Backend`](https://github.com/ElkinDelgado25/EduPlain_Backend) en ejecución local

## Inicio rápido

### 1. Backend (Aspire)

Desde el repo backend:

```powershell
docker compose down
dotnet build .\aspire\Eduplain.AppHost\Eduplain.AppHost.csproj
aspire run --apphost .\aspire\Eduplain.AppHost
```

Django queda en `http://localhost:8000`.

### 2. Frontend

```powershell
Copy-Item .env.example .env
bun install
bun dev
```

Vite abre `http://localhost:5173` y proxifica `/api` hacia `http://localhost:8000`.

## Rutas

| Ruta | Página |
|---|---|
| `/` | Landing Page con CTA hacia la app |
| `/syllabus-lab` | Syllabus Lab (Home): conversor PDF → Markdown |

## Variables de entorno

| Variable | Uso |
|---|---|
| `VITE_API_BASE_URL` | URL base del backend. Déjela vacía en dev para usar el proxy de Vite. |
| `VITE_API_BASIC_USERNAME` | Usuario Django para endpoints protegidos (opcional para Syllabus Lab). |
| `VITE_API_BASIC_PASSWORD` | Contraseña del usuario bootstrap local (opcional para Syllabus Lab). |

Use las mismas credenciales que `EDUPLAIN_BOOTSTRAP_ADMIN_*` en el backend cuando consuma endpoints protegidos. Syllabus Lab no las requiere.

**Importante:** no incluya credenciales reales en builds de producción. OAuth llegará en una fase posterior.

## Verificación

1. Abra `http://localhost:5173/` y confirme la Landing Page con el botón **Entrar a Syllabus Lab**.
2. En `/syllabus-lab`, el encabezado muestra **Backend: Conectado** si `GET /api/health/` responde.
3. Suba un PDF de prueba y confirme que aparece el Markdown generado.
4. Si un endpoint protegido devuelve error de autenticación, revise `VITE_API_BASIC_*` en `.env`.

## Scripts

```powershell
bun dev       # servidor de desarrollo
bun run build # build de producción
bun run lint  # ESLint
```

## API compartida

- `src/api/client.ts` — cliente HTTP con auth básica opcional
- `src/api/health.ts` — health check público
- `src/api/documents.ts` — conversión PDF → Markdown

Extienda `src/api/` para nuevas pantallas sin reconfigurar la conexión.

## Documentación backend

- [docs/api.md](https://github.com/ElkinDelgado25/EduPlain_Backend/blob/main/docs/api.md) — CORS, auth y flujo local
- [docs/endpoints.md](https://github.com/ElkinDelgado25/EduPlain_Backend/blob/main/docs/endpoints.md) — contrato HTTP
