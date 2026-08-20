# Baikunthh Jewellers — Project Context

> **Last updated:** 2026-08-19 (Frontend Admin & Account Features Added)
> **Purpose:** Complete technical reference for future AI sessions, developers, or onboarding. Read this file before making any changes to the codebase.

---

## 1. Project Overview

**Baikunthh Jewellers** is a full-stack luxury jewellery e-commerce application built for an Indian jewellery brand. The system includes a customer-facing storefront, a full admin panel, live metal rate pricing, appointment booking, coupon management, and order tracking.

| Aspect | Detail |
|---|---|
| **Brand** | Baikunthh Jewellers |
| **Store Name (DB)** | "Baikunthh Jewellers" |
| **Currency** | Indian Rupees (INR / Rs) |
| **GST Rate** | 3% (configurable in Settings table) |
| **Default Payment** | Cash on Delivery (COD) |
| **Primary Gold Color** | `#C5A059` (`bj-gold`) |

---

## 2. Repository Structure

```
baikunthh-jewellers/
├── frontend/           <- React + Vite + TypeScript + Tailwind
│   ├── src/
│   │   ├── App.tsx              <- Router + layout wrapper
│   │   ├── main.tsx             <- Entry point
│   │   ├── index.css            <- Global design system (Tailwind + custom classes)
│   │   ├── pages/               <- Route-level page components
│   │   ├── components/          <- Shared/reusable components
│   │   ├── store/               <- Zustand global state + API helper
│   │   ├── admin/               <- Admin panel sub-components
│   │   └── vite-env.d.ts
│   ├── tailwind.config.js       <- Brand color tokens + custom fonts/shadows
│   ├── package.json
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── index.html
│
└── backend/            <- Node.js + Express + TypeScript + Prisma + MySQL
    ├── src/
    │   ├── server.ts            <- Express app entry point (PORT 5000)
    │   ├── routes/index.ts      <- Centralized route definitions
    │   ├── controllers/         <- Business logic handlers
    │   ├── middleware/          <- auth.ts (JWT auth + admin guard)
    │   ├── logic/               <- pricing.ts (product price calculator)
    │   └── lib/                 <- prisma.ts (shared Prisma client)
    ├── prisma/
    │   ├── schema.prisma        <- Full database schema (MySQL)
    │   ├── schema.sql           <- Raw SQL version
    │   └── seed.ts              <- Seed script with demo data
    ├── .env                     <- DB URL + JWT secret + PORT
    ├── package.json
    └── tsconfig.json
```

---

## 3. Tech Stack

### Frontend
| Technology | Version | Role |
|---|---|---|
| React | 18.2.0 | UI framework |
| TypeScript | 7.0.2 | Type safety |
| Vite | 5.1.4 | Build tool / dev server |
| React Router DOM | 7.18.2 | Client-side routing |
| Zustand | 5.0.15 | Global state management |
| Framer Motion | 13.1.0 | Animations |
| Lucide React | 0.344.0 | Icon library |
| Axios | 1.6.7 | HTTP (available, most calls use fetch) |
| TailwindCSS | 3.4.1 | Utility CSS |

### Backend
| Technology | Version | Role |
|---|---|---|
| Node.js + Express | 4.19.0 | HTTP server |
| TypeScript | 5.4.3 | Type safety |
| Prisma ORM | 5.11.0 | Database ORM |
| MySQL | — | Database (local, port 3306) |
| bcryptjs | 2.4.3 | Password hashing |
| jsonwebtoken | 9.0.2 | JWT auth (7-day expiry) |
| Zod | 3.22.4 | Request validation |
| ts-node-dev | 2.0.0 | Dev server with hot reload |

---

## 4. Environment & Configuration

### Backend `.env`
```env
DATABASE_URL="mysql://root:1234@localhost:3306/baikunthh_db"
JWT_SECRET="BAIKUNTHH_LUXURY_SECRET"
PORT=5000
```

### Frontend API Base URL
```ts
// frontend/src/store/useStore.ts
export const API_URL = 'http://localhost:5000/api';
```

### CORS
Backend allows only `http://localhost:5173` (Vite default).

### Dev Commands
```bash
# Frontend (runs on http://localhost:5173)
cd frontend && npm run dev

# Backend (runs on http://localhost:5000)
cd backend && npm run dev

# Database seed
cd backend && npm run seed

# DB push (sync schema without migration)
cd backend && npm run db:push

# Full DB reset + reseed
cd backend && npm run db:reset
```

---

