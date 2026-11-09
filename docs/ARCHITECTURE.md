# Project Architecture and Directory Structure
## E-Commerce Platform

**Version:** 1.1  **Date:** 2026-11-06
**Companion documents:** PRD.md, TRD.md, APP_FLOW.md

---

## 1. System Architecture

```
                         Users (browser / mobile)
                                   |
                         DNS + SSL + CDN (Cloudflare / Vercel Edge)
                                   |
        +--------------------------+---------------------------+
        |                                                      |
 Next.js web app (apps/web)                         Static assets and images
 SSR / ISR / CSR, animations, admin UI              (Cloudinary or S3 + CDN)
        |  HTTPS REST (JSON), Bearer access token + refresh cookie
        v
 Load balancer
        |
 API servers (apps/api, stateless, 2+ instances)
   Routes -> Middleware -> Controllers -> Services -> Repositories
        |             |               |
        |             |               +--> Payment gateway (Stripe etc.)  <-- webhooks
        |             +------------------> Redis (cache, rate limit, queues)
        v                                        |
 PostgreSQL (primary + backups)          Worker process (BullMQ)
                                         emails, order expiry, reports
                                                 |
                                         Email provider (SendGrid / SES / Resend)

 Cross-cutting: Sentry (errors), Pino logs, uptime monitor, GitHub Actions CI/CD
```

**Pattern:** modular monolith API with a separate Next.js frontend, in a single monorepo (pnpm workspaces + Turborepo) sharing types and validation schemas.

---

## 2. Layered Architecture (Backend)

| Layer | Responsibility | Rules |
|-------|----------------|-------|
| **Routes** | URL and HTTP verb mapping, attach middleware | No business logic |
| **Middleware** | Authentication, authorization, validation, rate limit, request ID, error handler | Reusable, in `common/middleware` |
| **Controller** | Parse request, call a service, shape the response | Thin |
| **Service** | Business rules (pricing, stock, order lifecycle, coupons) | Owns transactions; the only layer that talks to several repositories |
| **Repository** | Database access through Prisma | No business rules |
| **Schema (Zod)** | Request and response validation | Shared with the frontend through `packages/shared` |
| **Jobs** | Background tasks | Idempotent and retryable |
| **Providers** | External services (payment, email, storage) behind interfaces | Swappable (Stripe or a regional gateway) |

**Request lifecycle:** request -> requestId and logger -> rate limit -> CORS/helmet -> authenticate (JWT) -> authorize (role) -> validate (Zod) -> controller -> service (transaction) -> repository -> response -> central error handler.

---

## 3. Frontend Architecture

| Concern | Approach |
|---------|----------|
| Routing | Next.js App Router with route groups: `(shop)`, `(auth)`, `(account)`, `admin` |
| Rendering | Server Components for content and SEO; small Client Components for interactivity and motion |
| Data fetching | Server-side fetch for public catalog pages; TanStack Query for client data (cart, account, admin) |
| State | Zustand for cart drawer, UI and guest cart; server state in TanStack Query |
| Auth | Access token in memory, refresh token in httpOnly cookie, `middleware.ts` guards `/account` and `/admin`, API client auto-refreshes on 401 |
| Design system | Tokens in `styles/tokens.css`, Tailwind theme, reusable `components/ui` |
| Motion | `components/motion` (Reveal, StaggerGroup, PageTransition, Parallax, SmoothScroll), shared variants in `lib/motion` |
| Forms | React Hook Form + Zod schemas from `packages/shared` |

---

## 4. Full Directory Structure

