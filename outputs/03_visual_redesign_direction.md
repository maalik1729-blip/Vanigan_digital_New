# Visual Redesign Direction — Tamil Nadu Vanigargalin Sangamam (TNVS) Portal
> Input: `outputs/02_ux_improvement_strategy.md`  
> Role: Senior Product UI Designer  
> Reference quality: Stripe · Linear · Notion · Airtable  
> Context: Government-adjacent institutional brand serving non-technical users

---

## Visual Design Philosophy

### The Core Principle: "Institutional Premium"

TNVS occupies a unique design space — it must feel **official and trustworthy** (like a government portal) while also being **modern and accessible** (like a consumer app). The current design leans too far into an academic/editorial aesthetic (Fraunces serif, parchment tones, dot backgrounds) without achieving either professional formality or modern clarity.

**Target design personality:**
- **Stripe-level** financial clarity: clean white surfaces, structured information, high-contrast typography
- **Linear-level** system design: consistent spacing, purposeful color usage, predictable interaction patterns  
- **Notion-level** simplicity: a child could understand what to do next
- **Airtable-level** confidence: the interface inspires trust without being intimidating

### Design Principles

1. **White space is trust** — Generous padding signals premium quality. Density signals chaos.
2. **Navy = authority, Gold = celebration, Green = success** — Strict semantic color usage
3. **Progressive complexity** — Show simple first. Reveal detail on demand.
4. **Tamil-first, English-second** — Design layouts for Tamil text length, not English
5. **One action per screen** — Never compete with yourself on the same page

---

## Typography Recommendations

### Font System — Revised

**Keep:**
- `Inter` for body text, UI labels, data tables — excellent legibility at all sizes
- `Noto Sans Tamil` for Tamil body text
- `Noto Serif Tamil` for Tamil display headings

**Replace:**
- `Fraunces` → **`Instrument Serif`** or **`Playfair Display`** for English display headings

**Reason for change:** Fraunces is a warm, optical-size serif designed for editorial contexts. For an institutional portal, a more upright, legible display serif creates stronger authority signal. Instrument Serif reads professional without being cold.

---

### Type Scale — Redesigned

```
Display 2xl: 60px / 1.05 lh / -0.03em  — Hero headline only
Display xl:  48px / 1.08 lh / -0.025em — Section heroes
Display lg:  36px / 1.10 lh / -0.02em  — Page titles (h1)
Display md:  28px / 1.15 lh / -0.015em — Section headings (h2)
Display sm:  22px / 1.20 lh / -0.01em  — Card titles (h3)
Body lg:     18px / 1.65 lh            — Lead paragraphs
Body md:     16px / 1.60 lh            — Standard body
Body sm:     14px / 1.55 lh            — Secondary body, form labels
Caption:     12px / 1.50 lh            — ABSOLUTE MINIMUM — metadata only
Label:       11px / 1.40 lh / 0.08em  — Only for table headers, input labels (UPPERCASE)
```

**Strict rule:** Never use below-12px text for any readable content. Remove all `text-[10px]`, `text-[9px]`, `text-[8px]` instances.

**Tamil scale adjustments:**
- All Tamil display text: ×0.88 multiplier (Tamil akkhara are visually denser)
- Tamil body text: minimum `line-height: 1.75` — never 1.5 or lower
- Tamil heading letter-spacing: `+0.01em` (unlike English which uses negative tracking)

---

### Font Weight Hierarchy

```
Black (900)  — Never in design system (too heavy for UI)
ExtraBold    — Reserved for numbers/metrics only
Bold (700)   — Section headings, card titles, critical labels
SemiBold     — Navigation items, button text, form labels
Medium (500) — Body text, descriptions, secondary labels
Regular      — Long-form content only
```

---

## Layout System

### Grid Architecture

**Desktop (1280px+ content width):**
- 12-column grid, 24px gutters, 80px max-horizontal-padding
- Primary content: 8 columns (2/3)
- Supporting content: 4 columns (1/3)

**Tablet (768px–1279px):**
- 8-column grid, 20px gutters, 48px horizontal padding

**Mobile (< 768px):**
- 4-column grid, 16px gutters, 20px horizontal padding

### Spacing System — 8px Base Unit