## 5. Frontend Architecture

### 5.1 Routing (App.tsx)

| Path | Component | Notes |
|---|---|---|
| `/` | `Home` | Hero, featured products, categories |
| `/shop` | `Shop` | Product listing with filters |
| `/product/:slug` | `ProductDetails` | Single product page |
| `/cart` | `Cart` | Shopping cart |
| `/checkout` | `Checkout` | Order placement |
| `/wishlist` | `Wishlist` | Saved items |
| `/login` | `Login` | Auth form |
| `/account` | `Account` | User profile + orders |
| `/admin` | `Admin` | Admin panel (role-gated in UI) |
| `/appointments` | `Appointments` | Book showroom visit |
| `/articles` | `Articles` | Placeholder ("Journal") |
| `/collections` | redirects to `/shop` | |

### 5.2 Global State (useStore.ts)

Built with **Zustand** + `persist` middleware. Persisted to `localStorage` under key `baikunthh-storage`.

**Persisted slices:** `user`, `token`, `cart`, `wishlist`
**Not persisted:** `toasts` (ephemeral)

Key interfaces:
```ts
User        { id, name, email, role: 'CUSTOMER'|'ADMIN', phone? }
CartItem    { productId, name, price, quantity, image, purity?, metalType? }
WishlistItem{ productId, name, slug, price, image, category, purity? }
Toast       { id, type: 'success'|'error'|'info'|'warning', message }
```

**Key actions:**
- `login(user, token)` — stores token in localStorage + Zustand
- `logout()` — clears user, token, cart, wishlist
- `getAuthHeader()` — returns `{ Authorization: "Bearer <token>" }`
- `addToCart(item)` — increments quantity if already in cart
- `toggleWishlist(item)` — adds or removes from wishlist
- `addToast(type, message)` — auto-removes toast after 4 seconds

**API Helper:**
```ts
export const apiRequest = async (path: string, options?: RequestInit): Promise<any>
// - Automatically attaches Bearer token from store/localStorage
// - Base URL: http://localhost:5000/api
// - Throws Error with data.error message on non-ok responses
```

### 5.3 Design System

**Tailwind Color Tokens:**
| Token | Hex | Usage |
|---|---|---|
| `bj-ivory` | `#FAF9F6` | Page backgrounds |
| `bj-charcoal` | `#1A1A1A` | Primary text, dark elements |
| `bj-charcoal-light` | `#2A2A2A` | Subtle dark |
| `bj-gold` | `#C5A059` | Primary accent (buttons, highlights) |
| `bj-gold-light` | `#D4AF37` | Lighter gold |
| `bj-gold-dark` | `#B38F4D` | Hover state for gold |
| `bj-gold-pale` | `#F5EDD8` | Very light gold wash |
| `bj-champagne` | `#F7E7CE` | Hero text, announcements |
| `bj-cream` | `#FDF8F2` | Card/product image backgrounds |
| `bj-stone` | `#8C7B6B` | Muted secondary text |

**Font Families:**
- **Serif / Display:** Cormorant Garamond, Playfair Display (headings, product names, logo class `.font-serif`, `.font-display`)
- **Sans:** Inter (body text, UI labels)

**Custom CSS Classes (from index.css):**
```
Buttons:    .btn-gold, .btn-outline, .btn-outline-white, .btn-ghost
Inputs:     .input-luxury, .select-luxury
Labels:     .label-luxury
Typography: .font-serif, .font-display, .section-eyebrow, .section-title
Cards:      .card-luxury
Badges:     .badge-gold, .badge-charcoal, .badge-success, .badge-warning, .badge-error
Animation:  .text-shimmer, .fade-in, .skeleton, .toast-enter, .toast-exit
Layout:     .hero-overlay, .border-accent-gold, .product-image-zoom
Utilities:  .shadow-luxury, .shadow-luxury-sm, .bg-luxury-gradient, .no-scrollbar
Aspect:     .aspect-jewellery (3/4), .aspect-product (1/1), .aspect-banner (16/7)
Admin:      .admin-nav-item (+ .active modifier)
```

---

## 6. Frontend Pages & Components

### Pages

