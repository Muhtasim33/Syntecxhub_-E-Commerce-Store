# Technical Requirements Document (TRD)
## E-Commerce Platform

**Version:** 1.1  **Status:** Draft  **Date:** 2026-11-06
**Companion documents:** PRD.md, APP_FLOW.md, ARCHITECTURE.md
**Changes in 1.1:** Added animation stack, design tokens and animation implementation rules (section 8.1 and 8.2).

---

## 1. Architecture Overview

```
                +-------------------+
   Browser ---> |  CDN / Vercel     |  Next.js frontend (SSR + CSR)
                +---------+---------+
                          | HTTPS (REST/JSON)
                +---------v---------+
                |  API Server       |  Node.js + Express (or NestJS)
                |  - Auth (JWT)     |
                |  - Business logic |
                +----+----+----+----+
                     |    |    |
          +----------+    |    +-----------+
          v               v                v
   PostgreSQL        Redis (cache,     Object storage
   (primary data)    rate limit,       (Cloudinary / S3)
                     queues)
                          |
                    Background worker  ---> Email provider (SendGrid/SES/Resend)
                          |
                    Payment gateway <--- Webhooks ---> API Server
```

**Style:** Modular monolith (one deployable backend with clear modules), which is simpler than microservices and sufficient for this scale. Modules can be split later.

---

## 2. Technology Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | Next.js 14+ (App Router), React, TypeScript, Tailwind CSS | SSR for SEO, fast pages |
| State/data | TanStack Query, Zustand (cart/UI state) | Caching and simple state |
| Forms/validation | React Hook Form + Zod | Shared schemas |
| Animation | Framer Motion (component and page transitions, scroll reveal), GSAP + ScrollTrigger (hero parallax, advanced scroll scenes), Lenis (smooth scroll) | Smooth, GPU-friendly motion; GSAP and Lenis loaded lazily |
| Design tokens | CSS variables + Tailwind theme extension | Single source for brand colors |
| Fonts | `next/font` (self-hosted serif + sans) | No layout shift, fast load |
| Backend | Node.js 20 LTS, Express or NestJS, TypeScript | Mature ecosystem |
| ORM | Prisma (or TypeORM) | Typed queries and migrations |
| Database | PostgreSQL 15+ | ACID transactions for orders and stock |
| Cache/queue | Redis, BullMQ | Caching, rate limits, email jobs |
| Auth | JWT (jsonwebtoken), bcrypt/argon2 | As required |
| Payments | Stripe (or regional gateway such as SSLCommerz / bKash / local gateways) | Hosted fields, webhooks |
| Files | Cloudinary or AWS S3 + CDN | Image optimization |
| Email | SendGrid / AWS SES / Resend | Transactional email |
| Testing | Jest/Vitest, Supertest, Playwright | Unit, API, E2E |
| Docs | Swagger/OpenAPI | API contract |
| CI/CD | GitHub Actions, Docker | Automation |
| Hosting | Vercel (frontend); Railway / Render / AWS ECS (backend); managed Postgres and Redis | Production |
| Monitoring | Sentry, Pino logs, UptimeRobot / Better Stack | Observability |

---

## 3. Repository Structure

> The complete, file-level directory tree and layer responsibilities are in **ARCHITECTURE.md**. The tree below is a summary.

```
ecommerce/
  apps/
    web/                    # Next.js storefront + admin UI
      app/
        (shop)/             # public pages
        (account)/          # customer pages
        admin/              # admin pages
        api/                # (optional) route handlers
      components/
      lib/
      store/                # Zustand
    api/                    # Express/NestJS backend
      src/
        modules/
          auth/ users/ products/ categories/ cart/
          orders/ payments/ coupons/ reviews/
          admin/ uploads/ notifications/
        common/             # middleware, guards, errors, utils
        config/
        jobs/               # background workers
        prisma/             # schema + migrations + seed
      test/
  packages/
    shared/                 # shared types and Zod schemas
  docker-compose.yml
  .github/workflows/
```

---

## 4. Data Model (PostgreSQL)

