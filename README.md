# 🎂 Treats & Treasures — Custom Cake Ordering Platform

Karachi's most personal cake studio — built for Gen Z customers who want 100% customized cakes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS (custom design system) |
| Routing | React Router v6 |
| Animation | Framer Motion |
| 3D Preview | Three.js *(Day 3)* |
| Backend | .NET 8 Web API + Entity Framework Core *(Day 8)* |
| Database | SQL Server *(Day 8)* |
| Auth | ASP.NET Identity + JWT *(Day 8)* |
| Payments | JazzCash / EasyPaisa *(Day 7)* |

---

## Folder Structure

```
treats-and-treasures/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx       # Sticky navbar with glass blur + mobile menu
│   │   ├── Hero.tsx         # Hero section with 3D cake preview slot
│   │   ├── HowItWorks.tsx   # 3-step process section (framer-motion)
│   │   ├── ThemeShowcase.tsx # Auto-scrolling theme cards strip
│   │   ├── WhyUs.tsx        # Feature tiles with stats (framer-motion)
│   │   └── Footer.tsx       # Footer with social links
│   ├── pages/               # Route-level page components
│   │   ├── Home.tsx         # Homepage (assembles all sections)
│   │   ├── Builder.tsx      # /builder — Cake builder (Day 2+)
│   │   ├── Cupcakes.tsx     # /cupcakes — Cupcake builder (Day 6)
│   │   ├── Themes.tsx       # /themes — Theme selector (Day 5)
│   │   └── Order.tsx        # /order — Order flow (Day 7)
│   ├── assets/              # Static assets (images, SVGs)
│   ├── App.tsx              # Root component with Router + Routes
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles + Tailwind directives
├── tailwind.config.js       # Custom design tokens
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Design System

| Token | Value | Usage |
|---|---|---|
| `primary` | `#F2A7BB` | Blush pink — CTA buttons, accents |
| `accent` | `#D4956A` | Warm caramel — secondary CTAs |
| `background` | `#FDF6F0` | Cream white — page background |
| `surface` | `#FFFAF7` | Soft white — card backgrounds |
| `espresso` | `#2C1810` | Deep brown — primary text |
| Font Display | Playfair Display | All headings |
| Font Body | DM Sans | All body text |

---

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

---

## 10-Day Roadmap

| Day | Focus |
|---|---|
| ✅ 1 | Project setup + design system + homepage |
| 2 | Cake builder UI — canvas, layers panel, drag & drop |
| 3 | Three.js 3D rotating cake preview |
| 4 | Decoration system — cream, fondant, toppers |
| 5 | Theme selector — all event themes |
| 6 | Cupcake builder + flavor picker |
| 7 | Order flow — cart, form, Karachi delivery zones |
| 8 | .NET backend — API, SQL schema, EF Core |
| 9 | Admin dashboard — orders, inventory, analytics |
| 10 | Polish, mobile QA, performance optimization |

---

## Notes

- 🇵🇰 Delivery currently available within **Karachi only**
- Payments via JazzCash / EasyPaisa (Day 7)
- Three.js canvas placeholder is in `Hero.tsx` — search for `<!-- Three.js canvas mounts here Day 3 -->`
