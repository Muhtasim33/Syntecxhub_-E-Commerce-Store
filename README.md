# Aurelia & Co. &mdash; Luxury E-Commerce Platform

A production-ready e-commerce platform built strictly according to **PRD.md**, **TRD.md**, **ARCHITECTURE.md**, and **APP_FLOW.md**.

---

## 1. Brand Identity & Design System

- **Brand Dark (Header, Footer, Overlays, Text):** `#02110c` (Dark Emerald Green)
- **Brand Primary (Buttons, Links, Active Badges):** `#1a422f` (Olive Green) / Hover: `#25593f`
- **Brand Light (Page Background, Cards, Inputs):** `#f3ebd6` (Cream Beige) / Border: `#e2d7bb`
- **Luxury Gold Accent:** `#c9a96e` (Certificates, Badges, Highlights)
- **Typography:** Serif headings (*Playfair Display*) paired with clean sans-serif UI (*Inter*).

---

## 2. Monorepo Architecture

```
ecommerce/
├── apps/
│   ├── web/                     # Next.js 14+ App Router (Storefront, Account, Admin UI)
│   │   ├── app/
│   │   │   ├── (shop)/          # Public pages (Home, Products, Categories, Cart, Checkout)
│   │   │   ├── (auth)/          # Guest split-layout authentication
│   │   │   ├── (account)/       # Customer dashboard, orders, tracking, addresses, wishlist
│   │   │   └── admin/           # Executive admin suite (Catalog, Orders, Customers, Settings)
│   │   ├── components/          # Design-system primitives (ui, motion, layout, cart, product)
│   │   ├── store/               # Zustand stores (cart, auth, ui)
│   │   └── styles/tokens.css    # Strict brand tokens
│   │
│   └── api/                     # Node.js + Express REST API (/api/v1)
│       ├── src/modules/         # Auth, Products, Categories, Orders, Admin, Health
│       └── prisma/schema.prisma # PostgreSQL relational schema
│
├── packages/
│   └── shared/                  # Shared Zod schemas, TypeScript DTOs, Enums, Constants
│
├── docs/                        # PRD.md, TRD.md, ARCHITECTURE.md, APP_FLOW.md
├── docker-compose.yml           # PostgreSQL 15, Redis 7, Mailcatcher
└── package.json                 # Workspaces configuration
```

---

## 3. Quick Start & Execution

### Prerequisites
- Node.js 20+ LTS
- Docker & Docker Compose (optional for local PostgreSQL/Redis)

### 1. Start Database & Redis (Optional)
```bash
docker compose up -d
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Servers
```bash
# Run Next.js storefront & admin on http://localhost:3000
npm run dev:web

# Or run Express API on http://localhost:4000
npm run dev:api
```

---

## 4. Verified User Flows

1. **Guest Storefront Browsing:** Parallax hero &rarr; Category filtration &rarr; Product card hover zoom with Quick-Add &rarr; Slide-in Mini Cart Drawer.
2. **Product Detail Page:** Multi-image gallery, interactive ring/garment variant selector (size/color), real-time stock indicator, and sticky Add to Bag bar.
3. **4-Step Private Checkout:** Single-page step machine (`Address` &rarr; `Delivery` &rarr; `Payment [Card/COD]` &rarr; `Review & Confirmation`).
4. **Order Tracking Lifecycle:** Visual timeline (`Pending` &rarr; `Paid` &rarr; `Processing` &rarr; `Shipped` &rarr; `Delivered`) with tracking number and cancellation modal.
5. **Admin Operations Suite:** Executive revenue and order metrics, low-stock vault alerts, creation product editor with variant options, and status machine state transitions.