### 4.1 Core tables
```
users(id, name, email UNIQUE, password_hash, role ENUM[customer,staff,admin],
      email_verified_at, is_blocked, failed_logins, locked_until,
      created_at, updated_at)

refresh_tokens(id, user_id FK, token_hash, user_agent, ip, expires_at,
               revoked_at, created_at)

password_resets(id, user_id FK, token_hash, expires_at, used_at)
email_verifications(id, user_id FK, token_hash, expires_at, used_at)

addresses(id, user_id FK, full_name, phone, line1, line2, city, state,
          postal_code, country, is_default)

categories(id, parent_id FK NULL, name, slug UNIQUE, image_url, sort_order, is_active)
brands(id, name, slug UNIQUE, logo_url)

products(id, category_id FK, brand_id FK NULL, name, slug UNIQUE, description,
         base_price_cents, status ENUM[draft,active,archived],
         avg_rating, review_count, meta_title, meta_description,
         created_at, updated_at)

product_images(id, product_id FK, url, alt, sort_order)

product_variants(id, product_id FK, sku UNIQUE, option_values JSONB,
                 price_cents, compare_at_price_cents NULL,
                 stock_quantity, reserved_quantity, low_stock_threshold)

carts(id, user_id FK NULL, session_id NULL, created_at, updated_at)
cart_items(id, cart_id FK, variant_id FK, quantity, UNIQUE(cart_id, variant_id))

orders(id, order_number UNIQUE, user_id FK NULL, email,
       status ENUM[pending,paid,processing,shipped,delivered,cancelled,refunded],
       payment_status ENUM[unpaid,paid,failed,refunded],
       payment_method ENUM[card,cod,...],
       subtotal_cents, discount_cents, shipping_cents, tax_cents, total_cents,
       currency, shipping_address JSONB, billing_address JSONB,
       coupon_code NULL, tracking_number NULL, courier NULL,
       expires_at NULL, created_at, updated_at)

order_items(id, order_id FK, variant_id FK, product_name, variant_label,
            sku, unit_price_cents, quantity, line_total_cents)

order_status_history(id, order_id FK, from_status, to_status, note,
                     changed_by FK NULL, created_at)

payments(id, order_id FK, provider, provider_payment_id UNIQUE,
         amount_cents, currency, status, raw_payload JSONB, created_at)

coupons(id, code UNIQUE, type ENUM[percent,fixed], value, min_order_cents,
        max_uses, used_count, per_user_limit, starts_at, expires_at, is_active)

reviews(id, product_id FK, user_id FK, order_id FK, rating 1-5, title,
        body, status ENUM[pending,approved,rejected], created_at,
        UNIQUE(product_id, user_id))

wishlist_items(user_id FK, product_id FK, created_at, PK(user_id, product_id))

inventory_movements(id, variant_id FK, change, reason, reference_id,
                    created_by FK, created_at)

banners(id, title, image_url, link_url, position, is_active, sort_order)
audit_logs(id, actor_id FK, action, entity, entity_id, metadata JSONB,
           ip, created_at)
settings(key PK, value JSONB)
```

### 4.2 Indexes
- `products(slug)`, `products(category_id, status)`, GIN full-text index on `products(name, description)` (or `pg_trgm`)
- `product_variants(sku)`, `product_variants(product_id)`
- `orders(user_id, created_at DESC)`, `orders(status, created_at)`, `orders(order_number)`
- `refresh_tokens(token_hash)`, `users(email)`

### 4.3 Integrity rules
- Money as integer minor units.
- Check constraint: `stock_quantity >= 0`, `reserved_quantity >= 0`.
- Foreign keys with appropriate `ON DELETE` (orders never cascade-delete from users; use soft-delete or anonymization).

---

## 5. Authentication and Authorization Design

### 5.1 Token strategy
| Token | Lifetime | Storage | Notes |
|-------|----------|---------|-------|
| Access JWT | 15 min | In memory on client; sent as `Authorization: Bearer` | Claims: `sub`, `role`, `iat`, `exp` |
| Refresh token | 7-30 days | httpOnly, Secure, SameSite=Lax cookie; only a hash stored in DB | Rotated on every use; reuse detection revokes the whole family |

