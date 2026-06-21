# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A production-ready direct-to-consumer (DTC) ecommerce monorepo: a **Medusa v2** commerce backend (`apps/backend`) and a **Next.js 15** storefront (`apps/storefront`). Built on the Medusa DTC Starter, customized for the *One Stop Liquidation* brand. Many code comments and env docs are in Portuguese.

## Monorepo & Tooling

- **Yarn Berry 4.17** (via Corepack) with `nodeLinker: node-modules` (`.yarnrc.yml`), **Turborepo** for task orchestration. Workspaces glob is `apps/**` and excludes `apps/backend/.medusa/**` (the built backend output).
- Root `package.json` pins `ajv: ^8` via `resolutions` — this breaks ESLint (see Linting below).
- Node: backend `>=20`, storefront `24.x`. Dev runs backend on `:9000` (admin at `/app`) and storefront on `:8000`.

## Common Commands

Run from the repo root unless noted.

```bash
yarn install                      # install (Corepack-managed Yarn 4)
yarn dev                          # turbo dev — backend + storefront together
yarn build                        # turbo build
yarn start                        # production: scripts/start-production.mjs spawns both apps

# Per-app dev (filter shortcuts)
yarn backend:dev                  # medusa develop (:9000)
yarn storefront:dev               # next dev --turbopack -p 8000
yarn backend:email                # Vite email-template preview

# Database (run inside apps/backend)
yarn medusa db:migrate            # apply migrations
yarn medusa user -e admin@test.com -p supersecret   # create admin user
```

### Linting & Typechecking

- **`yarn lint` / `yarn storefront lint` is broken.** `next lint` crashes with `Cannot set properties of undefined (setting 'defaultMeta')` because the root `ajv@^8` resolution conflicts with ESLint's expected ajv. There is no backend lint script.
- To typecheck instead:
  - Storefront: `cd apps/storefront && npx tsc --noEmit`
  - Backend: `medusa build` typechecks during build (tsconfig `outDir: .medusa/server`).

### Tests

Backend test scripts are defined but **the `integration-tests/` directory they depend on is not in this repo** — `jest.config.js` sets `setupFiles: ["./integration-tests/setup.js"]`, so the scripts below error at startup until that dir/setup file is created:

```bash
cd apps/backend
yarn test:unit                # TEST_TYPE=unit — **/src/**/__tests__/**/*.unit.spec.[jt]s
yarn test:integration:http    # TEST_TYPE=integration:http — **/integration-tests/http/*.spec.[jt]s
yarn test:integration:modules  # TEST_TYPE=integration:modules — **/src/modules/*/__tests__/**/*.[jt]s
```

Run a single test (once the setup file exists): `TEST_TYPE=unit NODE_OPTIONS=--experimental-vm-modules npx jest <path> -t "<name>"`.

`yarn test` (turbo) finds no `test` script in either package, so it is a no-op.

## Backend Architecture (Medusa v2, `apps/backend`)

### Conditional module configuration (`medusa-config.ts`)

Modules are **enabled conditionally based on which env vars are set** — the config builds arrays that spread to `[]` when credentials are missing. Always-loaded: `store-content`, `sendgrid-marketing`, plus `@medusajs/medusa/caching` (Redis) and `@medusajs/medusa/event-bus-redis`. Conditional: PayPal (`./src/modules/paypal`), Cloudflare R2 file storage (s3 provider), SendGrid notifications.

> **Redis note:** `projectConfig.redisUrl` does **not** auto-configure the event bus. The Redis-backed event bus, caching, and (implicitly) workflow-engine/locking modules must be added explicitly — they are, here. Without Redis, catalog-change events that drive storefront cache invalidation (below) will not fire reliably in production.

### Custom modules (`src/modules/`)

- `store-content` — MikroORM-backed CMS model for storefront content (hero, benefit cards, promotional banners, static pages). `service.ts` merges stored data over `defaults.ts` and strips legacy image paths. Has its own migration (`migrations/`).
- `sendgrid-marketing` — syncs newsletter subscribers to a SendGrid marketing list (`SENDGRID_NEWSLETTER_LIST_ID`).
- `paypal` — custom PayPal payment provider (authorize/order/payment actions + webhook handling).

### API routes (`src/api/`)

Medusa file-based routing. `store/*` are storefront-facing (publishable-key auth), `admin/*` are dashboard-facing:
- `store/order-tracking/` — order lookup by id+email; enriches shipment tracking via the **Veeqo** API (`veeqo.ts`, `VEEQO_API_KEY`) and auto-marks orders delivered.
- `store/newsletter`, `store/store-content`, `store/custom`
- `admin/store-content`, `admin/free-shipping` (constants/queries/mutations), `admin/custom`

### Subscribers (`src/subscribers/`)

Event handlers for the Medusa event bus. The critical one is **`catalog-cache.ts`**: on `product` / `product-category` / `product-collection` created/updated/deleted, it calls `revalidateStorefront(tags)` to invalidate the storefront's Next.js cache (see cross-cutting flow below). Others: `order-placed`, `order-canceled`, `fulfillment-created`, `shipment-created`, `delivery-created`, `invite-created`.

### Admin extensions (`src/admin/`)

Custom dashboard pages (`routes/store-content`, `routes/free-shipping`), widget components (`components/`), hooks (`hooks/`), and `lib/sdk.ts`. These are compiled into the Medusa admin bundle.

### Other dirs