| File | Description |
|---|---|
| `Home.tsx` | Hero banner (from DB or fallback Unsplash), live rates ticker, category grid (up to 5), secondary banners (banners[1..2]), featured products (up to 4), brand story section. Uses Framer Motion animations. |
| `Shop.tsx` | Full product listing. Sidebar filters by category, collection, metal (GOLD/SILVER/PLATINUM), purity (24K/22K/18K/925). URL query params for all filters. Client-side sort (newest/price-low/price-high). Grid/list view toggle. Skeleton loading states. |
| `ProductDetails.tsx` | Single product view with image gallery, price breakdown, add to cart, add to wishlist, reviews section. |
| `Cart.tsx` | Cart items with quantity control, price display, link to Checkout. |
| `Checkout.tsx` | Step 1: Address selection (fetch /me/addresses, add new inline form). Step 2: COD payment (hardcoded). Order summary with coupon code input + validation. Posts to /orders. Redirects to /account on success. |
| `Login.tsx` | Email/password login form. On success, calls useStore.login(). Respects `?redirect=` query param. |
| `Register.tsx` | Registration form (name, email, password, phone). |
| `Account.tsx` | User profile view/edit, address management (add/delete), order history with status tracking. |
| `Wishlist.tsx` | Saved wishlist items with move-to-cart and remove actions. |
| `Appointments.tsx` | Book a showroom appointment (type: BRIDAL/CUSTOM/SHOPPING, date, notes). Requires auth. |
| `Admin.tsx` | Full admin panel — wraps admin sub-components via sidebar nav. Role-gated in UI (but backend also guards). |

### Components

| File | Description |
|---|---|
| `Navbar.tsx` | Fixed top nav. Transparent on home hero, white/blur on scroll. Announcement bar (fixed top-0, z-70). Collections dropdown with categories fetched from API. Search overlay. Cart + wishlist count badges. Admin gear icon for ADMIN role. Mobile hamburger menu. |
| `Footer.tsx` | Brand info, navigation links, social links, contact info. |
| `ProductCard.tsx` | Product card for grid/list view. Image, category label, name, price, wishlist heart toggle. Navigates to /product/:slug. |
| `ImageGallery.tsx` | Product image carousel/gallery with thumbnail selection. |
| `RatesTicker.tsx` | Auto-scrolling ticker showing live metal rates fetched from /api/rates. |
| `PriceBreakdown.tsx` | Shows metal value + making charge + stone charge breakdown for rate-based products. |
| `ShopFilters.tsx` | Filter panel component (also inlined in Shop.tsx). |
| `StarRating.tsx` | Star rating display component (read-only or interactive). |
| `EmptyState.tsx` | Generic "no results" UI state with optional action button. |
| `LoadingSpinner.tsx` | Full-page or inline spinner. Also exports SkeletonCard for grid placeholders. |
| `Toast.tsx` | Toast notification system. ToastContainer renders all active toasts from Zustand store (position: fixed bottom-right). |
| `JewelleryFinder.tsx` | EMPTY FILE (0 bytes) — placeholder for future AI-powered jewellery finder feature. |

### Admin Sub-Components (src/admin/)

| File | Description |
|---|---|
| `Dashboard.tsx` | Admin overview with summary stats. |
| `InventoryManager.tsx` | Product CRUD (create/edit/delete), stock adjustment. |
| `OrdersManager.tsx` | View all orders, update order/payment status, add tracking number/URL. |
| `AppointmentsManager.tsx` | View & manage appointment bookings, update status. |
| `GoldRatesManager.tsx` | Update live metal rates (Gold/Silver/Platinum by purity). |
| `BannersManager.tsx` | CRUD for homepage banners. |
| `CouponsManager.tsx` | CRUD for discount coupons. |
| `ReviewsManager.tsx` | Manage and approve/delete product reviews. |
| `CustomerFormModal.tsx` | Modal to manually add a customer from the admin dashboard. |
| `CategoriesManager.tsx` | Full CRUD interface to manage product categories and see product counts. |

---

## 7. Backend Architecture

### 7.1 Server (server.ts)

- Express on **PORT 5000**
- CORS: only `http://localhost:5173`
- JSON body parser via `express.json()`
- All API routes mounted at `/api` via `router`

### 7.2 Authentication (src/middleware/auth.ts)

- `authMiddleware` — Validates `Authorization: Bearer <token>` JWT header. Attaches `req.user = { id, role }` to request.
- `authorizeAdmin` — Checks `req.user.role === 'ADMIN'`. Returns 403 if not admin.
- JWT token expires in **7 days**
- JWT secret from `process.env.JWT_SECRET`
- `AuthRequest` interface extends Express `Request` with optional `user` field

**Auth flow:**
1. `POST /api/auth/register` — hashes password with bcrypt (salt 10), creates User, returns userId
2. `POST /api/auth/login` — verifies password, signs JWT, returns `{ token, user: { id, name, email, role, phone } }`
3. Frontend stores token in both `localStorage` and Zustand state

