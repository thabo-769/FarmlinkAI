# FarmLink AI: Project Guide

This guide documents the repository as it exists today: its user interface, runtime behavior, API, data model, configuration, deployment shape, and known gaps. It distinguishes implemented code from intended infrastructure because those are not currently aligned in every area.

## 1. What the project is

FarmLink AI is a Zimbabwe-focused agricultural marketplace and farm information web application. Its user interface is a React single-page application. An Express API exposes marketplace, task, AI, weather, market-price, report, and admin routes. A Supabase SQL migration describes a relational production data model and access policies.

The current runtime is partly a prototype: most API routes use an in-memory store, authentication contains development/demo behavior, and several screens show static figures or examples. The presence of a Supabase migration does not mean the API is currently reading and writing those tables.

## 2. Repository layout

```text
Farmlink--main/
├── api/index.ts                 Vercel serverless entry point for Express
├── client/                      React/Vite browser application
│   ├── src/App.tsx              Client routes
│   ├── src/pages/               Home, marketplace, workspace and tool screens
│   ├── src/components.tsx       Shared layout and UI components
│   ├── src/context/             Authentication/session context
│   ├── src/services/            API and Firebase clients
│   ├── src/data.ts              Local sample catalog and price data
│   ├── src/styles.css           Global styles
│   └── *.config.*               Vite, TypeScript and Tailwind configuration
├── server/                      Express API (TypeScript, ESM)
│   └── src/
│       ├── index.ts             Middleware, route mounts and health checks
│       ├── config.ts            Server environment configuration
│       ├── routes/              Endpoint implementations
│       ├── middleware/          Authentication, validation and errors
│       ├── validators/          Zod request schemas
│       ├── services/            AI provider integration
│       └── db/                  Firebase Admin setup and in-memory data store
├── supabase/
│   ├── migrations/              PostgreSQL schema, triggers, RLS and Storage rules
│   └── seed.sql                 Explicit note that fabricated market data is not seeded
├── .env.example                Root-level example values
├── package.json                npm workspaces and root commands
├── vercel.json                 Combined deployment routing/build configuration
└── README.md                   Quick start and readiness summary
```

There are also `client/vercel.json`, nested Vite configuration files, and historical lockfile backups. `node_modules/` and build output are generated artifacts and should not be edited by hand.

## 3. Technology and request flow

- **Client:** React 18, TypeScript, Vite, React Router, Tailwind/PostCSS configuration, Lucide icons, Recharts, React Hook Form, and Zod dependencies.
- **API:** Node.js, Express, TypeScript, Zod validation, Helmet, CORS, `express-rate-limit`, Multer image upload parsing, Firebase Admin token verification, and a provider-compatible AI client implemented with `fetch`.
- **Database definition:** PostgreSQL/Supabase migration with row-level security policies, triggers, and a Storage bucket policy.
- **Authentication UI:** Firebase client SDK for configured Firebase sessions, with demo sign-in when Firebase is not configured.

The intended flow is browser page → `/api/v1` endpoint → middleware → service/data provider. In the checked-in runtime, most endpoints instead read or mutate `server/src/db/store.ts`, which is process-local memory. The Supabase schema is not wired into that store. Firebase Auth is present, but the server's mock fallback and missing credential configuration mean it must not be treated as production-secure by default.

## 4. Install and run locally

Requirements: Node.js 20 or newer and npm.

1. From this directory, install dependencies: `npm install`.
2. Copy `client/.env.example` to `client/.env.local` and `server/.env.example` to `server/.env`.
3. Set `VITE_API_URL` for the browser. For local development it should be `http://localhost:4000/api/v1`.
4. Set `VITE_FIREBASE_*` values only if using a real Firebase project. Without them, the client enables demo sign-in.
5. Set server-side `FIREBASE_PROJECT_ID` and credentials suitable for Firebase Admin if verifying real Firebase ID tokens. The current Admin initialization specifies a project ID but does not load a service-account key explicitly; deployment must provide supported Google application credentials.
6. Configure `AI_PROVIDER=openai-compatible`, a vision-capable `AI_MODEL` (for example `gpt-4o-mini`), and `AI_API_KEY` on the server for crop-image analysis and assistant responses. On Vercel, add these as project environment variables and redeploy. Set `WEATHER_API_KEY` for weather. Provider keys belong only on the server.
7. Run `npm run dev`. The Vite client uses port 5173 and Express uses port 4000 by default.

Useful root scripts:

| Command | Effect |
| --- | --- |
| `npm run dev` | Starts client and API concurrently |
| `npm run build` | Builds client, then compiles server TypeScript |
| `npm run lint` | Runs client and server ESLint configurations |