```
spacing-1:  8px   — Micro gaps (icon-label)
spacing-2:  16px  — Form field internal padding
spacing-3:  24px  — Card internal padding (mobile)
spacing-4:  32px  — Card internal padding (desktop), list item spacing
spacing-5:  40px  — Section sub-components spacing
spacing-6:  48px  — Card gap, small section padding
spacing-8:  64px  — Standard section padding (vertical)
spacing-10: 80px  — Large section padding
spacing-16: 128px — Hero/Feature section padding
```

**Rule:** All spacing values must be multiples of 8px. No arbitrary pixel values.

---

### Content Width Constraints

```
Global max-width:    1280px  — Never exceed this
Section content:     1040px  — Standard content width
Form container:      720px   — All forms constrained
Card grid:           960px   — Card layouts
Dashboard panels:    1280px  — Full-width allowed
```

---

## Color Hierarchy

### Primary Palette — Simplified and Purposeful

**Primary Navy — Institutional Authority**
```
Navy 900: oklch(0.20 0.14 255)  — Text on white, hero backgrounds
Navy 800: oklch(0.25 0.14 255)  — Primary buttons
Navy 700: oklch(0.30 0.14 255)  — Current primary (keep as primary)
Navy 600: oklch(0.38 0.13 255)  — Hover states
Navy 100: oklch(0.96 0.03 255)  — Light backgrounds, tags
Navy 50:  oklch(0.98 0.015 255) — Subtle highlights
```

**Gold — Celebration and Achievement ONLY**
```
Gold 600: oklch(0.72 0.14 85)   — Active indicators, celebration states
Gold 500: oklch(0.78 0.12 85)   — Current value (keep, decorative use only)
Gold 200: oklch(0.92 0.06 85)   — Subtle gold backgrounds
Gold 100: oklch(0.97 0.03 85)   — Very subtle tint
```

**Green — Success and Completion**
```
Green 700: oklch(0.40 0.15 155) — Verified/active status text
Green 100: oklch(0.96 0.04 155) — Success backgrounds
```

**Red — Errors and Alerts**
```
Red 700: oklch(0.45 0.22 28)    — Error text
Red 100: oklch(0.97 0.02 28)    — Error backgrounds
```

**Neutral — The Workhorse**
```
Gray 950: oklch(0.12 0.005 252) — Primary text (replaces --ink)
Gray 700: oklch(0.35 0.012 252) — Secondary text
Gray 500: oklch(0.55 0.01 252)  — Tertiary text, placeholders
Gray 300: oklch(0.78 0.008 252) — Borders active
Gray 200: oklch(0.88 0.006 252) — Borders default (current --border)
Gray 100: oklch(0.95 0.004 252) — Backgrounds subtle
Gray 50:  oklch(0.98 0.002 252) — Page backgrounds
White:    oklch(1 0 0)           — Card backgrounds
```

---

### Color Semantic Rules (NON-NEGOTIABLE)

| Color | Allowed Uses | Forbidden Uses |
|-------|-------------|----------------|
| Navy (primary) | Buttons, headings, active states, links, nav highlights | Backgrounds of large areas, body text blocks |
| Gold | Success badge backgrounds, celebration indicators, decorative dividers | Body text, button labels, error states |
| Green | Active/verified status pills, success toasts, completion checkmarks | Buttons, headings, decorative use |
| Red | Error messages, invalid states, critical warnings | Decorative use, success states |
| Gray 950 | All body text, headings | Light backgrounds |
| White | Card surfaces, input backgrounds | Text on light surfaces |

**Remove from design:**
- Dot background pattern on body (visual noise, removed entirely)
- Parchment/warm background tones (oklch 0.985 0.012 85) — replaced with clean Gray 50
- Gradient overlays on sections (bg-linear-to-br from-slate-50 to-white) — replaced with flat surfaces

---

## Navigation Redesign

### Desktop Navigation — Simplified to 5 Items

```
[TNVS Logo] ···· [Home] [Services] [Directory] [Wings] [Help] ···· [My Account] [Language] [Join Now ▶]
```