`src/migration-scripts/initial-data-seed.ts` seeds regions/products/etc. via core-flows (invoked through the `seed` turbo task). `src/email-templates/` with a Vite preview (`email-preview/`). `src/workflows/`, `src/links/`, `src/jobs/` exist with READMEs only — **no custom workflows, links, or scheduled jobs are defined yet.**

## Storefront Architecture (Next.js 15 App Router, `apps/storefront`)

- **Region-prefixed routing:** all pages live under `app/[countryCode]/(main)/...` and `app/[countryCode]/(checkout)/...`. `src/middleware.ts` resolves the country code (URL segment > Cloudflare `cf.country` > Vercel `x-vercel-ip-country` > `NEXT_PUBLIC_DEFAULT_REGION`, default `dk`), 307-redirects to `/{country}/...`, and sets the `_medusa_cache_id` cookie. The matcher excludes `/api`, static assets, and `/track-order`.
- **Medusa SDK:** `src/lib/config.ts` instantiates the `@medusajs/js-sdk` client (`sdk`) and wraps `sdk.client.fetch` to inject the `x-medusa-locale` header on every request.
- **Data layer:** `src/lib/data/*.ts` are `"use server"` functions wrapping `sdk.client.fetch`. `src/lib/data/cookies.ts` centralizes auth/cart/cache cookie helpers — see caching note below.
- **Path aliases:** `@lib/*`, `@modules/*`, `@pages/*`.
- **`next.config.js`:** runs `check-env-variables.js` (requires `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`), sets `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` true (build won't fail on lint/TS errors), and `images.unoptimized` true.
- **UI modules:** `src/modules/` holds feature-based components (cart, checkout, products, account, order, layout, shipping, etc.). The storefront has its own **`DESIGN.md`** design-system index (One Stop Liquidation brand tokens); follow it for UI work.

## Cross-cutting: Catalog Cache Invalidation

The backend and storefront cooperate so catalog edits in the Medusa admin appear on the storefront without a redeploy:

1. Admin edit → Medusa emits `product*` / `product-category*` / `product-collection*` event → **`catalog-cache` subscriber** maps the event prefix to storefront cache tags (`products`, `categories`, `collections`).
2. `src/utils/revalidate-storefront.ts` POSTs `{ tags }` to `${STORE_URL}/api/revalidate`, authenticated with `STOREFRONT_REVALIDATE_SECRET` (shared secret; must match the storefront's `REVALIDATE_SECRET`). It is a safe no-op if `STORE_URL`/`STOREFRONT_REVALIDATE_SECRET` are unset, and swallows errors so it never breaks the originating event.
3. Storefront `app/api/revalidate/route.ts` (`force-dynamic`) validates the secret and runs `revalidateTag`/`revalidatePath`.

**Tag scoping** (`src/lib/data/cookies.ts` → `getCacheOptions`): public catalog data is cached under **global** tags (no `_medusa_cache_id` suffix) so one revalidate hits all visitors; cart/customer/order data is scoped per-visitor via the cache id. `CATALOG_REVALIDATE_SECONDS = 300` is the temporal fallback if the webhook never fires. Without `STOREFRONT_REVALIDATE_SECRET`, new products only appear after this ~5-min revalidate or a redeploy.

## Environment Variables

- **Backend** (`apps/backend/.env.template`, committed): `DATABASE_URL`, `DB_NAME`, `REDIS_URL`, `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`, `JWT_SECRET`, `COOKIE_SECRET`, `ADMIN_URL`, `STORE_URL`, `STOREFRONT_REVALIDATE_SECRET`, `STRIPE_*`, `PAYPAL_*`, `SENDGRID_API_KEY`, `SENDGRID_FROM`, `EMAIL_LOGO_URL`, `SENDGRID_NEWSLETTER_LIST_ID`. `VEEQO_API_KEY` is also read (no template entry).
- **Storefront** (`.env.local`, gitignored — see README table): `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` (required, checked at boot), `NEXT_PUBLIC_MEDUSA_BACKEND_URL` (default `http://localhost:9000`), `NEXT_PUBLIC_DEFAULT_REGION` (`dk`), `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_STRIPE_KEY`, `REVALIDATE_SECRET`, `NEXT_PUBLIC_MEDUSA_PAYMENTS_*`.

The shared secret pair **`STOREFRONT_REVALIDATE_SECRET` (backend) ↔ `REVALIDATE_SECRET` (storefront)** must match for cache invalidation to work.

## Deployment

- **Nixpacks** (two separate services): `nixpacks.backend.toml` / `nixpacks.storefront.toml`. Build via `npx turbo run build --filter=@dtc/<app>`; start via `yarn workspace @dtc/<app> run start`. The install phase is left to the provider (Corepack + `yarn install --check-cache`, detected from the root `.yarnrc.yml`).
- **Local production:** `yarn start` → `scripts/start-production.mjs` spawns the built backend (`apps/backend/.medusa/server`, requires prior `yarn build`) and the storefront.
- **`docker-compose.yaml`** runs only Postgres 16 (with a custom `pg_hba.conf`). Redis is expected to be provided externally — there is no Redis container.

## Project-Specific Notes

- This repo is a **customized fork of the Medusa DTC Starter**. When touching Medusa core behavior, consult current Medusa v2 docs (via `ctx7` for library/API questions) rather than assuming starter defaults.
- When changing anything in the catalog-cache revalidation path or the storefront cache tag scheme, update both sides (subscriber tag mapping + `getCacheOptions` global/scoped logic) together — they are coupled by convention, not by type.
- Code comments and env docs are frequently Portuguese; match the surrounding file's language when editing.
