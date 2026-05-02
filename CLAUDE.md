# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Treats & Treasures** is a frontend-only custom cake ordering SPA for a Karachi-based bakery. Built with React 18 + Vite + TypeScript. Orders are submitted via WhatsApp; there is no backend — all persistence is localStorage.

## Commands

```bash
npm run dev        # Start local dev server (Vite)
npm run build      # Type-check (tsc) then bundle for production
npm run preview    # Preview production build locally
npm run lint       # ESLint — strict unused vars/directives
```

There are no tests. `tsc` is run as part of `build` — use `npx tsc --noEmit` to type-check without bundling.

## Architecture

### Routing (`src/App.tsx`)

React Router v6, client-side only. Vercel rewrites all paths to `/index.html`.

| Route | Page |
|-------|------|
| `/` | Home (Hero, HowItWorks, ThemeShowcase, WhyUs) |
| `/catalogue` | Product catalogue with search/filter |
| `/builder` | Drag-and-drop cake designer |
| `/cupcakes` | Cupcake catalogue |
| `/themes` | Pre-designed theme showcase |
| `/order` | 3-step checkout (cart → delivery → payment) |
| `/order/confirmation` | Order success |
| `/admin` | PIN-gated order dashboard (PIN: `1234`) |

### State Management

- **Cart** — `src/context/CartContext.tsx`: React Context + localStorage (`tnt_cart`). Wraps the whole app. Items carry `{ id, cakeName, image, pounds, pricePKR, qty, specialInstructions }`.
- **Cake builder** — `src/hooks/useCakeBuilder.ts`: custom hook with undo history (max 20 snapshots, stored in localStorage as `tnt_cake_design`). Enforces one-decoration-per-category rule.
- **Orders** — `src/hooks/useOrders.ts`: reads/writes `tnt_orders` from localStorage.
- **Admin auth** — sessionStorage key `tnt_admin_auth` (PIN-only, frontend-only until Day 8 .NET backend).

### Cake Builder (`src/pages/Builder.tsx`)

Three-column layout on desktop, tab-based on mobile (`MobileTabBar.tsx`). Key sub-components:
- `CakeCanvas.tsx` — visual editor
- `DecorationShelf.tsx` — drag-and-drop palette (6 category tabs, items from `src/components/builder/decorationData.ts`)
- `LayerPanel.tsx` — layer reordering and visibility

Uses `@dnd-kit` for drag-and-drop. Price formula: `tiers × 1500 PKR + decorations × 200 PKR`.

### Data Layer (`src/data/`)

Static TypeScript files — no API calls:
- `cakeProducts.ts` — 28+ products across 7 categories, images from Unsplash CDN
- `cakeCategories.ts` — category metadata
- `deliveryZones.ts` — 7 Karachi zones with fees and time slots
- `orderTypes.ts` — shared type definitions for orders/payments/delivery

### Business Config (`src/config/siteConfig.ts`)

Centralizes WhatsApp number, business name/email, site URL, and admin PIN. Change here first for any business info update.

## Styling

Tailwind CSS v3 with a custom theme (`tailwind.config.js`):
- **Colors**: `primary` (pink `#F2A7BB`), `accent` (brown `#D4956A`), `background` (cream `#FDF6F0`), `espresso` (dark brown `#2C1810`)
- **Fonts**: Playfair Display (headings), DM Sans (body) — loaded via Google Fonts in `index.html`
- **Custom utilities** in `src/index.css`: `.btn-primary`, `.btn-ghost`, `.btn-accent`, `.section-heading`, `.card-surface`, `.text-gradient`
- **Custom animations**: `scroll-left`, `float`, `fade-up`, `drip`

## Key Constraints

- **No backend yet** — Day 8 will add a .NET backend. Don't add API calls or assume server-side logic.
- **TypeScript strict mode** — `noUnusedLocals` and `noUnusedParameters` are enforced; the build will fail if these are violated.
- **Admin PIN is frontend-only** — stored plaintext in `siteConfig.ts`. Do not treat this as secure auth.
- **Images from Unsplash CDN** — use `?fit=crop&w=800&h=600` URL params for consistent aspect ratios.
- **Vite chunk splitting** — `vite.config.ts` manually splits `vendor`, `router`, `motion`, and `dnd` chunks. Keep large dependencies in their respective chunks.
