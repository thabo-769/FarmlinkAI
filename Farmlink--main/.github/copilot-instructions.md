# Copilot instructions for FarmLink AI

## Project overview

FarmLink AI is a full-stack agricultural marketplace and workspace app with:

- A React + Vite client in `client/` for public browsing and authenticated workspace pages
- An Express API in `server/` for auth, marketplace data, AI chat, crop analysis, tasks, weather, reports, and admin endpoints
- Supabase/PostgreSQL schema and RLS policies in `supabase/` for persistent data and storage

The request flow is `React page -> versioned API route -> auth/validation middleware -> service -> Supabase or external provider`. The client is intentionally thin and relies on the API for data access and business logic.

## Build, lint, and validation commands

Run these from the repository root (`Farmlink--main/`):

- Install dependencies: `npm install`
- Start the full app in dev mode: `npm run dev`
- Start only the client: `npm run dev --workspace client`
- Start only the API: `npm run dev --workspace server`
- Build the client: `npm run build --workspace client`
- Build the API: `npm run build --workspace server`
- Build the full project: `npm run build`
- Lint the client: `npm run lint --workspace client`
- Lint the API: `npm run lint --workspace server`
- Lint the whole repo: `npm run lint`

There is no automated test suite configured in the project at the moment. Validation is currently done through TypeScript builds and ESLint, not via a dedicated test runner. If you add tests later, keep them scoped to the relevant feature and run them directly rather than the whole suite.

## Architecture and code layout

### Client (`client/`)

The client uses React, TypeScript, Vite, Tailwind, and React Router. Route-level screens live under `client/src/pages/`, shared UI components live under `client/src/components/`, and app-wide auth/session state is handled in `client/src/context/`.

Key patterns:

- `App.tsx` defines the route tree and wraps protected pages in `ProtectedRoute` and `AppShell`
- Public pages are separate from authenticated workspace routes
- Feature modules stay page-oriented rather than being split into many micro-layers
- Service calls are centralized under `client/src/services/`

### API (`server/`)

The server is an Express app with versioned API routes in `server/src/routes/` and shared middleware in `server/src/middleware/`.

Key patterns:

- `src/index.ts` builds the Express app, applies CORS/helmet/rate limiting, mounts the API router, and defines the global error handling
- Route modules are grouped by feature (`auth`, `products`, `ai`, `disease`, `tasks`, `weather`, `reports`, `admin`)
- Validation and normalization are handled with Zod and route-level middleware
- Secret or environment-sensitive configuration lives in `server/src/config.ts`

### Data layer (`supabase/`)

Database setup is handled through SQL migrations in `supabase/migrations/` and the initial schema in `supabase/seed.sql`.

The project expects Supabase to enforce RLS and ownership rules. The app keeps the public anon key on the client, while the server uses the user's access token and Supabase auth context so RLS remains active. There is no service-role key in the normal app flow.

## Environment and config conventions

Follow the repository conventions in `README.md`:

- Copy `client/.env.example` to `client/.env.local` for client-side environment values
- Copy `server/.env.example` to `server/.env` for server-side secrets
- Keep AI and weather keys server-side; do not expose them with `VITE_` prefixed variables
- Use `VITE_API_URL` only for the client build when needed, not for secrets
- Keep `CLIENT_URL` and callback settings aligned with the deployed frontend origin

Do not assume the app is production-ready without setting up external credentials and migration data.

## Conventions specific to this repo

- The app is organized around user journeys, not generic reusable domain layers. Pages and routes are the primary unit of organization.
- Protected routes are not inferred from the URL alone; they use `ProtectedRoute` and the auth context.
- Demo/sample data is intentionally labeled as such. Do not treat marketplace or dashboard data as verified production data unless it is backed by actual Supabase rows or sourced market records.
- Product, weather, prices, and AI features are expected to degrade gracefully when optional integrations are absent; many screens explicitly show unavailable states.
- Price entries must carry source, currency, market, and observation date before being treated as operational data.
- Model or weather output should be treated as guidance, not absolute truth; crop-health and forecasting features are optional integrations.

## Editing guidance

When working here:

- Prefer adjusting existing route/service patterns rather than creating a parallel architecture
- Preserve the split between client code and server code; keep business logic and provider access on the server
- Match the current feature organization under `client/src/pages/` and `server/src/routes/`
- Keep configuration values in the existing `.env.example` / `config.ts` pattern instead of hard-coding secrets
- If a feature depends on a provider (AI, weather, Supabase), check the README and server config before assuming it is optional or fully available

## Local setup and deployment notes

The README identifies the current project state as a deployable foundation rather than a fully finished production capstone. Before claiming readiness, check that the external Supabase credentials, migration setup, provider keys, and deployed origins are all configured.

The default development URLs are:

- Client: `http://localhost:5173`
- API health check: `http://localhost:4000/health`

## MCP servers

If the project needs browser automation or workflow tooling for front-end validation, consider MCP servers such as Playwright for web app testing. Add only the project-specific servers that clearly match this repository's workflow.
