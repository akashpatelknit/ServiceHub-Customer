# Service Hub — Customer Site

Customer-facing booking site for Service Hub: browse the service catalog, book
services, and manage your account. Talks to [service-hub-backend](../service-hub-backend).

## Tech Stack

| Category | Library |
|---|---|
| Framework / build | React 19, Vite (TypeScript) |
| Routing | TanStack Router (typed, code-based route tree — see `src/routes/router.tsx`) |
| Data fetching | TanStack Query 5 |
| UI components | shadcn/ui ("new-york" style) on Radix UI primitives + Tailwind CSS 3 |
| Forms | `react-hook-form` + `zod` (via `@hookform/resolvers`) |
| State | Zustand (`authStore`, `cartStore`, `themeStore`, each persisted to `localStorage`) |
| HTTP | axios |
| Payments | Razorpay Checkout, loaded on demand via a `<script>` tag (not an npm dependency) |
| Icons / dates / toasts | `lucide-react`, `date-fns` + `react-day-picker`, `sonner` |

## Implemented Pages / Features

- **Homepage** (`/`) — hero with category grid, a trust-stat strip, a spotlight
  promo row (static placeholder content — see Known Gaps), and service rows ("New and
  noteworthy", "Most booked", one row per subcategory). All rows are derived
  client-side from one bounded pool of real active categories/subcategories/services —
  the backend has no featured/sort concept yet, so ranking logic lives in
  `src/lib/homeDerivations.ts`, not the API.
- **Category / subcategory listing** (`/category/:categorySlug`,
  `/category/:categorySlug/:subcategorySlug`) — real catalog data with filters.
- **Search** (`/search`) — fully wired: debounced query, `useFullSearch` (cross-catalog:
  categories/subcategories/services) plus a separate paginated service search, against
  the live `/search` backend endpoint. A search bar/overlay in the header
  (`SearchBar.tsx`, `MobileSearchOverlay.tsx`) links into the same page.
- **Service detail** (`/service/:serviceId`) — service info, add-ons, add-to-cart.
- **Cart** (`/cart`) — guest cart (Zustand, persisted to `localStorage`) for
  unauthenticated visitors; on successful login/register, `mergeGuestCartIntoServer()`
  pushes every guest line to the real server cart (`POST /cart/items`, one call per
  item, via `Promise.allSettled` so one stale item doesn't block the rest) and clears
  the local buffer of whatever succeeded.
- **Auth** (`/login`, `/register`, `/forgot-password`, `/reset-password`) — real
  email/password auth against `/auth/user/*`. `useRequireAuth` gates checkout and the
  account section: an unauthenticated visitor hitting `/checkout` is redirected to
  `/login?returnTo=/checkout` and bounced back after login.
- **Checkout** (`/checkout`) — address selection, schedule (instant/slot), order
  summary, `POST /checkout`, then opens the real Razorpay Checkout widget with the
  `keyId`/`order_id`/`amount` returned by the backend, redirecting to
  `/order-confirmation/:orderNumber` on success **or** on modal dismissal (the order
  already exists server-side by that point — there's no retry-payment endpoint, so the
  confirmation page just shows the real pending status instead of silently failing).
  Code-complete and wired end-to-end against the backend's real checkout/payment
  routes; the backend's own Razorpay integration hasn't been exercised against live
  credentials, so treat this as untested against a real payment, not unimplemented.
- **Account section** (`/account/*`):
  - **Profile** (`/account/profile`) — real profile get/update.
  - **Addresses** (`/account/addresses`) — real address CRUD.
  - **Order History** (`/account/orders`, `/account/orders/:orderNumber`) — real order
    list/detail against `/orders`.
  - **Settings** (`/account/settings`) — deliberately minimal: only theme
    (light/dark, functional, persisted) and logout. No notification-preferences or
    self-service account-deletion section, because the backend has no corresponding
    endpoints for either yet.
- **Static pages**: About, Blog (`/blog`, `/blog/:slug`), Careers, Press, Help, Terms,
  Privacy, Cancellation & Refunds, Register as a Professional (real lead-capture form,
  wired to the live `/vendor-leads` endpoint), Partner App, Vendor Resources — see
  Known Gaps for which of these are content placeholders.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | yes | Backend API base URL, e.g. `http://localhost:8000/api/v1` |

There is no Razorpay key env var here — the checkout flow gets `keyId` from the
backend's `POST /checkout` response at order-creation time, not from a client-side env
variable.

## Setup & Run

```bash
git clone <repo-url>
cd service-hub-customer
npm install
cp .env.example .env.development   # or edit .env.development directly — VITE_API_BASE_URL only
npm run dev
```

Other scripts:

```bash
npm run build     # tsc -b && vite build
npm run preview   # preview a production build locally
npm run lint       # oxlint
```

## Known Gaps / Placeholders

- **Spotlight promo banners** (homepage) are static, hardcoded content
  (`src/lib/config.ts`) shaped to match the backend's `Banner` model — that model
  exists on the backend but its routes aren't mounted, so there's nothing live to fetch
  yet.
- **Trust stats** ("4.8 rating", "12 Lakh+ customers", etc.) on the homepage are static
  numbers, not computed from real data.
- **Footer social links** (Facebook/Instagram/etc.) all point to `#` — flagged in-code
  with `// TODO: swap '#' for real profile URLs before launch — accounts don't exist yet`.
- **App store badges** (Google Play / App Store) also point to `#` — flagged in-code
  as pending the customer/vendor apps actually being published.
- **Terms of Service and Privacy Policy** are explicitly marked in-code as
  **placeholder legal content**: written to read like a complete, plausible policy for
  a home-services marketplace, but **not reviewed by a lawyer** and flagged as
  must-not-ship-as-is.
- **Blog content** (`src/data/blogPosts.ts`) is static placeholder posts — there's no
  blog/CMS backend.
- **Partner App and Vendor Resources pages** are explicitly "currently in development" /
  informational static pages — there is no real vendor mobile app or resource portal
  behind them, only the `Register as a Professional` lead form is real.
- **"New and noteworthy"** on the homepage uses `createdAt` recency as a stand-in for a
  featured/new flag — `Service` has no `isFeatured`/`isNew` field on the backend.
- **Account Settings** has no notification-preferences or account-deletion UI, matching
  the absence of those endpoints on the backend (see above).
