# App Flow and Page Navigation
## E-Commerce Platform

**Version:** 1.1
**Companion documents:** PRD.md, TRD.md, ARCHITECTURE.md
**Changes in 1.1:** Added brand theme per page area and section 9 (page transitions and scroll animation behavior).

This document defines every page, its URL, who can access it, where it links to, and the redirect rules. Use it as the single source of truth for routing.

---

## 1. Site Map

```
PUBLIC (Guest + Customer)
/                              Home
/products                      All products (search, filters, sort)
/categories/[slug]             Category listing
/products/[slug]               Product detail
/search?q=                     Search results
/cart                          Cart
/checkout                      Checkout (login or guest, see rules)
/checkout/success/[orderNo]    Order confirmation
/checkout/failed/[orderNo]     Payment failed / retry
/about  /contact  /faq
/terms  /privacy  /shipping-policy  /refund-policy

AUTH (guests only; logged-in users are redirected away)
/login
/register
/forgot-password
/reset-password?token=
/verify-email?token=

CUSTOMER (login required)
/account                       Dashboard
/account/profile
/account/addresses
/account/orders
/account/orders/[orderNo]      Order detail + tracking
/account/wishlist
/account/security              Change password
/account/reviews               (Phase 2)

ADMIN (role: admin / staff)
/admin                         Dashboard
/admin/products
/admin/products/new
/admin/products/[id]/edit
/admin/categories
/admin/orders
/admin/orders/[id]
/admin/customers
/admin/customers/[id]
/admin/inventory               (Phase 2)
/admin/coupons                 (Phase 2)
/admin/reviews                 (Phase 2)
/admin/banners                 (Phase 2)
/admin/reports                 (Phase 2)
/admin/audit-logs              (Phase 2)
/admin/settings

SYSTEM
/403 Forbidden     /404 Not Found     /500 Error     /maintenance
```

---

## 2. Route Access Rules

| Route group | Guest | Customer | Staff | Admin | If denied |
|-------------|:----:|:--------:|:-----:|:-----:|-----------|
| Public pages | Yes | Yes | Yes | Yes | n/a |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Yes | No | No | No | Redirect to `/account` (admin/staff to `/admin`) |
| `/checkout` | Prompt (login or guest checkout in Phase 2) | Yes | Yes | Yes | MVP: redirect to `/login?redirect=/checkout` |
| `/account/*` | No | Yes | Yes | Yes | Redirect to `/login?redirect=<path>` |
| `/admin/*` (most) | No | No | Yes | Yes | Not logged in: `/login?redirect=<path>`; logged in without role: `/403` |
| `/admin/customers`, `/admin/settings`, `/admin/reports`, `/admin/audit-logs` | No | No | No | Yes | `/403` |

**Redirect rule after login:** go to the `redirect` query param if present and same-origin; otherwise Customer goes to `/account` (or previous page), Admin/Staff goes to `/admin`.

---

## 3. Global Navigation

### 3.1 Storefront header (all public pages)
```
[Logo -> /]  [Categories dropdown -> /categories/[slug]]  [Search bar -> /search?q=]
                         [Wishlist -> /account/wishlist]  [Account menu]  [Cart (count) -> /cart]
```
- **Account menu (guest):** Login -> `/login`, Register -> `/register`
- **Account menu (customer):** My Account -> `/account`, Orders -> `/account/orders`, Wishlist, Logout
- **Account menu (admin/staff):** adds Admin Panel -> `/admin`
- **Cart icon:** opens mini-cart drawer; "View cart" -> `/cart`, "Checkout" -> `/checkout`

### 3.2 Footer
About, Contact, FAQ, Shipping policy, Refund policy, Terms, Privacy, newsletter signup.

### 3.3 Account sidebar (`/account/*`)
Dashboard, Profile, Addresses, Orders, Wishlist, Security, Logout.

### 3.4 Admin sidebar (`/admin/*`)
Dashboard, Products, Categories, Orders, Customers, Inventory, Coupons, Reviews, Banners, Reports, Audit logs, Settings, Back to store (`/`), Logout.

---

## 4. Core User Flows

