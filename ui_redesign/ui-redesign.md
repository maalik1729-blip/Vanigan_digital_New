# /ui-redesign — TNVS Frontend Redesign Pipeline

> Type /ui-redesign in Antigravity to run all 5 stages.
> Frontend only. No backend files touched.
> Agent reads each stage output before proceeding to the next.

// turbo

---

## Pre-flight

Before Stage 1, open and read these files using the editor:
- src/styles.css
- src/routes/index.tsx
- src/routes/membership.tsx
- src/routes/wings.tsx
- src/routes/dashboard.tsx
- src/routes/voter-id.tsx
- src/routes/assistant.tsx
- Any file in src/components/ that appears to be a shared layout
  component (look for Nav, Header, Layout, or Root in the filename)

Confirm in chat: which files were found, how many lines each,
and whether a shared Navbar component exists or is duplicated
across route files.

---

## Stage 1 — UI Audit (Frontend Code + Live Site)

**Read:** All src/routes/*.tsx and src/components/ files
**Write:** outputs/01_ui_audit.md

### What to audit in the code — not just visually

**Design token audit**
Search src/styles.css and all .tsx files for:
- Any hardcoded hex values (#0A1F44, #C9A84C, or similar navy/gold)
- Any Tailwind arbitrary values like bg-[#0A1F44] or text-[#C9A84C]
- Whether CSS custom properties (--color-navy, --color-gold) exist
- Whether Tailwind config extends the theme with brand tokens

Document every file where brand colors are hardcoded.

**Component duplication audit**
- Is the navigation bar a shared component or duplicated in each route?
- Is the footer a shared component or duplicated?
- Is the utility bar (Reg. No. + phone) a shared component?
Document any component duplicated across more than one route file.

**District dropdown audit**
Open src/routes/membership.tsx.
Count exactly how many districts are in the Select component.
List which are missing vs the full 38 TN districts.
This is [CRITICAL] — note it prominently.

**Language toggle audit**
Find the TA|EN toggle in the codebase.
Is it wired to any state? Does it change any text?
Is there an i18n library? Any translation strings?
If it does nothing: [CRITICAL].

**Animation audit**
Search all .tsx files for: motion., useAnimation, AnimatePresence,
framer-motion imports.
List every file that imports from framer-motion.
Mark any animation that runs on scroll or on page load as a
mobile performance risk.

Search for: import Lenis, new Lenis, useLenis
If found: [HIGH] — document the file.

**Bundle weight audit (from package.json)**
List every @radix-ui/* package installed.
Cross-reference against actual imports found in src/.
List which Radix packages are installed but not imported anywhere.
These are dead weight.

**Mobile layout audit**
In each route file, check for:
- Grid or flex containers without responsive breakpoint classes
- Fixed pixel widths that will overflow at 375px
- Touch targets smaller than 44px (h-11 or min-h-[44px] in Tailwind)
- Any overflow-x issues from the stats row or card grids

### Required Output Structure

```
# 01 — TNVS Frontend UI Audit

## Executive Summary

## Design Token Findings
[Every file with hardcoded colors. Severity tagged.]

## Component Duplication Findings
[Nav, footer, utility bar — shared or duplicated?]

## Critical Functional Bugs
[District dropdown, language toggle — with exact file + line context]

## Animation & Performance Findings
[Every framer-motion usage. Lenis if present.]

## Dead Dependency Findings
[Radix packages installed but not imported]

## Mobile Layout Findings
[Responsive gaps found in code]

## Prioritized Fix List
[Ranked: CRITICAL → HIGH → MEDIUM → LOW]
[Each item: file path, what to change, why]
```

---

## Stage 2 — UX Strategy (Frontend Logic Only)

**Read:** outputs/01_ui_audit.md
**Write:** outputs/02_ux_strategy.md

### What to produce

Do NOT suggest visual changes yet.
Focus on: component structure, information hierarchy, interaction
logic, state management patterns, routing behavior.

**Navigation strategy**
Should the nav be a shared Root layout component?
What is the correct TanStack Router layout hierarchy?
Where should the language toggle state live?

**Registration form strategy**
What is the correct multi-step form architecture in React Hook Form?
How should district data be structured — constant, API call, or
Zod enum?
What validation should trigger on each step vs on submit?
What happens if a user navigates back — does form state persist?

**Dashboard strategy**
What is the minimum viable auth flow for demo mode?
(Mobile input → simulated OTP → demo dashboard state)
Where should auth state live — TanStack Router context, Zustand,
or React context?

**Card generator strategy (/voter-id)**
The form currently accepts manual input.
For frontend-only: what is the correct UX flow assuming the API
is unavailable? (Search → show demo card → clear message that
real data requires login)

**Language toggle strategy**
Option A: Implement basic i18n with a JSON string file
Option B: Remove toggle, commit to Tamil-primary, add English
  subtitles as a pattern throughout
Recommend one option with reasoning.

### Required Output Structure

```
# 02 — UX Strategy

## Strategy Overview

## Navigation Architecture
## Registration Form Architecture
## Dashboard Auth Flow (Demo Mode)
## Card Generator Flow
## Language Toggle Decision
## Component Hierarchy Recommendations
## State Management Recommendations
## Recommended UX Priorities (Top 10)
```

---

## Stage 3 — Design Tokens + Visual Direction

**Read:** outputs/02_ux_strategy.md + outputs/01_ui_audit.md
**Write:** outputs/03_visual_tokens.md
**Also write:** src/styles.css (updated with token system)

### What to produce

**Part A — Token document**

Define the complete design token system for this project.
Every token as a CSS custom property.

Required token groups:
- Colors: --color-navy, --color-gold, --color-navy-light,
  --color-gold-light, semantic aliases
  (--color-primary, --color-accent, --color-surface, etc.)
- Typography: --font-body, --font-display, --font-tamil
  (Tailwind v4 uses @theme for font config)
- Spacing: confirm base unit (4px grid)
- Border radius: --radius-sm, --radius-md, --radius-lg, --radius-xl
- Shadows: minimal — one elevation level only
- Z-index: --z-nav, --z-modal, --z-toast

Also define Tailwind v4 @theme extension for brand colors so
they're available as bg-navy, text-gold, etc. without arbitrary
values.

**Part B — Component visual direction**

For each component below, specify the exact Tailwind classes
that implement the design direction. No prose descriptions —
actual class strings.

Components to specify:
1. Utility bar (top strip with Reg. No.)
2. Navigation bar (desktop + mobile)
3. Hero section
4. Stats row (4 numbers)
5. Service card
6. Wing card
7. Registration stepper indicator
8. Form input field
9. Primary button
10. Secondary button
11. Dashboard member card
12. Demo mode banner (replace amber ⚠ with blue info style)
13. Footer

For each:
- Container classes
- Text classes
- Interactive state classes (hover:, focus:, active:)
- Mobile variant classes (responsive prefixes)
- Any Framer Motion usage: keep or replace with CSS?

### Required Output Structure

```
# 03 — Design Tokens + Visual Direction

## Token System
[Full CSS custom property list]

## Tailwind v4 @theme Extension
[Copy-paste ready block for src/styles.css]

## Component Class Specifications
[Component by component, actual Tailwind class strings]

## What Replaces Framer Motion
[CSS transition/animation replacements for each removed usage]

## Font Strategy
[Tamil font: Noto Sans Tamil via Google Fonts — loading strategy
 for slow connections. font-display: swap. Preload hint.]
```

---

## Stage 4 — Component Fixes (Actual Code Changes)

**Read:** outputs/03_visual_tokens.md + outputs/02_ux_strategy.md
**Write:** outputs/04_change_plan.md
**Also modify:** actual src/ files

### Instructions

This stage writes real code. For each fix below, open the
relevant file, make the change, and confirm in outputs/04_change_plan.md
exactly what was changed, in which file, at which line.

// turbo

**Fix 1 — Design tokens in src/styles.css**
Add the full CSS custom property block from Stage 3.
Add the Tailwind v4 @theme extension block.
Remove any existing hardcoded color arbitrary values found in Stage 1.

**Fix 2 — All 38 districts in membership form**
Open src/routes/membership.tsx.
Create a constant array TN_DISTRICTS with all 38 Tamil Nadu
districts in Tamil + English:
[
  { value: 'ariyalur', label: 'அரியலூர் / Ariyalur' },
  { value: 'chengalpattu', label: 'செங்கல்பட்டு / Chengalpattu' },
  { value: 'chennai', label: 'சென்னை / Chennai' },
  { value: 'coimbatore', label: 'கோயம்புத்தூர் / Coimbatore' },
  { value: 'cuddalore', label: 'கடலூர் / Cuddalore' },
  { value: 'dharmapuri', label: 'தர்மபுரி / Dharmapuri' },
  { value: 'dindigul', label: 'திண்டுக்கல் / Dindigul' },
  { value: 'erode', label: 'ஈரோடு / Erode' },
  { value: 'kallakurichi', label: 'கள்ளக்குறிச்சி / Kallakurichi' },
  { value: 'kancheepuram', label: 'காஞ்சிபுரம் / Kancheepuram' },
  { value: 'kanniyakumari', label: 'கன்னியாகுமரி / Kanniyakumari' },
  { value: 'karur', label: 'கரூர் / Karur' },
  { value: 'krishnagiri', label: 'கிருஷ்ணகிரி / Krishnagiri' },
  { value: 'madurai', label: 'மதுரை / Madurai' },
  { value: 'mayiladuthurai', label: 'மயிலாடுதுறை / Mayiladuthurai' },
  { value: 'nagapattinam', label: 'நாகப்பட்டினம் / Nagapattinam' },
  { value: 'namakkal', label: 'நாமக்கல் / Namakkal' },
  { value: 'nilgiris', label: 'நீலகிரி / Nilgiris' },
  { value: 'perambalur', label: 'பெரம்பலூர் / Perambalur' },
  { value: 'pudukkottai', label: 'புதுக்கோட்டை / Pudukkottai' },
  { value: 'ramanathapuram', label: 'ராமநாதபுரம் / Ramanathapuram' },
  { value: 'ranipet', label: 'ராணிப்பேட்டை / Ranipet' },
  { value: 'salem', label: 'சேலம் / Salem' },
  { value: 'sivaganga', label: 'சிவகங்கை / Sivaganga' },
  { value: 'tenkasi', label: 'தென்காசி / Tenkasi' },
  { value: 'thanjavur', label: 'தஞ்சாவூர் / Thanjavur' },
  { value: 'theni', label: 'தேனி / Theni' },
  { value: 'thoothukudi', label: 'தூத்துக்குடி / Thoothukudi' },
  { value: 'tiruchirappalli', label: 'திருச்சிராப்பள்ளி / Tiruchirappalli' },
  { value: 'tirunelveli', label: 'திருநெல்வேலி / Tirunelveli' },
  { value: 'tirupattur', label: 'திருப்பத்தூர் / Tirupattur' },
  { value: 'tiruppur', label: 'திருப்பூர் / Tiruppur' },
  { value: 'tiruvallur', label: 'திருவள்ளூர் / Tiruvallur' },
  { value: 'tiruvannamalai', label: 'திருவண்ணாமலை / Tiruvannamalai' },
  { value: 'tiruvarur', label: 'திருவாரூர் / Tiruvarur' },
  { value: 'vellore', label: 'வேலூர் / Vellore' },
  { value: 'viluppuram', label: 'விழுப்புரம் / Viluppuram' },
  { value: 'virudhunagar', label: 'விருதுநகர் / Virudhunagar' },
]
Replace the existing hardcoded Select options with this array
mapped to <SelectItem> components.

**Fix 3 — Language toggle**
Based on Stage 2 decision (implement or remove):
If implement: create src/lib/i18n.ts with a minimal string store.
  Create useLanguage() hook. Wire TA|EN toggle to toggle state.
  Update at minimum: nav labels, hero heading, CTA text.
If remove: delete the toggle from the nav component entirely.
  Replace with a static bilingual label pattern on key headings.

**Fix 4 — Shared layout components**
If Nav is duplicated across route files:
  Extract to src/components/layout/Navbar.tsx
  Extract Footer to src/components/layout/Footer.tsx
  Extract UtilityBar to src/components/layout/UtilityBar.tsx
  Wire into the TanStack Router root layout (__root.tsx)

**Fix 5 — Demo mode banner**
Find the amber ⚠ banner component used in dashboard and assistant.
Replace with a blue info style using token classes.
Text change: remove ⚠ icon, use an info circle icon (Lucide: Info).
Background: --color-surface-info (blue-50 equivalent).
Border: 1px solid --color-border-info.

**Fix 6 — Remove Lenis**
If Lenis is imported anywhere in src/:
Remove the import and initialization.
Add scroll-behavior: smooth to src/styles.css for anchor links only.

**Fix 7 — Reduce Framer Motion**
For every framer-motion usage found in Stage 1:
If it's a decorative scroll animation or entrance fade: replace with
  CSS @keyframes fadeIn + animation class.
If it's the registration stepper progress indicator: keep it.
If it's page transition: replace with CSS view-transition API or
  a simple CSS opacity transition on the route wrapper.

### Required Output Structure

```
# 04 — Change Plan

## Files Modified
[File path | What changed | Lines affected]

## Fix 1: Design Tokens
## Fix 2: 38 Districts
## Fix 3: Language Toggle
## Fix 4: Shared Layout
## Fix 5: Demo Banner
## Fix 6: Lenis Removal
## Fix 7: Framer Motion Reduction

## Verification Steps
[How to confirm each fix works in the browser]
```

---

## Stage 5 — Final Review

**Read:** outputs/04_change_plan.md
**Write:** outputs/05_final_review.md

### What to check

1. Open each modified file. Confirm changes are actually present.
2. Check src/styles.css — do all token variables exist?
3. Check src/routes/membership.tsx — count Select options. Must be 38.
4. Check the language toggle — is it functional or removed? Either
   is acceptable. A broken in-between state is not.
5. Check __root.tsx — is Nav/Footer imported from shared components?
6. Search entire src/ for remaining hardcoded brand hex values.
   Any found after Stage 4 = Stage 4 incomplete.
7. Search for remaining framer-motion imports.
   If more than 1-2 files still import it: flag.
8. Search for lenis. If found: flag as Stage 4 incomplete.

### Mobile simulation check
Use the browser subagent. Open vanigan-digital.vercel.app
(or localhost:8080 if dev server running).
Set viewport to 375px width.
Check on each page:
- Does the nav collapse correctly?
- Does the stats row stack without overflow?
- Are all card grids readable at 375px?
- Is the registration form usable with one thumb?
Flag any layout that breaks at 375px.

### Required Output Structure

```
# 05 — Final Review

## Verification Results
[Pass/Fail for each Stage 4 fix]

## Remaining Hardcoded Colors
[Any found — file + line]

## Remaining Framer Motion Usage
[Files still importing it — justified or not?]

## Mobile Check Results
[375px viewport results per page]

## Outstanding Issues
[Anything not fixed in Stage 4 — with reason]

## Release Readiness
[Ready / Not ready — one line verdict with conditions]
```

---

## Post-Pipeline

After Stage 5 completes, post this summary in chat:

```
TNVS Frontend Redesign — Pipeline Complete

Modified files: [list from change_log.md]
Districts added: [count — should be 38]
Language toggle: [implemented / removed]
Lenis: [removed / not found]
Framer Motion: [files remaining]
Mobile 375px: [pass / issues found]

Next: run `npm run build` to confirm no TypeScript errors.
Then: share outputs/05_final_review.md with Ram for sign-off.
```