```
ecommerce/
├── apps/
│   ├── web/                                   # Next.js frontend (storefront + account + admin)
│   │   ├── app/
│   │   │   ├── layout.tsx                     # Root layout: fonts, providers, MotionConfig
│   │   │   ├── template.tsx                   # Page transition wrapper (re-mounts per navigation)
│   │   │   ├── globals.css                    # Tailwind layers, base styles
│   │   │   ├── not-found.tsx                  # 404
│   │   │   ├── error.tsx                      # 500 boundary
│   │   │   ├── loading.tsx                    # Global skeleton
│   │   │   ├── sitemap.ts                     # Dynamic sitemap.xml
│   │   │   ├── robots.ts
│   │   │   ├── 403/page.tsx
│   │   │   ├── maintenance/page.tsx
│   │   │   │
│   │   │   ├── (shop)/                        # Public storefront
│   │   │   │   ├── layout.tsx                 # Header, footer, SmoothScroll, cart drawer
│   │   │   │   ├── page.tsx                   # Home  /
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx               # /products
│   │   │   │   │   └── [slug]/page.tsx        # /products/[slug]
│   │   │   │   ├── categories/[slug]/page.tsx # /categories/[slug]
│   │   │   │   ├── search/page.tsx            # /search?q=
│   │   │   │   ├── cart/page.tsx              # /cart
│   │   │   │   ├── checkout/
│   │   │   │   │   ├── page.tsx               # /checkout (4 steps)
│   │   │   │   │   ├── success/[orderNo]/page.tsx
│   │   │   │   │   └── failed/[orderNo]/page.tsx
│   │   │   │   └── (info)/
│   │   │   │       ├── about/page.tsx
│   │   │   │       ├── contact/page.tsx
│   │   │   │       ├── faq/page.tsx
│   │   │   │       ├── terms/page.tsx
│   │   │   │       ├── privacy/page.tsx
│   │   │   │       ├── shipping-policy/page.tsx
│   │   │   │       └── refund-policy/page.tsx
│   │   │   │
│   │   │   ├── (auth)/                        # Guests only
│   │   │   │   ├── layout.tsx                 # Split brand panel layout
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   ├── forgot-password/page.tsx
│   │   │   │   ├── reset-password/page.tsx
│   │   │   │   └── verify-email/page.tsx
│   │   │   │
│   │   │   ├── (account)/account/             # Login required
│   │   │   │   ├── layout.tsx                 # Account sidebar
│   │   │   │   ├── page.tsx                   # Dashboard
│   │   │   │   ├── profile/page.tsx
│   │   │   │   ├── addresses/page.tsx
│   │   │   │   ├── orders/page.tsx
│   │   │   │   ├── orders/[orderNo]/page.tsx
│   │   │   │   ├── wishlist/page.tsx
│   │   │   │   ├── security/page.tsx
│   │   │   │   └── reviews/page.tsx           # Phase 2
│   │   │   │
│   │   │   └── admin/                         # Admin / staff
│   │   │       ├── layout.tsx                 # Admin sidebar, role guard
│   │   │       ├── page.tsx                   # Dashboard
│   │   │       ├── products/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── new/page.tsx
│   │   │       │   └── [id]/edit/page.tsx
│   │   │       ├── categories/page.tsx
│   │   │       ├── orders/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/page.tsx
│   │   │       ├── customers/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/page.tsx
│   │   │       ├── inventory/page.tsx         # Phase 2
│   │   │       ├── coupons/page.tsx           # Phase 2
│   │   │       ├── reviews/page.tsx           # Phase 2
│   │   │       ├── banners/page.tsx           # Phase 2
│   │   │       ├── reports/page.tsx           # Phase 2
│   │   │       ├── audit-logs/page.tsx        # Phase 2
│   │   │       └── settings/page.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                            # Design-system primitives
│   │   │   │   ├── Button.tsx  Input.tsx  Select.tsx  Checkbox.tsx  Textarea.tsx
│   │   │   │   ├── Modal.tsx  Drawer.tsx  Dropdown.tsx  Tabs.tsx  Tooltip.tsx
│   │   │   │   ├── Toast.tsx  Badge.tsx  Pagination.tsx  Rating.tsx
│   │   │   │   ├── Skeleton.tsx  Spinner.tsx  Breadcrumbs.tsx  EmptyState.tsx
│   │   │   ├── motion/                        # Animation building blocks
│   │   │   │   ├── PageTransition.tsx
│   │   │   │   ├── Reveal.tsx                 # fade-up on scroll
│   │   │   │   ├── StaggerGroup.tsx           # staggered children (product grid)
│   │   │   │   ├── Parallax.tsx
│   │   │   │   ├── SmoothScroll.tsx           # Lenis provider
│   │   │   │   ├── ScrollProgress.tsx
│   │   │   │   ├── Counter.tsx                # count-up numbers
│   │   │   │   └── FlyToCart.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx  Footer.tsx  MegaMenu.tsx  MobileNav.tsx
│   │   │   │   ├── SearchBar.tsx  AccountMenu.tsx
│   │   │   │   ├── AccountSidebar.tsx  AdminSidebar.tsx  AdminTopbar.tsx
│   │   │   ├── home/                          # HeroSection, CategoryShowcase, FeaturedProducts, PromoBanner, Newsletter
│   │   │   ├── product/                       # ProductCard, ProductGrid, ProductGallery, VariantSelector,
│   │   │   │                                  # PriceTag, StockBadge, FilterSidebar, SortSelect, RelatedProducts, ReviewList
│   │   │   ├── cart/                          # CartDrawer, CartItem, CartSummary, CouponInput, MiniCartButton
│   │   │   ├── checkout/                      # Stepper, AddressStep, ShippingStep, PaymentStep, ReviewStep, OrderSummary
│   │   │   ├── account/                       # AddressForm, OrderCard, OrderTimeline, ProfileForm
│   │   │   ├── admin/                         # StatCard, SalesChart, DataTable, ProductForm, VariantEditor,
│   │   │   │                                  # ImageUploader, OrderStatusSelect, ConfirmDialog, FilterBar
│   │   │   └── common/                        # SEO (JSON-LD), ErrorBoundary, ProtectedRoute, RoleGuard
│   │   │
│   │   ├── lib/
│   │   │   ├── api/                           # client.ts (fetch + auto refresh), auth.ts, products.ts,
│   │   │   │                                  # cart.ts, orders.ts, admin.ts, uploads.ts
│   │   │   ├── motion/                        # config.ts (ease), variants.ts (fadeUp, stagger)
│   │   │   ├── auth/                          # token-store.ts, session.ts, guards.ts
│   │   │   ├── hooks/                         # useAuth, useCart, useDebounce, useScrollDirection, useMediaQuery
│   │   │   ├── utils/                         # formatPrice, cn, slugify, dates
│   │   │   └── constants.ts
│   │   ├── store/                             # cart.store.ts, ui.store.ts, auth.store.ts
│   │   ├── styles/tokens.css                  # Brand color tokens (#02110c, #1a422f, #f3ebd6)
│   │   ├── public/
│   │   │   ├── images/  icons/  textures/     # hero silk texture, logos, placeholders
│   │   │   └── favicon.ico
│   │   ├── tests/e2e/                         # Playwright: auth, browse, cart, checkout, admin, reduced-motion
│   │   ├── middleware.ts                      # Route protection and redirects
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.js
│   │   ├── next.config.mjs
│   │   ├── tsconfig.json
│   │   ├── .env.example
│   │   └── package.json
│   │
│   └── api/                                   # Node.js + Express/NestJS backend
│       ├── src/
│       │   ├── server.ts                      # Boots HTTP server
│       │   ├── app.ts                         # Express app: middleware + routes
│       │   ├── config/                        # env.ts (validated), cors.ts, logger.ts, redis.ts, stripe.ts
│       │   ├── common/
│       │   │   ├── middleware/                # authenticate.ts, authorize.ts, validate.ts, rateLimit.ts,
│       │   │   │                              # requestId.ts, errorHandler.ts, notFound.ts, upload.ts
│       │   │   ├── errors/                    # AppError.ts, httpErrors.ts, errorCodes.ts
│       │   │   ├── utils/                     # money.ts, slug.ts, pagination.ts, crypto.ts, orderNumber.ts
│       │   │   └── types/                     # express.d.ts (req.user), shared types
│       │   ├── modules/
│       │   │   ├── auth/                      # auth.routes.ts, auth.controller.ts, auth.service.ts,
│       │   │   │                              # token.service.ts, auth.schema.ts, auth.test.ts
│       │   │   ├── users/                     # profile, addresses, wishlist
│       │   │   ├── products/                  # products + variants + images, search, filters
│       │   │   ├── categories/
│       │   │   ├── brands/
│       │   │   ├── cart/                      # cart + merge + coupon apply
│       │   │   ├── orders/                    # create, list, cancel, status machine, history
│       │   │   ├── payments/
│       │   │   │   ├── payments.routes.ts     # includes /payments/webhook/:provider
│       │   │   │   ├── payments.service.ts
│       │   │   └── providers/             # stripe.provider.ts, cod.provider.ts, (regional).provider.ts
│       │   ├── modules/coupons/
│       │   ├── modules/reviews/
│       │   ├── modules/inventory/                 # movements, adjustments, low-stock
│       │   ├── modules/uploads/                   # signed upload URLs, image validation
│       │   ├── modules/banners/
│       │   ├── modules/settings/
│       │   ├── modules/notifications/
│       │   │   ├── email.service.ts
│       │   │   └── templates/             # welcome, verify, reset, order-confirmation, shipped, cancelled
│       │   ├── modules/admin/                     # stats.service.ts, reports.service.ts, audit.service.ts, admin.routes.ts
│       │   ├── modules/health/                    # GET /health
│       │   ├── jobs/
│       │   │   ├── queue.ts                   # BullMQ setup
│       │   │   ├── workers/                   # email.worker.ts
│       │   │   └── schedules/                 # orderExpiry.job.ts, abandonedCart.job.ts, cleanupTokens.job.ts
│       │   └── routes.ts                      # Mounts /api/v1 modules
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts                        # Admin user, categories, sample products
│       ├── test/
│       │   ├── unit/                          # pricing, stock, coupons, status transitions
│       │   ├── integration/                   # auth, cart, order creation, webhook
│       │   └── setup.ts
│       ├── docs/openapi.yaml                  # Swagger source, served at /api/docs
│       ├── Dockerfile
│       ├── .env.example
│       └── package.json
│
├── packages/
│   ├── shared/                                # Used by web and api
│   │   ├── src/schemas/                       # Zod: auth, product, cart, order, address
│   │   ├── src/types/                         # DTOs and enums (OrderStatus, Role)
│   │   ├── src/constants/                     # status labels, limits
│   │   └── package.json
│   └── config/                                # Shared tooling config
│       ├── eslint/  tsconfig/  tailwind-preset/
│       └── package.json
│
├── infra/
│   ├── docker/                                # Production Dockerfiles, compose helpers
│   ├── nginx/                                 # Reverse proxy config (if self-hosting)
│   └── scripts/                               # backup.sh, restore.sh, migrate.sh, seed.sh
│
├── docs/                                      # PRD.md, TRD.md, APP_FLOW.md, ARCHITECTURE.md, runbook.md
├── .github/
│   └── workflows/                             # ci.yml, deploy-staging.yml, deploy-production.yml
├── docker-compose.yml                         # Local: Postgres, Redis, API, web, mail catcher
├── docker-compose.prod.yml
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
├── .env.example
├── .gitignore
├── .editorconfig
├── .prettierrc
├── .eslintrc.cjs
└── README.md
```