### 4.1 Guest browsing to purchase (main flow)

```mermaid
flowchart TD
    A[Home /] --> B[Category page /categories/slug]
    A --> S[Search /search?q=]
    B --> P[Product detail /products/slug]
    S --> P
    A --> P
    P -->|Add to cart| C[Mini cart drawer]
    C -->|View cart| D[/cart]
    C -->|Continue shopping| B
    D -->|Checkout| E{Logged in?}
    E -->|No| F[/login?redirect=/checkout]
    F -->|Login success| G[/checkout]
    F -->|No account| R[/register]
    R -->|Registered, verify email prompt| F
    E -->|Yes| G
    G --> G1[Step 1: Address]
    G1 --> G2[Step 2: Shipping method]
    G2 --> G3[Step 3: Payment]
    G3 --> G4[Step 4: Review and place order]
    G4 -->|Online payment| H[Gateway hosted payment]
    G4 -->|Cash on delivery| I[/checkout/success/orderNo]
    H -->|Webhook confirms paid| I
    H -->|Failed or cancelled| J[/checkout/failed/orderNo]
    J -->|Retry payment| H
    J -->|Back to cart| D
    I --> K[/account/orders/orderNo]
    I --> A
```

### 4.2 Registration and verification

```mermaid
flowchart TD
    A[/register] -->|Submit valid form| B[Account created]
    B --> C[Message: check your email]
    C --> D[Email link: /verify-email?token=]
    D -->|Valid| E[Verified, redirect /login or /account]
    D -->|Expired| F[Resend verification]
    F --> C
    A -->|Email exists| A2[Inline error, link to /login]
```

### 4.3 Login, session and logout

```mermaid
flowchart TD
    A[/login] -->|Valid credentials| B{Role}
    B -->|Customer| C[redirect param or /account]
    B -->|Admin or Staff| D[redirect param or /admin]
    A -->|Invalid| A1[Inline error, attempts counted]
    A1 -->|Too many attempts| A2[Temporary lockout message]
    A -->|Forgot password| FP[/forgot-password]
    FP --> FP1[Email sent confirmation]
    FP1 --> RP[/reset-password?token=]
    RP -->|Success| A
    C --> L[Logout]
    D --> L
    L --> H[Home /]
```

**Silent session handling:** when an API call returns 401, the app calls refresh once. If refresh succeeds, the request is retried; if it fails, the user is sent to `/login?redirect=<current path>` with a "session expired" message.

### 4.4 Cart behavior
- Add to cart from product page or listing; variant must be selected first (size, color), otherwise show an inline prompt.
- `/cart`: change quantity, remove, apply coupon (Phase 2), see totals, "Proceed to checkout".
- Out-of-stock or price-changed items are flagged on `/cart` and block checkout until fixed.
- Guest cart lives in the browser; on login it is merged into the account cart.
- Empty cart shows "Continue shopping" -> `/products`.

### 4.5 Checkout steps (single page, 4 steps)
| Step | Content | Next | Back |
|------|---------|------|------|
| 1. Address | Choose saved address or add new | Step 2 | `/cart` |
| 2. Shipping | Shipping method and cost | Step 3 | Step 1 |
| 3. Payment | Card (hosted fields) or COD | Step 4 | Step 2 |
| 4. Review | Items, totals, place order | Gateway or `/checkout/success/[orderNo]` | Step 3 |

Rules: unverified email users are asked to verify before placing an order; if the cart becomes empty, redirect to `/cart`; stock is re-checked when placing the order.

### 4.6 Order tracking (customer)
`/account` -> `/account/orders` -> `/account/orders/[orderNo]` shows the status timeline (Pending, Paid, Processing, Shipped, Delivered), tracking number, items, addresses, "Cancel order" (only if allowed), "Request return" (Phase 2), "Write a review" (Delivered items, Phase 2).

---

## 5. Admin Flows

### 5.1 Admin navigation overview