### 5.2 Flows
1. **Register:** validate, hash password (argon2/bcrypt cost 12), create user, send verification email.
2. **Login:** verify credentials, check `is_blocked` and lockout, issue access and refresh tokens.
3. **Refresh:** validate cookie token hash, rotate, return new access token.
4. **Logout:** revoke the refresh token, clear the cookie.
5. **Reset password:** random 32-byte token emailed (hash stored, 1 hour expiry), single use, revokes all sessions after reset.

### 5.3 Authorization
- Middleware `authenticate` (verifies JWT) and `authorize(...roles)` (checks role).
- Ownership checks: customers can access only their own orders, addresses, cart.
- Admin routes under `/api/v1/admin/*` require role `admin` (or `staff` for a subset).
- Next.js middleware protects `/account/*` and `/admin/*` routes for UX; the API remains the source of truth.

---

## 6. API Specification (REST, `/api/v1`)

Standard response: `{ "data": ..., "meta": { page, limit, total } }`; errors: `{ "error": { "code", "message", "details" } }`.

### 6.1 Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| POST | `/auth/refresh` | Cookie |
| POST | `/auth/logout` | Auth |
| POST | `/auth/verify-email` | Public (token) |
| POST | `/auth/resend-verification` | Auth |
| POST | `/auth/forgot-password` | Public |
| POST | `/auth/reset-password` | Public (token) |
| GET | `/auth/me` | Auth |

### 6.2 Customer account
| Method | Endpoint |
|--------|----------|
| GET/PATCH | `/users/me` |
| POST | `/users/me/change-password` |
| GET/POST | `/users/me/addresses` |
| PATCH/DELETE | `/users/me/addresses/:id` |
| GET/POST/DELETE | `/users/me/wishlist` |

### 6.3 Catalog (public)
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/products` | Query: `q, category, brand, minPrice, maxPrice, rating, sort, page, limit` |
| GET | `/products/:slug` | Includes variants, images |
| GET | `/products/:slug/related` | |
| GET | `/products/:id/reviews` | |
| GET | `/categories` | Tree |
| GET | `/categories/:slug` | |
| GET | `/search/suggest?q=` | Autocomplete |

### 6.4 Cart
| Method | Endpoint |
|--------|----------|
| GET | `/cart` |
| POST | `/cart/items` |
| PATCH | `/cart/items/:id` |
| DELETE | `/cart/items/:id` |
| POST | `/cart/merge` (guest to user on login) |
| POST | `/cart/coupon` / DELETE `/cart/coupon` |

### 6.5 Checkout and orders
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/checkout/quote` | Totals, shipping options, tax |
| POST | `/orders` | Creates order, reserves stock, returns payment intent / redirect |
| GET | `/orders` | Own orders |
| GET | `/orders/:orderNumber` | Own order |
| POST | `/orders/:orderNumber/cancel` | If cancellable |
| POST | `/orders/:orderNumber/return` | Phase 2 |
| POST | `/payments/webhook/:provider` | Signature verified, public route |

### 6.6 Reviews
| Method | Endpoint |
|--------|----------|
| POST | `/products/:id/reviews` (verified buyers) |
| PATCH/DELETE | `/reviews/:id` (own) |

### 6.7 Admin (role: admin/staff)
| Resource | Endpoints |
|----------|-----------|
| Dashboard | `GET /admin/stats?from=&to=` |
| Products | `GET/POST /admin/products`, `GET/PATCH/DELETE /admin/products/:id`, variants sub-routes, `POST /admin/products/bulk`, `POST /admin/products/import`, `GET /admin/products/export` |
| Uploads | `POST /admin/uploads/sign` (signed upload) or `POST /admin/uploads` |
| Categories | `GET/POST /admin/categories`, `PATCH/DELETE /admin/categories/:id` |
| Orders | `GET /admin/orders`, `GET /admin/orders/:id`, `PATCH /admin/orders/:id/status`, `POST /admin/orders/:id/refund`, `GET /admin/orders/:id/invoice` |
| Users | `GET /admin/users`, `PATCH /admin/users/:id` (block, role) |
| Inventory | `GET /admin/inventory`, `POST /admin/inventory/adjust` |
| Coupons | CRUD `/admin/coupons` |
| Reviews | `GET /admin/reviews`, `PATCH /admin/reviews/:id` (approve/reject) |
| Banners | CRUD `/admin/banners` |
| Reports | `GET /admin/reports/sales`, `/reports/products`, `/reports/customers` |
| Settings | `GET/PATCH /admin/settings` |
| Audit | `GET /admin/audit-logs` |