---

## 5. Module Responsibilities (Backend)

| Module | Owns | Key rules |
|--------|------|-----------|
| auth | Register, login, refresh, logout, verify, reset | Argon2/bcrypt; refresh rotation with reuse detection; lockout |
| users | Profile, addresses, wishlist | Ownership checks on every query |
| products | Products, variants, images, search | Slug uniqueness; price in integer cents; only `active` shown publicly |
| categories / brands | Tree and filters | Cached; invalidated on admin change |
| cart | Server cart, guest merge | Re-validate price and stock on every read |
| orders | Create, status machine, history | Single transaction with row locks; price snapshot; 30-minute expiry |
| payments | Gateway intents, webhooks, COD | Signature verification; idempotent; webhook is the source of truth |
| coupons | Rules and usage limits | Validated server-side at quote and order time |
| reviews | Ratings | Verified buyers only; moderation queue |
| inventory | Stock movements | Every change written to `inventory_movements` |
| uploads | Signed uploads | MIME and size checks |
| notifications | Email templates and sending | Queued; retried on failure |
| admin | Stats, reports, audit log | Role-guarded; every write audited |

---

## 6. Frontend Component Architecture (Motion)

```
RootLayout (fonts, providers, MotionConfig reducedMotion="user")
 └─ template.tsx  -> PageTransition (fade + slide-up on each route change)
     └─ (shop)/layout
         ├─ SmoothScroll (Lenis, storefront only)
         ├─ Header (useScrollDirection: transparent -> solid, hide/show)
         ├─ <page content>
         │    ├─ HeroSection        -> Parallax + headline reveal
         │    ├─ Section blocks     -> <Reveal> (fade-up, once)
         │    └─ ProductGrid        -> <StaggerGroup> -> ProductCard (hover zoom, quick add)
         ├─ CartDrawer (AnimatePresence slide-in)
         └─ Footer
```