```mermaid
flowchart TD
    L[/login] -->|Admin or Staff| D[/admin Dashboard]
    D --> P[/admin/products]
    D --> O[/admin/orders]
    D --> CU[/admin/customers]
    D --> CA[/admin/categories]
    D --> ST[/admin/settings]
    D -->|Low stock alert| P
    D -->|Recent order| OD[/admin/orders/id]
    P --> PN[/admin/products/new]
    P --> PE[/admin/products/id/edit]
    PN -->|Save| P
    PE -->|Save or Delete| P
    O --> OD
    OD -->|Update status, add tracking| OD
    OD -->|Print invoice or packing slip| PR[Print view]
    OD --> O
    CU --> CD[/admin/customers/id]
```

### 5.2 Product management flow
1. `/admin/products`: search, filter by category or status, bulk actions (publish, unpublish, delete), "Add product".
2. `/admin/products/new`: basic info, category, images (upload with preview and reorder), variants and stock, SEO fields, status (Draft or Active). **Save** returns to the list with a success message; validation errors are shown inline and the form is not lost.
3. `/admin/products/[id]/edit`: same form prefilled; delete requires a confirmation dialog.

### 5.3 Order management flow
1. `/admin/orders`: filter by status, date, payment status; search by order number or email.
2. `/admin/orders/[id]`: customer, items, addresses, payment info, status history.
3. Actions allowed depend on current status (invalid transitions are hidden):
   - Pending: mark paid (COD), cancel
   - Paid: move to Processing, cancel
   - Processing: add tracking and mark Shipped, cancel
   - Shipped: mark Delivered
4. Each status change prompts for an optional note and triggers a customer email.

### 5.4 Admin dashboard widgets
Revenue and orders (today / 7 / 30 days), new customers, orders by status, sales chart, top products, low-stock list (links to product edit), recent orders (links to order detail).

---

## 6. Page-by-Page Navigation Table

| Page | Main elements | Navigates to |
|------|---------------|--------------|
| `/` | Hero banners, featured categories, new arrivals, best sellers | Category, product, `/products` |
| `/products` | Product grid, filters, sort, pagination | Product detail, cart (quick add) |
| `/categories/[slug]` | Breadcrumb, subcategories, grid, filters | Product detail, parent category |
| `/products/[slug]` | Gallery, variants, price, stock, add to cart, wishlist, reviews, related | `/cart`, `/login` (wishlist when logged out), related products, category (breadcrumb) |
| `/search` | Results, filters, "no results" suggestions | Product detail |
| `/cart` | Items, quantities, coupon, totals | `/checkout`, `/products`, product detail |
| `/checkout` | 4-step form, order summary | `/checkout/success/...`, gateway, `/cart` |
| `/checkout/success/[orderNo]` | Confirmation, order summary | `/account/orders/[orderNo]`, `/` |
| `/checkout/failed/[orderNo]` | Error reason, retry | Gateway retry, `/cart`, `/contact` |
| `/login` | Email, password, forgot link | `/register`, `/forgot-password`, redirect target |
| `/register` | Name, email, password | `/login`, verification message |
| `/account` | Summary, recent orders, quick links | Profile, orders, addresses |
| `/account/profile` | Edit name, phone | `/account/security` |
| `/account/addresses` | List, add, edit, delete, default | Back to `/account` or `/checkout` if opened from checkout |
| `/account/orders` | Order list with status | Order detail |
| `/account/orders/[orderNo]` | Timeline, items, actions | Product detail (reorder or review), `/contact` |
| `/account/wishlist` | Saved items | Product detail, add to cart |
| `/admin/*` | See section 5 | See section 5 |

---

## 7. Edge Cases and System Pages

| Situation | Behavior |
|-----------|----------|
| Unknown URL | `/404` with search box and link to home |
| Product unpublished or deleted | `/404` (or "no longer available" with related products) |
| Out-of-stock product | Detail page shows "Out of stock", add-to-cart disabled, optional "Notify me" (Phase 2) |
| Access to another user's order | `/403` or `/404` (do not reveal existence) |
| Customer opens `/admin` | `/403` |
| Server error | `/500` with retry and support link; error logged to Sentry |
| Payment webhook delayed | Success page shows "Confirming payment..." and polls the order status for up to 60 seconds |
| User closes gateway tab | Order stays Pending; user can resume payment from `/account/orders/[orderNo]` until it expires (30 min) |
| Session expired mid-checkout | Redirect to login with `redirect=/checkout`; cart and progress are preserved |
| Maintenance mode | All public routes show `/maintenance`; admin remains accessible |
| Offline or slow network | Friendly retry message; cart state kept locally |

