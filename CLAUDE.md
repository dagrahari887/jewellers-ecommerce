# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Baikunthh Jewellers: a full-stack jewellery e-commerce app (INR, COD-only). It has two independent npm projects, `frontend/` (React 18 + Vite + Tailwind + Zustand) and `backend/` (Express + Prisma + MySQL). There is no root package.json.

**`context.md` is the detailed reference.** It has the full API route map, schema walkthrough, design tokens, page inventory and known gaps. Read the relevant section before making non-trivial changes, and update it when you change routes, schema or flows.

## Commands

The whole stack (MySQL + backend + frontend) runs with `docker compose up --build` from the repo root. The backend container runs `prisma db push` and the seed on every start; the seed uses upserts, so this is safe. Source directories are bind-mounted for hot reload. Run `docker compose down -v` to wipe the database.

Without Docker, run each command from its own subproject directory.

```bash
# backend (http://localhost:5000)
npm run dev        # ts-node-dev hot reload of src/server.ts
npm run build      # tsc -> dist/   (also the backend typecheck)
npm run db:push    # sync prisma/schema.prisma to MySQL (no migration)
npm run seed       # prisma/seed.ts demo data
npm run db:reset   # force-reset DB + reseed (destructive)

# frontend (http://localhost:5173)
npm run dev
npm run build      # vite build (does NOT typecheck)
npx tsc --noEmit   # frontend typecheck
```

There are no tests and no linter. Verify changes with the typecheck commands and by running both servers.

Without Docker, the backend needs `backend/.env` (copy `backend/.env.example`) with `DATABASE_URL` (MySQL), `JWT_SECRET` and `PORT`. Prisma client regenerates on `npm install` (postinstall). After you edit `schema.prisma`, run `npx prisma generate` (or `db:push`).

## Architecture

- **Ports are hardcoded on both sides.** Backend CORS allows only `http://localhost:5173` (`backend/src/server.ts`). The frontend calls `http://localhost:5000/api` directly. There is no Vite proxy and no env var.
- **Backend layout:** every route is declared in the single file `backend/src/routes/index.ts` and maps to handlers in `src/controllers/<domain>.controller.ts`. Admin product, category and collection handlers live in `product.admin.controller.ts`. Protect routes per-route with `authMiddleware` (JWT → `req.user = { id, role }`, typed via `AuthRequest`) and, for admin routes, `authorizeAdmin`. The frontend only hides admin UI, so all real enforcement happens in the backend.
- **Always import the shared Prisma client** from `src/lib/prisma.ts`. Never `new PrismaClient()` in a controller.
- **Pricing is computed server-side, never stored.** `src/logic/pricing.ts#calculateProductPrice`:
  - `FIXED` products return `fixedPrice`.
  - `RATE_BASED` products (the default) return `netWeight × MetalRate(metalType, purity) + makingCharge + stoneCharge`.
  - It returns `0` when a field or a matching rate is missing.

  Product endpoints attach a computed `price`. Any new endpoint that returns products needs to do the same.
- **Order creation** (`order.controller.ts#createOrder`) runs in a Prisma `$transaction`. It re-prices every item from current metal rates, applies the coupon, decrements stock and records GST. GST is **inclusive**: it is extracted from the post-discount total using `Settings.gstPercentage`, not added on top. Cart prices on the client are display-only.
- **Frontend state:** `frontend/src/store/useStore.ts` holds a single Zustand store persisted to localStorage (`baikunthh-storage`) with user, token, cart and wishlist. The cart lives client-side only and is not synced to the server Cart table. The same file exports `apiRequest(path, options)`, the preferred HTTP helper: it attaches the bearer token and throws `data.error`. Some older files (Login, Register, several `src/admin/*` managers) still use axios with hardcoded full URLs.
- **Admin panel:** `pages/Admin.tsx` is one large tabbed page that hosts the `src/admin/*Manager.tsx` components.
- **Styling:** use the `bj-*` Tailwind color tokens (`tailwind.config.js`) and the custom component classes in `src/index.css` (`.btn-gold`, `.input-luxury`, `.card-luxury`, etc.) instead of ad-hoc styles. Format money as `Rs.{n.toLocaleString('en-IN')}`. Use only Lucide icons.

**Design context:** `PRODUCT.md` (users, confirmed brand claims, what must not be fabricated) and `DESIGN.md` (tokens and visual rules; e.g. white text only on `bj-gold-deep`, never on `bj-gold`) govern all UI work. Pages use the shared `.page-shell` / `.page-container` / `.page-title` classes, and sticky offsets use `var(--header-h)`.

## Gotchas

- In Docker, Vite does not pick up `tailwind.config.js` edits. Run `docker compose restart frontend`, or every new class used in `@apply` makes `index.css` return a 500 error and the site loses all styling.

- `backend/prisma/migrations/` exists, but the workflow uses `db push`. `prisma/schema.sql` is a stale hand-written copy (it uses a different DB name), and `schema.prisma` is the source of truth.
- `node_modules/`, `dist/` and `.env` are git-ignored. Copy `backend/.env.example` to `backend/.env` for non-Docker runs.
- `frontend/src/pages/ProductPage.tsx` is unrouted dead code. The real product page is `ProductDetails.tsx` (`/product/:slug`). `components/JewelleryFinder.tsx` is an unimplemented placeholder.