The API health endpoint is available at `/health` and `/api/v1/health`.

## 5. Configuration reference

### Browser variables (`client/.env.local`)

| Name | Purpose |
| --- | --- |
| `VITE_API_URL` | API base URL including the version prefix, e.g. `http://localhost:4000/api/v1` |
| `VITE_FIREBASE_API_KEY` | Firebase web API key; used to decide whether real Firebase auth is configured |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket setting |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase web app ID |

Vite exposes every `VITE_` value to users' browsers. Never place a private credential or provider secret in these variables.

### Server variables (`server/.env`)

| Name | Purpose |
| --- | --- |
| `PORT` | Local Express port; defaults to `4000` |
| `CLIENT_URL` | Client origin(s) used by CORS configuration; defaults to `http://localhost:5173` |
| `FIREBASE_PROJECT_ID` | Firebase Admin project ID; defaults to `farmlink-ai` |
| `AI_PROVIDER` | Enables the configured compatible AI provider path |
| `AI_MODEL` | Model name sent to the AI provider |
| `AI_API_KEY` | Server-side AI key |
| `WEATHER_API_KEY` | OpenWeather API key used by the weather route |

The Supabase keys shown in example env files are not currently consumed by the API implementation. They should not be mistaken for evidence of an active Supabase connection.

## 6. Browser pages and routes

`client/src/App.tsx` declares these routes. All routes except home, login, and registration pass through `ProtectedRoute` and the shared `AppShell`.

| Path | Screen | Current scope |
| --- | --- | --- |
| `/` | Public home | Product introduction and sample marketplace highlights |
| `/login`, `/register` | Auth page | Email/password and Google UI; real Firebase only when configured, otherwise demo behavior is available |
| `/dashboard` | Dashboard | Workspace overview; prominent figures/content are preview data |
| `/marketplace` | Marketplace | Loads API catalog when available and combines it with local examples |
| `/product/:id` | Product detail | Product detail view within the protected app |
| `/products` | My products | Seller listings screen; inspect before assuming all actions are connected |
| `/listing/new` | Listing form | Sends product details to `POST /products`; selected image files are not included in that request |
| `/farm-tools` | Farm tools | Tabbed weather, crop health, and assistant experience |
| `/crop-health` | Crop health | Image upload/capture and AI assessment endpoint |
| `/assistant` | AI assistant | Sends chat to API; conversation list persistence is not implemented |
| `/weather` | Weather | Weather screen; API route exists but page integration should be verified |
| `/tasks` | Tasks | Task screen; API supports in-memory CRUD |
| `/prices` | Prices | Price screen; API data is currently a static in-code dataset |
| `/profile` | Profile | Profile UI; profile updates are local-first and attempt API sync |
| `/settings` | Settings | Account update, local notification preferences, and demo security interaction |
| `/admin` | Admin | Screen shows fixed preview metrics; it is not a full admin console |

Unknown paths render the public home screen rather than a not-found page.

Shared layout, navigation, product cards, fields, metrics, task rows, and empty states live in `client/src/components.tsx`. Global visual rules are in `client/src/styles.css`; Tailwind configuration is in `client/tailwind.config.js`.

## 7. API reference

The Express router is mounted under `/api/v1`; the server also accepts `/api`, `/v1`, and direct paths for compatibility. JSON requests are limited to 1 MB. A global limiter allows 120 requests per minute per IP, and AI routes apply a further 30-per-minute limiter. JSON errors are returned through centralized error middleware.