**Visual treatment:**
- Active item: Navy underline (4px, rounded) below text — NOT gold SVG squiggle (remove current animation)
- Hover item: Gray 100 pill background, Navy text
- Primary CTA "Join Now": Navy-800 background, white text, 8px rounded, 44px height
- Language toggle: Ghost style — just text `EN | தமிழ்` with divider, no border/background
- No dropdown for first 3 items — they navigate directly

**Removed from header:**
- Government ticker bar (move ticker content to a dismissible announcement banner on home page)
- The 3px government stripe (too subtle to signal authority — integrate into logo or add a more meaningful trust bar)

**Result:** Header collapses from 99px to 64px. 35% more visible page area immediately.

---

### Mobile Navigation — Bottom Bar Redesigned

```
[🏠 Home] [📋 Services] [👥 Directory] [👤 Account] [❓ Help]
```

**Visual treatment:**
- Background: White, 1px Gray 200 top border
- Active item: Navy-700 icon + label, Navy-100 pill background
- Inactive: Gray-500 icon + Gray-700 label
- Icons: 24px, Lucide icon set (already in use — keep)
- Labels: 11px, SemiBold, Gray-700 → Navy on active
- Height: 64px + safe area inset bottom

**Changes from current:**
- "Business" tab renamed "Directory"
- "Services" tab now links to `/services` (not `/members`)
- "Membership" tab replaced with "Account" (more universal)
- Tab labels consistent with desktop nav

---

## Dashboard Redesign

### Layout — 2-Zone Architecture

**Zone A (Left sidebar, 280px on desktop):**
- Member identity card (compact version)
- Navigation between dashboard sections
- Quick stats: membership validity, renewals due

**Zone B (Main content, flexible):**
- Section content based on selected navigation item

**On mobile:** Zone A collapses to a top card strip. Zone B becomes full-width scrollable.

---

### Member Card — Premium but Functional

**Redesigned member card visual:**
```
┌────────────────────────────────────────────┐
│ [TNVS logo 40px]          [ACTIVE ●]       │
│                                            │
│ Senthil Kumar N                            │
│ EPIC: RJE1234567                           │
│                                            │
│ Chennai · Mylapore · Retail                │
│ ─────────────────────────────────────────  │
│ Valid until: Dec 2026        [↓ Download]  │
└────────────────────────────────────────────┘
```

**Style:** Dark Navy background (not gradient), Gold accent for EPIC number only, clean white typography, 16px border radius. No ambient glow effects. No blur effects.

---

### Dashboard Tabs → Sidebar Navigation

Replace horizontal tabs (which overflow on mobile) with a left sidebar on desktop and a segmented control (2 items max) on mobile:

**Member view:**
1. My Membership (overview)
2. My Services (loan applications, certificate downloads)

**Coordinator view (additional):**
3. My Members (recruiter CRM)
4. Analytics
5. Tools

---

## Card Component Redesign

### Standard Card — Clean Surface

**Properties:**
```
Background:   White
Border:       1px Gray-200
Border-radius: 12px (--radius-card, enforced)
Shadow:       0 1px 2px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.06)
Padding:      24px (desktop) / 20px (mobile)
```

**No:**
- No gradient backgrounds on standard cards
- No `translateY(-5px)` hover lifts
- No glow shadows on hover
- No pulsing borders

**Yes:**
- `border-color` transitions to Navy-200 on hover (subtle)
- `box-shadow` deepens slightly on hover (elevation +2)
- Cursor pointer on interactive cards

---

### Service Card — With Icon Badge

```
┌──────────────────────────────┐
│ [Icon 48px navy-100 bg]     │
│                              │
│ Service Name                 │  ← Bold, 18px
│ Brief description            │  ← Regular, 14px, Gray-500
│                              │
│ ──────────────────────────── │
│ Apply / Learn more  →       │  ← SemiBold, 14px, Navy
└──────────────────────────────┘
```

**Removed from service cards:**
- START HERE badge (move to a featured position indicator)
- Min-height constraints (let content determine height)
- Stacking/sticky animation (replace with simple grid)

---

### Stats Card — Number-First, Context-Second

```
┌──────────────────┐
│ 1,24,560+        │  ← ExtraBold, 40px, Navy
│ Registered       │  ← Medium, 13px, Gray-500
│ Members          │
└──────────────────┘
```

