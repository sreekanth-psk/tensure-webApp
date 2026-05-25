# Tensure — AI-Driven Pipeline Design & ROI Estimator

A premium, cinematic enterprise SaaS web application for AI-powered DevOps pipeline design, ROI estimation, and 30-60-90 day modernization roadmaps.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Three Fiber** + **Drei** (cinematic 3D port hero)
- **GSAP** + ScrollTrigger (scroll animations)
- **Framer Motion** (micro-interactions)
- **Zustand** (global state)
- **React Hook Form** + Zod (form validation ready)
- **Radix UI** (ShadCN-style components)
- **Lucide Icons**

## Features

- **Cinematic Hero** — Three.js port scene with cargo ships, dock cranes, glowing code containers, ocean shader, data streams
- **AI Spec & Calculator Engine** — Interactive blueprint generator with ROI visualization
- **30-60-90 Timeline** — Scroll-linked enterprise roadmap
- **Feature Cards** — 3D tilt hover effects
- **AI Assistant** — Floating chat widget with streaming mock responses
- **Trust, Blog, CTA** — Enterprise polish throughout

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages & layout
├── components/
│   ├── ai/           # Blueprint visualization, ROI panels
│   ├── chat/         # AI assistant widget
│   ├── layout/       # Navbar, footer
│   ├── sections/     # Page sections (hero, engine, timeline, etc.)
│   ├── three/        # React Three Fiber scene components
│   └── ui/           # Reusable UI kit (button, input, tabs, etc.)
├── hooks/            # GSAP scroll hooks, typewriter
├── lib/              # Utils, mock AI generation
├── store/            # Zustand pipeline store
└── types/            # TypeScript interfaces
```

## Mock AI Layer

The `src/lib/mock-ai.ts` module simulates AI blueprint generation with:

- Streaming status messages
- Architecture node graphs
- ROI calculations based on form inputs
- 30-60-90 roadmap phases
- Chat response routing

Replace with real API calls by updating `generateBlueprint()` in the store and `getChatResponse()` for production.

## Performance Notes

- 3D hero is **dynamically imported** (no SSR) for optimal loading
- Canvas uses adaptive DPR `[1, 2]`
- `prefers-reduced-motion` respected in global CSS
- GSAP contexts cleaned up on unmount

## Customization

- **Colors**: Edit `tailwind.config.ts` navy/emerald tokens
- **Scenarios**: Add presets in `src/lib/mock-ai.ts` → `AI_SCENARIOS`
- **Features**: Extend `features` array in `src/components/sections/features.tsx`

## License

Private — Tensure Platform