### 7.3 Pricing Logic (src/logic/pricing.ts)

```ts
calculateProductPrice(product: Product, rates: MetalRate[]): number
```

- **FIXED pricing:** returns `product.fixedPrice` as number
- **RATE_BASED pricing:** `(netWeight * metalRate) + makingCharge + stoneCharge`
  - Looks up rate by matching `product.metalType` AND `product.purity` in MetalRate table
  - Returns 0 if any required field (netWeight, metalType, purity, or matching rate) is missing

### 7.4 Complete API Route Map

All routes prefixed with `/api`.

#### Public Routes (no auth)
```
POST   /auth/register
POST   /auth/login

GET    /products               # ?featured, ?category, ?collection, ?search, ?purity, ?metal
GET    /products/:slug
GET    /categories
GET    /collections
GET    /reviews                # ?productId=...
POST   /reviews                # (auth required)
GET    /banners
GET    /articles
GET    /articles/:slug
GET    /settings
GET    /rates
POST   /coupons/validate       # body: { code, orderAmount }; returns { coupon, discountAmount }
```

#### Authenticated Routes (Bearer token required)
```
POST   /orders
GET    /orders
GET    /me
PUT    /me
PUT    /me/password
GET    /me/addresses
POST   /me/addresses
DELETE /me/addresses/:id
POST   /appointments
GET    /appointments
PUT    /rates/:id              # (admin only)
POST   /rates/bulk             # (admin only)
```

#### Admin Routes (ADMIN role required)
```
GET    /admin/orders
PUT    /admin/orders/:id/status       # { status?, paymentStatus?, trackingNumber?, trackingUrl? }

GET    /admin/products
POST   /admin/products
PUT    /admin/products/:id
DELETE /admin/products/:id
PUT    /admin/products/:id/stock

GET    /admin/categories
POST   /admin/categories
PUT    /admin/categories/:id
DELETE /admin/categories/:id

GET    /admin/collections
POST   /admin/collections
PUT    /admin/collections/:id
DELETE /admin/collections/:id

GET    /admin/appointments
PUT    /admin/appointments/:id/status

GET    /admin/reviews
PUT    /admin/reviews/:id/approve
DELETE /admin/reviews/:id

GET    /admin/coupons
POST   /admin/coupons
PUT    /admin/coupons/:id
DELETE /admin/coupons/:id

GET    /admin/banners
POST   /admin/banners
PUT    /admin/banners/:id
DELETE /admin/banners/:id

GET    /admin/articles
POST   /admin/articles
PUT    /admin/articles/:id
DELETE /admin/articles/:id

PUT    /admin/settings

GET    /admin/customers
```

---

## 8. Database Schema (Prisma / MySQL)

**Database name:** `baikunthh_db`
**Host:** `localhost:3306`
**User:** `root` / **Pass:** `1234`

### Enums

```
Role:              CUSTOMER | ADMIN
PriceType:         FIXED | RATE_BASED
MetalType:         GOLD | SILVER | PLATINUM
OrderStatus:       CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED
PaymentStatus:     PENDING | PAID | FAILED
AppointmentType:   BRIDAL | CUSTOM | SHOPPING
AppointmentStatus: PENDING | CONFIRMED | COMPLETED | CANCELLED
DiscountType:      PERCENTAGE | FIXED
ArticleStatus:     DRAFT | PUBLISHED
```

### Models

**User**
```
id (UUID string), email (unique), password (hashed), name, role (default: CUSTOMER), phone?, createdAt
Relations: cart?, wishlist?, orders[], appointments[], reviews[], addresses[]
```

**UserAddress**
```
id, userId, label (default: "Home"), fullName, phone, line1, line2?, city, state, pincode, isDefault (bool), createdAt
Relations: user (cascade delete)
```

**Category**
```
id, name (unique), description?, imageUrl?, slug (unique)
Relations: products[]
```

**Collection**
```
id, name (unique), description?, imageUrl?, slug (unique)
Relations: products[]
```

**Product**
```
id, sku (unique), name, description (Text), slug (unique)
categoryId, collectionId?
priceType (FIXED|RATE_BASED, default: RATE_BASED)
fixedPrice? (Decimal 12,2)
metalType? (GOLD|SILVER|PLATINUM)
purity? (string e.g. "22K", "18K", "925")
grossWeight? (Decimal 10,3), netWeight? (Decimal 10,3)
makingCharge? (Decimal 10,2), stoneCharge? (Decimal 10,2)
stock (int, default: 0)
tags (JSON array)
isFeatured (bool, default: false), isActive (bool, default: true)
createdAt, updatedAt
Relations: category, collection?, images[], cartItems[], wishlistItems[], orderItems[], reviews[]
```