---

## 8. Navigation Rules Summary
1. Every page has a header, and the cart count is always visible.
2. Breadcrumbs appear on category, product and account pages.
3. Protected pages never flash content: show a loading state, then redirect if unauthorized.
4. Redirect targets are validated to be same-origin to avoid open-redirect attacks.
5. After any destructive action (delete, cancel) a confirmation dialog is required.
6. The browser Back button must work naturally in checkout steps (each step is reflected in the URL hash or query, e.g. `/checkout?step=2`).
7. Success and error feedback uses toast messages and inline field errors.
8. Admin and storefront use separate layouts; admin always provides a "Back to store" link.

---

## 9. Page Transitions, Scroll Animation and Theme

### 9.1 Brand colors by area
| Area | Background | Text | Primary action | Notes |
|------|-----------|------|----------------|-------|
| Header | Transparent over hero, then Dark Emerald `#02110c` | Cream `#f3ebd6` | n/a | Solid after about 80 px of scroll |
| Hero and feature bands | Dark Emerald / Olive `#1a422f` with imagery | Cream | Cream button on dark | Large imagery, parallax |
| Main storefront content | Cream `#f3ebd6` | Dark Emerald | Olive button, lighter olive on hover | Cards on cream with soft border |
| Footer | Dark Emerald | Cream | Cream links | |
| Auth pages | Split layout: Dark Emerald brand panel + Cream form panel | | Olive button | |
| Account area | Cream | Dark Emerald | Olive | Active sidebar item in Olive |
| Admin | Dark Emerald sidebar, Cream content area | | Olive | Minimal motion |

### 9.2 Page transition behavior (storefront)
| Navigation | Transition |
|------------|-----------|
| Any route to another route | Outgoing content fades; incoming page fades in and slides up slightly (about 0.4 s). Scroll position resets to top on new pages; Back button restores the previous scroll position. |
| Category or product grid to product detail | Product image can expand smoothly into the detail gallery (shared element, where supported); fallback is the standard fade. |
| Checkout step to step | Horizontal slide between steps, progress bar fills smoothly. |
| Cart drawer open/close | Slides in from the right (from the left in RTL), page behind dims. |
| Login or register to account | Standard fade, success toast. |
| Admin routes | Instant or very short fade only. |

### 9.3 Scroll animation per page
| Page | Scroll behavior |
|------|-----------------|
| `/` Home | Hero background parallax and headline reveal on load; each section (categories, new arrivals, best sellers, banner, newsletter) fades up when entering view; product rows stagger in; header changes from transparent to solid. |
| `/products`, `/categories/[slug]`, `/search` | Product cards reveal with stagger as they enter the viewport; newly loaded products (pagination or infinite scroll) animate in the same way; filter sidebar is sticky; skeleton cards show while loading. |
| `/products/[slug]` | Gallery images fade between slides; info panel sticks while the gallery scrolls on desktop; description, reviews and related products reveal on scroll; "Add to cart" bar becomes sticky at the bottom on mobile. |
| `/cart`, `/checkout` | Light fade-in only; totals update with a quick number transition. |
| `/checkout/success/[orderNo]` | Confirmation check animation, order summary fades up. |
| `/account/*` | Light fade-in of content blocks. |
| `/admin` | Count-up numbers and chart draw-in on first load; no scroll effects elsewhere. |

### 9.4 Rules
1. Scroll reveals play once per page visit (elements do not re-animate when scrolling back up).
2. If the user has "reduce motion" enabled, all slide, parallax and smooth-scroll effects are replaced by simple fades or no animation, and nothing is hidden waiting for an animation.
3. Animations never block interaction: a user can click links and buttons while elements are still animating.
4. The first visible screen (hero, first product row) renders immediately without waiting for animation libraries.
5. Smooth scrolling is applied on the storefront only; admin uses native scrolling.