| Method and path | Access in code | Behavior and caveats |
| --- | --- | --- |
| `GET /health` | Public | Health response `{ status: "ok", service: "farmlink-api" }` |
| `POST /auth/register` | Public | Adds a profile to in-memory map; does not create Firebase credentials |
| `POST /auth/login` | Public | Returns `{ status: "ok" }`; does not authenticate credentials |
| `GET /auth/profile` | Auth middleware | Reads/creates an in-memory profile |
| `PATCH /auth/profile` | Auth middleware | Updates in-memory profile fields |
| `GET /products` | Public | Active in-memory product list; supports `page`, `limit`, `category`, and `search` |
| `GET /products/:id` | Public | Finds in-memory product by ID |
| `GET /products/mine` | Auth middleware | Filters memory catalog by seller ID |
| `POST /products` | Farmer/supplier role check + validation | Creates an active in-memory listing |
| `PATCH /products/:id` | Auth middleware | Updates an owned in-memory listing; body is not schema-validated here |
| `DELETE /products/:id` | Auth middleware | Removes an owned in-memory listing |
| `POST /ai/chat` | Auth middleware + validation + rate limit | Calls configured provider or reports unavailable; returns an ID and answer |
| `GET /ai/conversations` | Auth middleware | Currently always returns an empty list |
| `POST /disease/analyze` | Auth middleware | Multer accepts one `image` up to 5 MB; validates JPEG/PNG/WebP header and requests model assessment |
| `GET /tasks` | Auth middleware | Reads caller's in-memory tasks |
| `POST /tasks` | Auth middleware + validation | Adds caller's in-memory task |
| `PATCH /tasks/:id` | Auth middleware | Updates caller's in-memory task |
| `DELETE /tasks/:id` | Auth middleware | Deletes caller's in-memory task |
| `GET /prices` | Public | Filters static `pricesData.ts` entries using `q`/`crop`, `category`, and `market` |
| `POST /prices` | Not implemented | README describes admin price entry, but route currently only implements GET |
| `POST /reports` | Auth middleware | Returns an acknowledgement; does not persist report |
| `GET /reports/mine` | Auth middleware | Currently returns an empty list |
| `GET /weather?location=Harare` | Public | Calls configured weather provider; unavailable if key missing/provider fails |
| `GET /admin/summary` | Admin role middleware | Reports counts based on in-memory maps/arrays only |
| Admin report/product moderation routes | Not implemented | README lists these, but current `admin.ts` only provides summary |

Request schemas are defined in `server/src/validators/schemas.ts`; validation middleware returns field-level errors. Authentication/role checks are in `server/src/middleware/auth.ts`. Current auth middleware has a mock identity path when no Bearer token is present and also falls back to a synthetic user when Firebase token verification fails. This is development-only behavior and a production security blocker until replaced.

## 8. Runtime data and persistence

`server/src/db/store.ts` is the data source used by current API routes. It contains process-local Maps/arrays for profiles, products, tasks and related records. Writes disappear when the server restarts and are not shared between serverless instances. Product and price examples are not verified market records.

`client/src/data.ts` supplies demonstration product cards and market price strings. The marketplace initially renders this client catalog, attempts an API request, and merges returned server items with non-duplicate demo items. The public home also contains local examples. Treat these as illustrative content, not offers or current prices.

`supabase/migrations/202610290001_initial_schema.sql` defines a proposed/available database schema, but the API does not call Supabase. Before relying on it, confirm the migration can be applied cleanly to the target project, configure Auth and storage, and replace the in-memory repositories with database operations.

## 9. Database model defined by the Supabase migration

The migration creates enums `app_role` (`farmer`, `buyer`, `supplier`, `admin`), `listing_status` (`active`, `pending`, `sold`, `removed`), `task_priority`, and `report_status`. It defines:

| Table | Purpose |
| --- | --- |
| `profiles` | User details linked to `auth.users`; role is protected by trigger/policy |
| `products` | Seller listings, price/currency, quantity, location, status and timestamps |
| `product_images` | Listing image metadata and storage paths |
| `farming_tasks` | User-owned task schedule and completion state |
| `ai_conversations`, `ai_messages` | User-owned assistant conversation history |
| `market_prices` | Sourced price observations with currency, market, date and verification flag |
| `notifications` | User-owned notification records/read state |
| `reports` | User-submitted reports and moderator status/notes |

Indexes support product status/seller/category, task due dates, conversation/message chronology, price lookups, notifications and report queues. Triggers update timestamps, touch conversation timestamps after messages, create profiles after new Auth users, block user role escalation, and block non-admin listing activation. RLS policies scope private data to the owning user and reserve moderation and price management for admins. The `product-images` bucket allows JPEG/PNG/WebP up to 5 MiB; Storage rules allow public reads and restrict writes to a user's own folder.

Important deployment note: creating a migration file does not run it. Apply it explicitly to a Supabase project before depending on these policies or tables.

## 10. External integrations

### Firebase Authentication

The browser initializes Firebase from `VITE_FIREBASE_*`. The auth context observes token changes and stores the Firebase ID token in local storage as `farmlink-token`. When Firebase is not configured, Google sign-in creates a local demo user. The server attempts Firebase Admin ID token verification. Account creation and password login form behavior should be checked against Firebase; the API's `/auth/register` and `/auth/login` are placeholders, not credential providers.

### AI provider

`server/src/services/ai.ts` sends a provider-compatible request using `AI_PROVIDER`, `AI_MODEL`, and `AI_API_KEY`. Chat is text based. Disease analysis sends the uploaded image and symptom notes to the configured vision-capable model and returns its preliminary assessment. If the provider is not configured or fails, the API reports an error instead of returning generic advice as if the image had been analyzed. The result is not a confirmed diagnosis; serious crop issues should be reviewed by an extension officer.

### Weather provider