**ProductImage**
```
id, url (Text), productId, sortOrder (default: 0)
```

**MetalRate** (live rates table)
```
id, metal (MetalType), purity (string), rate (Decimal 10,2), updatedAt
```

**RateHistory** (historical snapshots)
```
id, metal, purity, rate, createdAt
```

**Coupon**
```
id, code (unique uppercase), description?, discountType (PERCENTAGE|FIXED)
value (Decimal 10,2), minOrderAmount (Decimal 12,2, default: 0)
maxDiscount? (Decimal 12,2), expiryDate (DateTime)
usageLimit?, usageCount (default: 0), isActive (bool, default: true), createdAt
```

**Banner**
```
id, title?, subtitle?, imageUrl (Text), linkUrl?, buttonText?
isActive (bool, default: true), displayOrder (int, default: 0), createdAt
```

**Article**
```
id, title, slug (unique), description?, content (LongText), imageUrl?
status (DRAFT|PUBLISHED, default: DRAFT), authorId?, createdAt, updatedAt
```

**Cart**
```
id, userId (unique)
Relations: user, items[]
```

**CartItem**
```
id, cartId, productId, quantity (default: 1)
```

**Wishlist**
```
id, userId (unique)
Relations: user, items[]
```

**WishlistItem**
```
id, wishlistId, productId
```

**Order**
```
id, orderNumber (unique, format: "BJ-{timestamp}"), userId
totalAmount (Decimal 12,2), discountAmount (Decimal, default: 0)
gstAmount (Decimal, default: 0), finalAmount (Decimal 12,2)
couponCode?, couponId?
status (OrderStatus, default: CONFIRMED)
paymentStatus (PaymentStatus, default: PENDING)
paymentMethod (string, default: "COD")
address (Json — serialized address string)
trackingNumber?, trackingUrl?, notes?
createdAt, updatedAt
Relations: user, coupon?, items[]
```

**OrderItem**
```
id, orderId, productId, quantity, price (Decimal 12,2)
```

**Appointment**
```
id, userId, date (DateTime), type (BRIDAL|CUSTOM|SHOPPING)
status (AppointmentStatus, default: PENDING), notes?, createdAt
```

**Review**
```
id, rating (int), title?, comment? (Text), userId, productId
isApproved (bool, default: true), createdAt
```

**Settings** (singleton table)
```
id, storeName (default: "Baikunthh Jewellers")
contactEmail?, contactPhone?, whatsappNumber?
instagramLink?, facebookLink?, youtubeLink?
gstPercentage (Decimal 5,2, default: 3.00)
address? (Text), aboutUs? (Text)
shippingPolicy? (Text), returnPolicy? (Text), privacyPolicy? (Text)
heroTitle?, heroSubtitle?, announcement?
updatedAt
```

---

## 9. Order Creation — Business Logic

```
POST /api/orders
Body: { items: [{productId, quantity}], address: string, paymentMethod?, couponCode?, notes? }

Runs as Prisma $transaction:
1. Fetch all MetalRates (for price calculation)
2. If couponCode: validate coupon (exists, active, not expired)
3. For each cart item:
   a. Validate productId + quantity
   b. Fetch product, check stock >= quantity
   c. calculateProductPrice(product, rates)
   d. Accumulate subtotal
   e. Decrement product.stock
4. Calculate discount (PERCENTAGE or FIXED, capped by maxDiscount)
5. Extract GST from final amount: gstAmount = amountAfterDiscount * gstRate / (1 + gstRate)
   (GST is treated as INCLUSIVE in product prices)
6. finalAmount = amountAfterDiscount (GST already included)
7. Create Order + OrderItems
8. Increment coupon.usageCount

After transaction:
9. Delete CartItems for this user (server-side cart cleared)

Returns: { message, order }
```

---

## 10. Checkout Flow (Frontend)

```
User visits /checkout
  -> Guard: cart empty? -> redirect /cart
  -> Guard: not logged in? -> redirect /login?redirect=/checkout
  -> Fetch /me/addresses
  -> Display saved addresses (radio select) OR show add-address form
  -> Payment: hardcoded COD display
  -> Coupon box: POST /coupons/validate -> shows discountAmount
  -> "Place Order" button: POST /orders with { items, address (string), paymentMethod: 'COD', couponCode }
  -> On success: clearCart() -> navigate('/account')
```