**Grid:** 4 across on desktop, 2 across on mobile. Dividers as Gray-200 vertical lines, not gaps.

---

## Table Redesign

### Data Table — Linear-Inspired

```
┌──────────────────────────────────────────────────────────────┐
│ Date         Activity Detail              Status             │  ← Header row: Gray-100 bg
├──────────────────────────────────────────────────────────────┤
│ 12 May 2026  Membership Renewal           ● Success          │  ← 48px row height
│              Payment ₹500 · UPI           in Gray-500 sub   │
├──────────────────────────────────────────────────────────────┤
│ 08 May 2026  Certificate Download         ● Success          │
└──────────────────────────────────────────────────────────────┘
```

**Table rules:**
- Header: Gray-50 background, 12px uppercase Bold labels, Gray-500 color
- Row height: minimum 48px
- Row separator: 1px Gray-100
- Hover row: Gray-50 background transition
- No box-shadow on tables — borders only
- Horizontal scroll on mobile with fixed first column

---

## Form Redesign

### Input Field — Clean and Obvious

```
┌────────────────────────────────────────────┐
│ Full Name *                                │  ← 13px SemiBold, Gray-700, above field
│                                            │
│  [value or placeholder text]               │  ← 16px Regular, 48px min-height
└────────────────────────────────────────────┘
  ✓ Name looks good                            ← 12px Green, success state
  ✗ Enter at least 2 characters               ← 12px Red, error state
```

**Input visual specs:**
- Border: 1px Gray-300 (default), Navy-700 2px (focus), Red-500 2px (error), Green-500 2px (success)
- Background: White always (no Gray-50 input backgrounds)
- Placeholder: Gray-400, Regular weight (no bold placeholders)
- Focus ring: Navy-700 at 25% opacity, 3px spread

**Remove from inputs:**
- `rounded-2xl` and `rounded-3xl` — too much rounding for form inputs
- `font-mono` labels
- `text-[10px]` uppercase tracking labels

---

### Multi-Step Form Progress

```
  ●─────●─────○─────○
  1     2     3     4
 Done  Active  Next  Next
```

**Progress bar:**
- Active step: Navy-700 filled circle, White number
- Completed step: Navy-700 filled circle, White checkmark
- Upcoming step: Gray-300 border circle, Gray-500 number
- Connecting line: Gray-300 (default), Navy-700 (completed portion)
- Step label below circle: 12px SemiBold, matches circle state color

---

## Button System

### Hierarchy — 4 Levels, Clearly Distinguished

**Level 1 — Primary Action (One per page section)**
```
Background: Navy-700
Text: White, 15px SemiBold
Height: 48px (mobile) / 44px (desktop)
Padding: 0 24px
Border-radius: 8px
Hover: Navy-800 background
Shadow: 0 1px 2px rgba(navy, 0.20)
```

**Level 2 — Secondary Action (Supporting primary)**
```
Background: White
Text: Navy-700, 15px SemiBold
Border: 1.5px Navy-700
Height: 48px / 44px
Hover: Navy-50 background
```

**Level 3 — Ghost / Tertiary**
```
Background: Transparent
Text: Navy-700, 14px Medium
No border
Hover: Navy-50 background
Underline on text hover (not on button)
```

**Level 4 — Danger**
```
Background: Red-100
Text: Red-700, 14px SemiBold
Border: 1px Red-200
Hover: Red-200 background
```

**Strict rules:**
- Gold button variant is REMOVED (currently `btn-primary bg-gold`) — only Navy for CTAs
- Arrow icon in primary button is REMOVED — use button text to communicate direction
- All buttons require `aria-label` when icon-only
- No min-height below 44px on any interactive element

---

### Button Groupings — Max 2 Per Section

Never show more than 2 buttons of equal visual weight on the same screen level. When 3+ actions exist, use a dropdown or action list.

---

## Mobile-First Design Adjustments

### Touch-First Interaction Model

All interactive elements must be designed for thumb operation first:

**Thumb zones on mobile (375px width):**
- Safe zone (easy reach): Bottom 60% of screen
- Stretch zone: Top 30%
- Dead zone: Top 10% (difficult to reach with one hand)

**Implication:** Primary CTAs belong at the bottom of their section or page. Navigation belongs at the bottom. Secondary actions at top are acceptable (back buttons, close buttons).

