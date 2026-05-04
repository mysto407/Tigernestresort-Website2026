@AGENTS.md

# Tiger's Nest Resort — Project Instructions

Static marketing website for Tiger's Nest Resort, Paro, Bhutan. Built with Next.js App Router, no backend, no database.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.4 |
| Language | TypeScript (strict) | 5.x |
| UI | React | 19.2.4 |
| Styling | Tailwind CSS | 4.x |
| Animation | anime.js | 4.x |

## Build & Run

- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- No test suite configured

## Project Structure

```
src/
  app/              → Next.js pages (App Router)
    page.tsx        → Homepage (horizontal scroll, all major sections)
    rooms/          → Rooms detail page
    dining/         → Dining page
    about/          → About page
    layout.tsx      → Root layout (Navbar + Footer)
  components/
    layout/         → Navbar, Footer
    ui/             → Reusable UI (Button, SectionHeader)
    dev/            → Dev-only helpers (AlignmentGuide)
  lib/
    data.ts         → Single source of truth for all content (rooms, dining, attractions, contact)
  types/
    index.ts        → Shared TypeScript interfaces (Room, DiningOption, Attraction, NavLink)
public/
  tnrPhotos/        → All resort photography
  qaska-font/       → Custom font assets
```

## Conventions

- Path alias: `@/*` maps to `./src/*`
- Interactive components need `"use client"` at the top
- All site content lives in `src/lib/data.ts` — edit data there, not inline in components
- Types for content are defined in `src/types/index.ts`
- Styling is inline Tailwind — no separate CSS modules
- PascalCase for components and types, camelCase for variables and functions

## Key Patterns

- **Homepage** uses a custom horizontal scroll (`overflow-x-scroll` + `requestAnimationFrame` wheel handler on `containerRef`)
- **Sticky section headers** use `position: sticky; left: 0` — headers stick to the left edge of the viewport while their section is in view
- **Animations** use anime.js 4.x — API differs from 3.x (no `anime()` default export, use named imports)
- **Images** are all in `public/tnrPhotos/` and served via Next.js `<Image>`
- **Booking** links to WhatsApp (`wa.me`) — no booking engine integrated

## Adding Content

To add a room, dining option, or attraction: edit `src/lib/data.ts` only. The pages consume the arrays directly.
