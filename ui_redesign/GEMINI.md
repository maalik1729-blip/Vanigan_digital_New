# TNVS Frontend UI Redesign — Agent Identity

## Scope: Frontend Only
Do NOT touch: voter-api-server.js, package.json, vite.config.ts,
any database logic, any server files, any backend routes.
Every change is inside src/ only.

---

## Tech Stack (Confirmed from codebase)
- Framework: TanStack Start (React 19) + TanStack Router (file-based routing)
- Styling: Tailwind CSS v4 + shadcn/ui (new-york style, slate base)
- Components: Radix UI primitives via shadcn
- Animation: Framer Motion v12 (limit usage — mobile performance)
- Icons: Lucide React
- Forms: React Hook Form + Zod
- Path alias: @ → src/

## Confirmed Route Files
- src/routes/index.tsx         → Home page
- src/routes/services.tsx      → Services listing
- src/routes/wings.tsx         → 34 Organizational Wings
- src/routes/membership.tsx    → 5-step registration form
- src/routes/dashboard.tsx     → Member login + dashboard
- src/routes/voter-id.tsx      → Membership card generator
- src/routes/assistant.tsx     → Support & FAQ

## Confirmed Problems (from live site audit)
1. District dropdown: only 8 of 38 TN districts in membership form
2. Language toggle TA|EN: visible in nav but non-functional
3. No design token file: brand colors likely hardcoded as Tailwind
   arbitrary values scattered across files
4. Framer Motion: imported globally, likely overused on mobile
5. Lenis smooth scroll: installed, breaks native Android scroll
6. No shared component for the navigation bar — likely duplicated
7. shadcn installed with every Radix primitive — most unused

---

## Brand Constraints (Non-Negotiable)
- Primary: Navy (#0A1F44 or nearest Tailwind equivalent)
- Accent: Gold (#C9A84C or nearest Tailwind equivalent)
- Both must become CSS custom properties in src/styles.css
- Bilingual: English + Tamil labels in all UI components
- Government trust signals must be preserved or strengthened

## Target Audience
- Tamil Nadu traders, 35-55 age range
- 60-70% mobile, Android ₹8,000-15,000 range
- 4G connectivity, intermittent drops
- Tamil-primary literacy
- WhatsApp-native mental model

## Output Folder
All generated/modified files go to their correct src/ paths.
Document every file changed in outputs/change_log.md

---

## Workflow Trigger
Place this folder in the project root.
Type in Antigravity chat:

  /ui-redesign

This runs all 5 stages sequentially, frontend only.
Individual stages: /ui-audit /ux-strategy /visual-tokens
                   /component-fixes /ux-review