`server/src/routes/weather.ts` queries OpenWeather when `WEATHER_API_KEY` exists and accepts a location query. The route's existence does not imply the React weather screen consumes it or that forecasts have Zimbabwe-specific agronomic interpretation.

### Supabase Storage

Image bucket and policies exist in SQL, but the listing form's file picker currently only checks size in the browser. It does not upload files or attach image paths to the listing request.

## 11. Security and operational notes

- Keep AI/weather/Firebase Admin secrets on the server secret store. Browser `VITE_` variables are public.
- The current API authentication fallback accepts requests without a Bearer token as a default farmer and accepts invalid-token requests as a synthetic farmer. Do not expose this behavior as production authentication.
- The current CORS callback returns `true` for origins not explicitly listed despite its allowlist checks. Restrict this before production.
- The in-memory store is not durable and serverless deployments can return inconsistent state across invocations.
- Review report ownership, role handling, admin authorization, schema validation, and database RLS together when integrating persistence.
- Do not publish live market prices without source, market, currency, and observation date. The Supabase model captures these fields; the current UI/API examples do not establish freshness or verification.
- AI output can be wrong. Retain user-facing uncertainty and escalation guidance for crop and livestock health.
- No payment, order fulfillment, delivery, messaging between buyers and sellers, email/SMS notifications, or complete moderation workflow is implemented.

## 12. Deployment shape

The root `vercel.json` requests a build using root scripts, routes `/api/*` to the serverless entry at `api/index.ts`, and sends other paths to the client SPA. `api/index.ts` exports the Express app; `server/src/index.ts` skips `listen()` when `VERCEL` is set. The client has its own Vercel config as well, so choose one deployment layout and configure it consistently rather than combining both without review.

For separate client/API hosting, set the client build variable `VITE_API_URL` to the public API base, and set `CLIENT_URL` on the API host. Add Firebase authorized domains and sign-in redirect origins as needed. Configure provider keys in the backend secret manager. Provision persistent storage and apply the migration before migrating API data access. Verify health, auth, RLS, upload, provider failure, and client deep-link behavior in the deployed environment.

## 13. Known gaps and implementation status

The README describes the intended architecture, but code review of the current source shows these concrete gaps:

1. API data is in memory; Supabase is not connected.
2. Auth includes demo/fallback paths; `/auth/login` is a no-op and `/auth/register` only creates a memory profile.
3. API conversation history is not stored; `GET /ai/conversations` is empty.
4. Reports are acknowledged but not saved; report listing is empty.
5. Admin summary is present, but moderation endpoints/UI are absent and screen metrics are fixed preview values.
6. `/prices` serves a static in-code array; POST price management is absent.
7. Listing image input is not uploaded; edit/delete UI workflows are incomplete.
8. Weather route exists, but weather page integration/context needs completion.
9. Dashboard/tasks/admin contain preview/static content in places, despite task endpoints existing.
10. Settings security form simulates a password change; notification choices are browser-local only.
11. Automated test suites are not included in the package scripts.
12. `supabase/seed.sql` intentionally contains no market price seed data.

Use the app as a prototype until these are addressed and deployment-specific security and data validation are complete.

## 14. Maintenance map

- Add or change a browser route in `client/src/App.tsx`.
- Add or change UI screens under `client/src/pages/`; shared components are in `client/src/components.tsx`.
- Change API base URL and request helpers in `client/src/services/api.ts`.
- Change Firebase setup/session behavior in `client/src/services/firebase.ts` and `client/src/context/AuthContext.tsx`.
- Add server endpoints under `server/src/routes/`, mount them in `server/src/index.ts`, and update validators in `server/src/validators/schemas.ts`.
- Change error response behavior in `server/src/middleware/errors.ts` and access behavior in `server/src/middleware/auth.ts`.
- Change AI behavior in `server/src/services/ai.ts` and weather provider mapping in `server/src/routes/weather.ts`.
- Change local demo data in `client/src/data.ts`, `server/src/db/store.ts`, and `server/src/routes/pricesData.ts` as appropriate; clearly label examples.
- Add database changes as new ordered migrations under `supabase/migrations/`; avoid silently editing an already-applied migration in shared environments.

## 15. Suggested onboarding sequence

1. Read `README.md`, this guide, and the workspace/package scripts.
2. Trace a screen from `client/src/App.tsx` to its page and API helper.
3. Trace the matching API route, middleware, and current data source.
4. Compare API behavior with the Supabase schema before implementing persistence.
5. Decide whether the task is prototype-only or production-bound, then label/demo-gate behavior accordingly.
6. For changes, run the relevant build/lint commands and manually verify changed flows in a configured environment.