---

## 7. Environments and Deployment Topology

| Environment | Web | API | Database / Redis | Payments |
|-------------|-----|-----|------------------|----------|
| Local | `next dev` | `ts-node-dev` | Docker Compose | Gateway test mode |
| Staging | Vercel preview | Container (Railway / Render / ECS) | Managed Postgres and Redis | Sandbox keys |
| Production | Vercel production + CDN | Container with 2+ instances behind a load balancer | Managed Postgres (daily backups, PITR) and Redis | Live keys |

**Pipeline:** pull request -> lint, type-check, unit and integration tests, build -> merge to `main` -> build image, run migrations, deploy to staging, run Playwright smoke tests -> manual approval -> production deploy with health-check rollback.

---

## 8. Build Order Mapped to the Directory

| Step | Work | Folders touched |
|------|------|-----------------|
| 1 | Monorepo, Docker Compose, env validation, Prisma schema, seed | root, `apps/api/prisma`, `apps/api/config` |
| 2 | Auth (API then UI) | `modules/auth`, `app/(auth)`, `lib/auth`, `middleware.ts` |
| 3 | Design system, tokens, layout, motion primitives | `styles`, `components/ui`, `components/motion`, `components/layout` |
| 4 | Catalog API and storefront pages | `modules/products`, `categories`, `(shop)/products`, `(shop)/categories`, `product/` |
| 5 | Admin product and category CRUD, uploads | `modules/uploads`, `app/admin/products`, `components/admin` |
| 6 | Cart (server, guest merge, drawer) | `modules/cart`, `components/cart`, `store/cart.store.ts` |
| 7 | Orders, checkout, payments, webhooks, emails | `modules/orders`, `payments`, `notifications`, `components/checkout` |
| 8 | Account area and admin orders/customers/dashboard | `app/(account)`, `app/admin`, `modules/admin` |
| 9 | Home page, hero and scroll animations polish | `components/home`, `components/motion` |
| 10 | Security hardening, tests, performance and accessibility pass | `common/middleware`, `test/`, `tests/e2e` |
| 11 | Deployment, monitoring, backups, runbook | `.github/workflows`, `infra/`, `docs/` |
| 12 | Phase 2 features | per module |