---

## 7. Critical Flow Designs

### 7.1 Checkout and payment (online)
1. Client calls `POST /checkout/quote` to display totals.
2. Client calls `POST /orders`. In **one DB transaction** the server:
   - re-reads current prices and stock (row locks with `SELECT ... FOR UPDATE` on variants),
   - rejects if stock is insufficient,
   - increments `reserved_quantity`,
   - creates the order (`status=pending`, `expires_at = now + 30 min`) and order items with price snapshots.
3. Server creates a payment intent (Stripe) or hosted payment session and returns the client secret / redirect URL.
4. Customer pays on the hosted form (card data never touches our server).
5. Gateway calls `POST /payments/webhook`. The server verifies the signature, checks idempotency by `provider_payment_id`, then in a transaction: marks the payment and order paid, converts reserved stock into a stock decrement, clears the cart, queues the confirmation email.
6. A scheduled job every 5 minutes cancels expired unpaid orders and releases reserved stock.
7. The frontend never trusts the redirect alone; the order page reflects the server status set by the webhook.

### 7.2 Cash on Delivery
Order created as `processing` with `payment_status=unpaid`; stock decremented immediately; admin marks the payment as paid upon delivery.

### 7.3 Guest-to-user cart merge
On login, the client sends the local cart to `POST /cart/merge`; the server adds quantities (capped by stock) to the user cart, then the client clears local storage.

### 7.4 Order status transitions
```
pending -> paid -> processing -> shipped -> delivered
pending|paid|processing -> cancelled
paid|processing|shipped|delivered -> refunded (Phase 2)
```
Invalid transitions are rejected; each change writes `order_status_history` and triggers an email job.

---

## 8. Frontend Technical Requirements
- Rendering: SSG/ISR for home and category pages, SSR for product detail (fresh stock), CSR for account and admin.
- Route protection via Next.js middleware (checks refresh/session cookie) plus API authorization.
- Axios/fetch client with interceptor: on 401, call `/auth/refresh` once, retry, otherwise redirect to `/login?redirect=<path>`.
- Image handling: `next/image`, responsive sizes, WebP/AVIF through the CDN.
- SEO: dynamic metadata, `sitemap.xml`, `robots.txt`, JSON-LD (Product, BreadcrumbList).
- Accessibility: semantic HTML, keyboard navigation, focus management in modals and drawers.
- Error and loading states for every data view; optimistic updates for cart actions.

### 8.1 Design tokens (colors)
Defined in `styles/tokens.css` and mapped into `tailwind.config.ts`:
```css
:root {
  --color-emerald-950: #02110c;   /* Dark Emerald Green: header, footer, dark sections, text */
  --color-olive-800:   #1a422f;   /* Olive Green: primary buttons, links, active states */
  --color-cream-100:   #f3ebd6;   /* Cream Beige: page background, cards, text on dark */

  /* proposed supporting tokens */
  --color-olive-700:   #25593f;   /* hover */
  --color-cream-300:   #e2d7bb;   /* borders, dividers */
  --color-muted:       #4a5a50;   /* secondary text */
  --color-gold-400:    #c9a96e;   /* optional accent */
  --color-success: #2f7d4f; --color-warning: #b7791f; --color-danger: #b3402f;

  /* semantic aliases used by components */
  --bg-page: var(--color-cream-100);
  --bg-inverse: var(--color-emerald-950);
  --text-body: var(--color-emerald-950);
  --text-inverse: var(--color-cream-100);
  --btn-primary-bg: var(--color-olive-800);
  --btn-primary-hover: var(--color-olive-700);
}
```
```ts
// tailwind.config.ts (excerpt)
theme: { extend: { colors: {
  emerald: { 950: 'var(--color-emerald-950)' },
  olive:   { 700: 'var(--color-olive-700)', 800: 'var(--color-olive-800)' },
  cream:   { 100: 'var(--color-cream-100)', 300: 'var(--color-cream-300)' },
  gold:    { 400: 'var(--color-gold-400)' },
}}}
```
Components use semantic classes (`bg-page`, `text-body`, `bg-primary`) rather than raw hex values. Use Tailwind logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `text-start`) to keep RTL support easy.

