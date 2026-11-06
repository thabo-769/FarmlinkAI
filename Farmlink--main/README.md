# FarmLink AI

For the full repository map, configuration reference, page/API inventory, data model, integrations, deployment notes, and known implementation gaps, see [the Project Guide](docs/PROJECT_GUIDE.md).

FarmLink AI is a responsive agricultural marketplace and information platform for Zimbabwe. The repository is organised as a React/Vite client, a versioned Express API, and Supabase migrations for PostgreSQL, authentication, and Storage.

## Architecture

- **Client (`client/`)** — React, TypeScript, Vite, Tailwind, React Router, React Hook Form dependencies, Zod, Lucide and Recharts. Screens are separated into public discovery and workspace flows; common cards, navigation, forms and status notices are reusable components.
- **API (`server/`)** — Express routes under `/api/v1`, centralized validation/error handling, Helmet, CORS, request limits, Supabase token verification and role authorization. AI and weather provider calls remain on the server.
- **Data (`supabase/`)** — relational migrations with indexes, foreign keys, ownership policies, role checks, public active listings, private user records, sourced market prices and a private-to-user conversation history. Storage policies limit product uploads to the owner's folder.

The request flow is **React page → versioned API route → authentication/validation middleware → service → Supabase or configured provider**. The client uses the public Supabase anon key only; the server uses it with the user's access token so database RLS remains active. There is no service-role key in this project.

## Included user journeys

- Public homepage and marketplace browsing with product details.
- Account creation and sign-in through Supabase Auth.
- Workspace dashboard, farming task view, profile, listing form and role-gated admin API.
- AI chat with conversation persistence and server-side provider call.
- Weather endpoint, market-price records with provenance requirements, and admin moderation endpoints.
- Responsive layouts with keyboard focus, mobile navigation, empty/error/availability messages, and reduced-motion support.

The visible catalog and workspace figures are **demonstration content**. They are not loaded as verified listings or current data. No example market-price records are seeded. Weather and AI pages state when their integrations are unavailable. No payments or delivery are represented as supported.

## Local setup

Requirements: Node.js 20+, npm, and a Supabase project. From the repository root:

1. Copy `client/.env.example` to `client/.env.local` and `server/.env.example` to `server/.env`. Fill in the Supabase URL and public anon key on the server. Keep the AI and weather keys server-side; never put them in a `VITE_` variable.
2. Apply `supabase/migrations/202610290001_initial_schema.sql` using the Supabase SQL editor or Supabase CLI. The migration creates tables, indexes, RLS policies, role protection, and a `product-images` bucket.
3. Install dependencies with `npm install`.
4. Start both processes with `npm run dev`. The client is at `http://localhost:5173`; the API health check is `http://localhost:4000/health`.
5. Add `AI_API_KEY` to the server environment for crop-image analysis and text guidance. The provider defaults to `openai-compatible` and the model defaults to `gpt-4o-mini`; override these with `AI_PROVIDER` or `AI_MODEL` only if needed. On Vercel, add `AI_API_KEY` under Project Settings > Environment Variables and redeploy. Keep the key private and server-side. Configure `WEATHER_API_KEY` for OpenWeather forecast access.

For deployments, host the client and API separately, set `CLIENT_URL` to the deployed client origin, set `VITE_API_URL` at client build time to the API base URL, and set server environment variables in the backend host's secret store. Set up Supabase email confirmation and redirect URLs to match the deployed client.

## API outline

- `POST /api/v1/auth/register`, `POST /api/v1/auth/login`
- `GET /api/v1/products`, `GET /api/v1/products/:id`, authenticated `GET /api/v1/products/mine`, `POST/PATCH/DELETE /api/v1/products`
- Authenticated `POST /api/v1/ai/chat`, `GET /api/v1/ai/conversations[/:id]`
- Authenticated `POST /api/v1/disease/analyze` (JPEG, PNG or WebP up to 5 MB)
- Authenticated `POST /api/v1/reports`, `GET /api/v1/reports/mine`
- Authenticated `GET/POST/PATCH/DELETE /api/v1/tasks`
- `GET /api/v1/weather?location=Harare`
- `GET /api/v1/prices`; admin-only `POST /api/v1/prices`
- Admin-only `GET /api/v1/admin/summary`, `GET /api/v1/admin/reports`, `PATCH /api/v1/admin/reports/:id`, `GET /api/v1/admin/products`, `PATCH /api/v1/admin/products/:id/status`

Responses use JSON. Request validation returns 400 with field details; auth and role checks return 401/403; absent external integrations return 503. AI requests are rate limited.

## Readiness and known gaps

This repository establishes the architecture and deployable foundation, but it is **not yet a complete production capstone**. Supabase credentials, migrations, mail settings, provider keys, and deployment accounts are external setup. Marketplace browsing reads from the API when configured and falls back to clearly labelled sample listings; product creation submits to the API, but edit/delete screens and the image upload connection still need completion. Dashboard, task, and admin page content remains preview-only even though protected task and admin APIs are present. Crop-health image analysis uploads JPEG, PNG, or WebP images to the server and requires `AI_PROVIDER=openai-compatible`, a vision-capable `AI_MODEL` (for example `gpt-4o-mini`), and `AI_API_KEY`; without these settings, the page reports that analysis is unavailable rather than presenting generic text as an image diagnosis. Password recovery/profile editing, notification delivery, reporting UI, full admin tables/charts, automated tests, and production deployment are not implemented. A weather API route returns provider forecasts when configured, but the weather page still needs to load that data and translate it into Zimbabwe-specific agronomic context. Configure and verify these items before presenting the system as production-ready.

Do not enter live prices unless they have a source, currency, market, and observation date. Treat model output and weather-derived suggestions as guidance with uncertainty, and refer serious disease or livestock cases to an extension officer or veterinarian.