---

## 11. Known Gaps / Incomplete Features

| Item | Status |
|---|---|
| `JewelleryFinder.tsx` | Skeleton added — feature still pending implementation |
| `/articles` page | Placeholder "coming soon" text — no real implementation |
| `/collections` route | Redirects to `/shop` — no dedicated collections page |
| `/about` link | Referenced in Home brand story button, no route defined |
| Payment gateway | COD only — no Razorpay/Stripe integration |
| Image upload | Admin uses image URLs — no file upload system |
| Server-side cart sync | Cart only cleared post-order; not synced on add-to-cart |
| Email notifications | No email service (nodemailer / SendGrid) integrated |
| Order cancellation | No frontend cancel flow for customers |
| Product pagination | No pagination on /products endpoint or Shop page |

---

## 12. Instagram Handle

Hardcoded in `Navbar.tsx`:
```
https://instagram.com/devanshabhushan
```

---

## 13. Key Conventions

- **Money display:** `Rs.{amount.toLocaleString('en-IN')}` format throughout UI
- **Product routing:** slug-based URLs (`/product/:slug`)
- **Category filtering:** uses category *name* string in URL params (not ID)
- **Admin protection:** Done in backend middleware — frontend only shows/hides UI elements
- **Token storage:** JWT in both Zustand state AND localStorage for refresh persistence
- **Prisma client:** Singleton exported from `src/lib/prisma.ts`
- **IDs:** All models use UUID strings from Node `crypto.randomUUID()`
- **No SSR:** Pure SPA, client-side routing only
- **Data fetching:** Manual `useEffect` + `useState` pattern — no React Query or SWR
- **Icons:** Lucide React exclusively
- **Animations:** Framer Motion on Home hero; CSS keyframe classes (`.fade-in`, `.skeleton`, etc.) elsewhere
- **Controller naming:** `[domain].controller.ts` or `[domain].admin.controller.ts`

---

## 14. Recent Fixes (2026-08-19)

- **Prisma Connection Pooling:** Fixed `rate.controller.ts` and `auth.controller.ts` which were creating their own `new PrismaClient()` instances. They now use the shared singleton from `src/lib/prisma.ts`.
- **JWT Auth Middleware:** Refactored `appointment.controller.ts` and `rate.controller.ts` to properly use `AuthRequest` and `req.user` populated by the `authMiddleware`, instead of manually verifying the JWT inside every handler.
- **Admin Product Updates:** Fixed a bug in `product.admin.controller.ts` where updating a product caused slug conflicts and `tags` array parsing issues. Also added explicit `Prisma.JsonNull` handling for null JSON fields.
- **Search:** Added `mode: 'insensitive'` to product search in `product.controller.ts` to support MySQL case-insensitive searching correctly in Prisma.
- **Frontend Types:** Fixed `getAuthHeader` return type signature in Zustand store (`useStore.ts`) to resolve strict TypeScript compilation error.
- **Admin Products:** Integrated `ProductFormModal.tsx` and functional action icons (Edit, Delete) into the main `Admin.tsx` dashboard for full product CRUD.
- **Project Configuration:** Added `build` script to frontend `package.json` to support `vite build`.
- **Admin UI Expansion:** Added tabs to `Admin.tsx` for Appointments, Gold Rates, Banners, Coupons, and Reviews. Connected the existing and newly created managers to these tabs. Added ability to manually add customers.
- **Product Inventory Form:** Updated `ProductFormModal.tsx` to include fields required for rate-based pricing (metalType, purity, grossWeight, netWeight, makingCharge, stoneCharge).
- **Address Management:** Fixed the "Delete" functionality and added a "Add New Address" inline form in `Account.tsx`.
- **Customer Reviews:** Added a "Write a Review" form on `ProductDetails.tsx` for authenticated users.
- **Admin Inventory Bug:** Fixed `adminGetProducts` in `product.admin.controller.ts` to return an object wrapping the products array (`{ products: [...] }`), which resolved an issue where products were missing from the admin UI.
- **Review Submission Bug:** Added the missing `apiRequest` import in `ProductDetails.tsx` which was throwing a ReferenceError upon review submission.
- **Category Management:** Added `CategoriesManager.tsx` to the admin panel with a new dedicated tab in `Admin.tsx` to facilitate category creation, updating, and deletion.