---

### Mobile-Specific Layouts

**Forms:** Single column always. No multi-column form rows on mobile.

**Cards:** Single column below 640px. 2-column max at 640px. No 3-column card grids on mobile.

**Tables:** Replace tables with accordion-style mobile cards below 640px:
```
┌────────────────────┐
│ 12 May 2026        │
│ Membership Renewal │
│ ● Success          │
└────────────────────┘
```

**Navigation tabs:** Show max 3 tabs visibly. Additional tabs in "More" overflow. No horizontal scroll tabs without scroll indicator gradients.

---

### Typography Adjustments for Mobile

```
H1 (mobile): clamp(24px, 6vw, 32px)    — Not 60px
H2 (mobile): clamp(20px, 5vw, 26px)
H3 (mobile): clamp(17px, 4vw, 20px)
Body:        16px minimum always
Caption:     13px minimum on mobile    — Never 10px/9px
```

---

## UI Consistency Rules

### Component Consistency Checklist

| Component | Border Radius | Shadow | Background |
|-----------|--------------|--------|-----------|
| Card | 12px | shadow-sm | White |
| Modal | 16px | shadow-lg | White |
| Dropdown | 10px | shadow-md | White |
| Button | 8px | shadow-xs | Varies |
| Input | 8px | none | White |
| Pill/Badge | 999px | none | Varies |
| Toast | 8px | shadow-md | Contextual |

**Rule:** These values are FIXED. Components cannot deviate without design system approval.

---

### Iconography Rules

- **Icon set:** Lucide (already in use — keep)
- **Sizes:** 16px (inline), 20px (card icons), 24px (nav), 32px (feature icons)
- **Color:** Inherits text color by default. Only use colored icons for semantic purposes (green = success, red = error)
- **No:** Emoji as UI icons. Emoji in button labels. Flag emoji for language toggles.

---

### Spacing Rules

- **Section vertical padding:** 64px desktop, 48px mobile
- **Card internal padding:** 24px desktop, 16px mobile
- **Between cards in grid:** 16px
- **Form field spacing:** 20px between fields
- **Label to input gap:** 6px
- **Error message to input gap:** 4px
- **CTA group spacing:** 12px between buttons in same group

---

## Visual Simplification Opportunities

### What Should Be REMOVED

1. **Dot grid background on body** — Visual noise. Replace with clean Gray-50.
2. **Animated text gradient** on hero headline — Distracting. Use static Navy text.
3. **Fraunces serif → Instrument Serif or Playfair** — More appropriate for institutional brand.
4. **Government stripe (3px)** — Too subtle to signal authority. Remove or expand to a proper trust bar.
5. **Scrolling ticker bar** — Replace with a collapsible announcement banner.
6. **Stacking card scroll animation** — Technically impressive but confusing. Replace with simple grid.
7. **`motion.div` underline SVG animation** on active nav — Reduce to simple 2px underline.
8. **Ambient glow orbs** in hero background — Remove. Trust is built by clarity, not visual effects.
9. **`text-[9px]`/`text-[10px]`** anywhere — All removed, replaced with 12px+ text.
10. **Gold button variant** — Remove. Navy is the only CTA color.
11. **`card-interactive:hover translateY(-5px)`** on touch — Disabled on mobile. Use border-color change only.

### What Should Be SIMPLIFIED

1. **Hero → One decision, not 4** — Remove search box, reduce to 2 CTA paths
2. **Dashboard → 2 tabs for members** (not 4)
3. **Service cards → Simple grid** (not sticky-stacking)
4. **Navigation → 5 items flat** (no mega-dropdowns)
5. **Form validation → Inline, not toast** — Reduce toast volume by 80%
6. **Stats section → 4 numbers maximum** — Remove supplementary text clutter

### What Should Become Visually Dominant

1. **Membership CTA** — Should own the most visual weight on home page
2. **Member ID card** — The "proof of value" moment. Make it impressive.
3. **Success state** — Registration completion deserves full celebration
4. **Trust signals** — Registration number, certification, member count near the fold
5. **Service descriptions** — Benefits-first, clear action paths

---

*This document feeds into: `04_component_execution_plan.md`*