### 8.2 Animation implementation
| Feature | Implementation |
|---------|----------------|
| Page transitions | `app/template.tsx` wraps children in a Framer Motion `motion.div` (opacity 0 to 1, y 16 to 0, 0.4 s). `template.tsx` re-mounts on each navigation, which triggers the enter animation. For exit animations, use the browser View Transitions API where supported, with the enter animation as the fallback. |
| Scroll reveal | Reusable `<Reveal>` component using `whileInView` with `viewport={{ once: true, amount: 0.2 }}` and shared variants from `lib/motion/variants.ts`. |
| Product grid stagger | `<StaggerGroup>` parent with `staggerChildren: 0.08`; each `ProductCard` is a `motion` child. Newly appended pages of products animate in using the same variants. Stagger is capped (max 12 items delayed per batch). |
| Hero parallax | GSAP ScrollTrigger (or Framer Motion `useScroll` + `useTransform`) moving the background layer at a lower speed; loaded with `next/dynamic` only on the home page. |
| Smooth scroll | `<SmoothScroll>` provider using Lenis, mounted in the storefront layout only (not admin); synchronized with ScrollTrigger; disabled when `prefers-reduced-motion` is set or on touch devices if it hurts native feel. |
| Header behavior | `useScroll` + direction detection: transparent at top, solid `emerald-950` after 80 px, hide on scroll down, show on scroll up. |
| Cart feedback | Drawer uses Framer Motion `AnimatePresence` slide-in; add-to-cart triggers a small fly-to-cart animation and a count bump. |
| Skeletons | CSS shimmer (transform-based gradient) in `components/ui/Skeleton`. |
| Admin counters / charts | Count-up on stat cards; chart library built-in animation only. |

Shared motion config (`lib/motion/config.ts`):
```ts
export const ease = [0.22, 1, 0.36, 1];            // smooth ease-out
export const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };
export const stagger = { show: { transition: { staggerChildren: 0.08 } } };
```

Performance and accessibility rules for animation:
- Animate only `transform` and `opacity`; never animate `width`, `height`, `top` or `left`. Use `will-change` sparingly.
- Wrap the app in Framer Motion `MotionConfig reducedMotion="user"`; GSAP and Lenis check `matchMedia('(prefers-reduced-motion: reduce)')` and skip setup.
- Do not hide the LCP element (hero image, first product images) behind an opacity-0 start state; they render visible and only decorative layers animate.
- Reserve image dimensions (`next/image` width/height or aspect-ratio) so reveals cause no layout shift.
- Code-split GSAP, ScrollTrigger and Lenis (`next/dynamic`, `ssr: false`); animation JavaScript budget under about 60 KB gzipped on the critical path.
- Server components render content; only small client components handle motion, so SEO content is present in the initial HTML.
- Verify with Lighthouse and the Chrome Performance panel: no long tasks caused by scroll handlers, CLS under 0.1, 60 fps scrolling on a mid-range phone.
- Add a Playwright test with reduced motion enabled to confirm content is visible and usable without animation.

---

## 9. Security Requirements
| Area | Control |
|------|---------|
| Transport | HTTPS everywhere, HSTS, secure cookies |
| Passwords | argon2/bcrypt; minimum length 8 plus breach-list check (optional) |
| Input | Zod validation on every endpoint; parameterized queries via ORM |
| XSS | Output escaping, sanitize rich-text descriptions, Content Security Policy |
| CSRF | SameSite cookies; refresh endpoint requires a CSRF header or origin check |
| Rate limiting | Redis-based: login (5/min per IP+email), register, forgot password, general API |
| Headers | `helmet` defaults, strict CORS allow-list |
| Uploads | MIME and size validation, signed uploads, no executable types |
| Payments | Hosted fields only; verify webhook signatures; idempotency keys |
| Secrets | Environment variables or a secrets manager; never in the repo |
| Admin | Strong passwords, optional TOTP 2FA, audit logging |
| Dependencies | `npm audit`, Dependabot, lockfiles |
| Data | Least-privilege DB user, encrypted backups, PII minimization |
| Errors | Generic messages to clients; detailed logs server-side only |

---

## 10. Performance and Scalability
- DB: proper indexes, pagination everywhere (cursor or offset with limit cap), avoid N+1 queries.
- Cache (Redis): category tree, homepage content, product list pages (short TTL, invalidate on admin change).
- CDN for static assets and images; HTTP caching headers.
- Stateless API instances behind a load balancer; sessions are not held in memory.
- Background jobs (BullMQ) for emails, order expiry, report generation, image processing.
- Targets: API p95 under 500 ms, LCP under 2.5 s, TTFB under 600 ms.

---

## 11. Deployment and DevOps

### 11.1 Environments
| Env | Purpose |
|-----|---------|
| Local | Docker Compose: Postgres, Redis, API, web |
| Staging | Mirrors production, sandbox payment keys |
| Production | Live traffic |

### 11.2 CI/CD (GitHub Actions)
1. On pull request: install, lint, type-check, unit and API tests, build.
2. On merge to `main`: build Docker image, run migrations, deploy to staging, run E2E smoke tests.
3. Manual approval promotes to production; automatic rollback on failed health check.

### 11.3 Production setup
- Domain with DNS, SSL (automatic via Vercel / load balancer).
- Managed PostgreSQL with daily snapshots and point-in-time recovery; tested restore procedure.
- Managed Redis.
- Environment variables per environment.
- Health endpoint `GET /health` (DB and Redis checks) for load balancer and uptime monitor.
- Database migrations run as a pre-deploy step; backward-compatible migrations only.

### 11.4 Environment variables (example)
```
NODE_ENV, PORT, APP_URL, API_URL
DATABASE_URL, REDIS_URL
JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, ACCESS_TTL=15m, REFRESH_TTL=7d
COOKIE_DOMAIN, CORS_ORIGINS
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLIC_KEY
CLOUDINARY_URL (or S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
EMAIL_PROVIDER_API_KEY, EMAIL_FROM
SENTRY_DSN
```

### 11.5 Monitoring and logging
- Sentry for frontend and backend errors.
- Structured JSON logs (Pino) with request IDs; no secrets or PII in logs.
- Uptime checks, alerts on error rate, latency, failed payments, queue backlog.

---

## 12. Testing Strategy
| Level | Tools | Scope |
|-------|-------|-------|
| Unit | Jest/Vitest | Pricing, stock, coupon, status-transition logic |
| API/integration | Supertest + test DB | Auth, cart, order creation, webhook handling |
| E2E | Playwright | Register, browse, add to cart, checkout (sandbox), admin product and order flow |
| Security | npm audit, OWASP ZAP baseline | Pre-launch scan |
| Load | k6 | Browse and checkout under expected peak (e.g. 200 concurrent users) |
| Concurrency | Custom test | Two buyers purchasing the last item: exactly one succeeds |

Coverage goal: 70%+ on business logic; all P0 flows covered by E2E.

---

## 13. Documentation Deliverables
- OpenAPI/Swagger at `/api/docs`
- README with local setup, env vars, scripts
- Architecture and ER diagram
- Runbook: deploy, rollback, restore backup, rotate secrets

---

## 14. Technical Risks and Decisions
| Decision | Rationale |
|----------|-----------|
| PostgreSQL over MongoDB | Strong transactions for stock and orders |
| Modular monolith | Lower operational cost; easy to split later |
| Webhook-confirmed payments | Prevents fake "success" redirects |
| Refresh token rotation with reuse detection | Limits damage from token theft |
| Integer money values | Avoids rounding errors |
| Price snapshot in `order_items` | Historical accuracy |
