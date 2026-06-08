# Component Execution Plan — Tamil Nadu Vanigargalin Sangamam (TNVS) Portal
> Input: `outputs/03_visual_redesign_direction.md`  
> Role: Senior Frontend Architect + Product Designer  
> Stack: React (TanStack Router), TypeScript, Tailwind CSS v4, Lucide Icons

---

## Header Changes

### Current Issues
- Three-layer stack (gov stripe → ticker → nav) consumes 99px of viewport
- Desktop nav only visible at `xl:` (1280px+) — tablet users get mobile hamburger
- Language toggle is ambiguous (shows current language, not target)
- Header height causes 99px content offset hardcoded in layout

### Redesign Goal
- Single-layer header: 64px fixed height
- Navigation visible from `lg:` (1024px+)
- Remove ticker bar; replace with dismissible announcement component
- Remove 3px gov stripe; integrate trust signal into logo area

### Exact UI Changes

**File: `src/components/SiteHeader.tsx`**

```
CURRENT Structure:
  <header>
    <div class="gov-stripe h-[3px]" />          → REMOVE
    <div class="bg-primary ticker">             → REMOVE (create AnnouncementBanner.tsx)
    <div class="h-16 grid grid-cols-[1fr_auto_1fr]">
      [Logo] [Nav] [Controls]
```

```
NEW Structure:
  <header class="h-16 fixed top-0 ...">
    <div class="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
      [Logo Area]     [Nav Center]     [Action Cluster]
```

**Logo Area Changes:**
- Keep TNVS logo image (40px × 40px)
- Add a 2px Navy-700 left border to logo container (subtle authority signal)
- Text: "Tamil Nadu Vanigargalin Sangamam" — SemiBold 13px
- Tamil subtitle: Remove from header (too dense at 64px height)
- Add "Reg. 2012/TNVS" badge — 10px, Gray-500, between logo and nav

**Navigation Changes:**
- Show from `lg:` (1024px) not `xl:` (1280px)
- 5 items: Home, Services, Directory, Wings, Help
- Active state: 2px Navy-700 underline (bottom), no animation — `border-b-2 border-primary`
- Hover state: Gray-100 rounded-lg background, no border
- Remove framer-motion SVG underline animation entirely
- Dropdown: Max 4 items, no sub-expanded categories panel

**Action Cluster Changes:**
- Language toggle: Plain text `EN / தமிழ்` with a `|` divider, no button border
- My Account link: Icon + "My Account" text (no "எனது கணக்கு" in header — space constraint)
- Join Now: Navy-700 button, White text, 8px radius, 40px height (desktop)

**Scroll Behavior Changes:**
- Keep hide-on-scroll-down, show-on-scroll-up logic
- Scrolled state: White bg at 95% opacity, blur 12px
- Top state: White bg at 100% opacity (no blur at top — not needed)
- Remove `backdropFilter` at top — adds unnecessary GPU load

**Responsive Behavior:**
- Desktop (1024px+): Full nav visible
- Tablet (768px–1023px): Logo + hamburger only
- Mobile (<768px): Logo + hamburger only

---

## Sidebar Changes

### Current Issues
- No sidebar exists on most pages — all content is full-width with internal tabs
- Dashboard lacks side navigation for section switching

### Redesign Goal
- Add left sidebar to dashboard (desktop only) for section navigation
- Mobile: sidebar collapses to top horizontal tab strip

### Exact UI Changes

**File: `src/routes/dashboard.tsx` (new sidebar section)**

```jsx
// Desktop sidebar (lg:block)
<aside class="hidden lg:flex lg:w-[260px] shrink-0 flex-col gap-2 bg-white border-r border-gray-200 p-4">
  <MemberCardCompact />   {/* Identity card mini version */}
  <nav class="mt-4 space-y-1">
    <SideNavItem to="overview"   icon={<Home />}    label="My Membership" />
    <SideNavItem to="services"   icon={<FileText />} label="Services" />
    <SideNavItem to="loans"      icon={<Coins />}    label="Loan Portal" />
    {isCoordinator && (
      <SideNavItem to="recruiter" icon={<Users />} label="My Members" />
    )}
  </nav>
</aside>
```

**SideNavItem visual spec:**
- Inactive: Gray-700 text, Gray-500 icon, transparent background
- Active: Navy-700 text, Navy-700 icon, Navy-50 background, 6px border-radius
- Height: 40px, 12px horizontal padding, 8px gap icon-to-label
- Label: 14px SemiBold

---

## Navigation Improvements

### Current Issues
- `BottomNavigation.tsx` and `SiteHeader.tsx` have different labels for equivalent routes
- Bottom nav "Services" → `/members` (wrong — services are at `/members`, but label implies `/services`)
- No active indicator on bottom nav that highlights correctly for sub-routes

### Redesign Goal
- Consistent labels across top and bottom navigation
- Bottom nav active indicator: pill background (not just color change)

### Exact UI Changes

**File: `src/components/BottomNavigation.tsx`**

```jsx
// NEW nav items
const BOTTOM_NAV = [
  { to: "/",          icon: Home,         label: "Home",      labelTa: "முகப்பு" },
  { to: "/services",  icon: LayoutGrid,   label: "Services",  labelTa: "சேவைகள்" },
  { to: "/members",   icon: Users,        label: "Directory", labelTa: "பட்டியல்" },
  { to: "/dashboard", icon: User,         label: "Account",   labelTa: "கணக்கு" },
  { to: "/assistant", icon: HelpCircle,   label: "Help",      labelTa: "உதவி" },
];
```

**Active state redesign:**
```
CURRENT: text-primary color change only
NEW: 
  active: Navy-700 icon + Navy-700 label + Navy-50 rounded pill (36px × 32px)
  inactive: Gray-400 icon + Gray-600 label
```

**Height:** Increase from 60px to 64px (better touch targets, visual breathing room)

---

## Dashboard Card Changes

### Current Issues
- Premium member card uses gradient background + glow effects — visually heavy
- Member info shown in `grid-cols-2` mini-cells with very small text
- Quick action grid uses tiny icon containers

### Redesign Goal
- Clean Navy card — no gradient, no glow
- Readable member info at 14px minimum
- Quick actions as prominent buttons, not small tiles

### Exact UI Changes

**Member Identity Card — New:**

```jsx
<div class="bg-[oklch(0.25 0.14 255)] rounded-2xl p-6 text-white">
  {/* Top row: photo + ID */}
  <div class="flex items-center gap-4 pb-4 border-b border-white/10">
    <img class="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400" />
    <div>
      <div class="text-[10px] text-white/50 uppercase tracking-widest">Membership ID</div>
      <div class="text-base font-bold font-mono text-amber-300">{epicId}</div>
    </div>
    <img src={orgLogo} class="ml-auto w-9 h-9" />
  </div>

  {/* Info grid — 2 per row, 14px minimum */}
  <div class="mt-4 grid grid-cols-2 gap-3">
    <InfoCell label="Name" value={member.name} />
    <InfoCell label="District" value={member.district} />
    <InfoCell label="Assembly" value={member.assembly} />
    <InfoCell label="Class" value={member.type} />
  </div>

  {/* Footer */}
  <div class="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
    <span class="text-xs text-white/60">Valid until <strong class="text-white">Dec 2026</strong></span>
    <StatusPill status="active" />
  </div>
</div>
```

**InfoCell redesign:**
```jsx
// Remove white/5 background cells — use clean inline layout
<div class="text-left">
  <div class="text-[11px] text-white/50 uppercase tracking-wide">{label}</div>
  <div class="text-sm font-semibold text-white mt-0.5">{value}</div>
</div>
```

**Quick Action Buttons — Larger:**
```
CURRENT: Small tiles, 90px min-height, 9px icon bg
NEW: 
  Full-width buttons, 52px height, Icon 20px left-aligned, label + sub-label stacked right
  Example: [↓ icon] Download Certificate / High-res PDF
```

---

## Table Improvements

### Current Issues
- Tables use `display: block; overflow-x: auto` globally — causes layout issues
- Activity table header has no visual distinction from rows
- Mobile table is replaced by `ActivityCard` — inconsistent data presentation

### Redesign Goal
- Consistent table styles with clear headers
- Mobile: Card list (keep ActivityCard approach — it works better)
- Header row: Gray-50 background, uppercase 12px labels

### Exact UI Changes

**File: `src/routes/dashboard.tsx` — Activity table**

```css
/* Table header */
thead tr {
  background-color: oklch(0.97 0.004 252);  /* Gray-50 */
  border-bottom: 2px solid oklch(0.92 0.006 252);
}
thead th {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: oklch(0.55 0.01 252);  /* Gray-500 */
  padding: 10px 16px;
}

/* Table rows */
tbody tr {
  border-bottom: 1px solid oklch(0.95 0.004 252);
  min-height: 48px;
  transition: background-color 150ms;
}
tbody tr:hover {
  background-color: oklch(0.985 0.002 252);
}
tbody td {
  padding: 12px 16px;
  font-size: 13px;
}
```

**Members directory table (members.tsx):**
- Business cards: Increase to 2-column on tablet, 3-column on desktop (same as now)
- Avatar: increase from `w-14 h-14` to `w-16 h-16`
- Business name: 16px Bold (increase from 14px)
- Meta info: 13px (increase from 12px)

---

## Form Improvements

### Current Issues
- Step 1 has 16 fields with no visual grouping
- Labels use `font-mono text-[10px] uppercase` — unreadable
- Validation only on submit — no real-time feedback
- DOB uses 3 separate dropdowns (year/month/day)

### Exact UI Changes

**File: `src/routes/membership.tsx`**

**Step 1 — Break into 3 sub-steps:**

```
Sub-step 1: Identity (3 fields)
  Full Name (required)
  EPIC / Voter ID Number (required) — with inline hint "Format: RJE1234567"
  Mobile Number (required)

Sub-step 2: Location & Business (4 fields)
  District (dropdown — already has list)
  Assembly Constituency (text)
  Shop / Business Name (required)
  Business Wing (visual category picker — 4 category → 8–10 wing grid)

Sub-step 3: Additional Details (optional emphasis)
  Email Address (optional)
  Date of Birth (single HTML date input, not 3 dropdowns)
  Gender (3 radio buttons)
  Blood Group (dropdown)
  Business Address (textarea)
  Years in Business (number input)
```

**Label redesign:**
```
CURRENT: class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono"
NEW: class="text-sm font-semibold text-gray-700 block mb-1.5"
```

**Input redesign:**
```
CURRENT: class="bg-slate-50 border border-slate-150 rounded-2xl pl-11 pr-4 py-3 text-xs..."
NEW: class="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base focus:border-navy-700..."
  Min-height: 52px (mobile), 44px (desktop)
  Font size: 16px always (prevent iOS zoom)
```

**Date of Birth — Replace 3 dropdowns with:**
```jsx
<input type="date" 
  className="input-base" 
  max={maxDob}
  min={minDob}
  onChange={handleDobChange}
/>
```

**Wing Picker — Visual grid:**
```jsx
// Category grid first
<div class="grid grid-cols-2 gap-3 mb-4">
  {WING_CATEGORIES.map(cat => (
    <button onClick={() => setSelectedCategory(cat.id)}
      class={`p-4 rounded-xl border-2 text-left transition
        ${activeCategory === cat.id ? 'border-navy-700 bg-navy-50' : 'border-gray-200'}`}
    >
      <div class="font-semibold text-sm">{cat.nameEn}</div>
      <div class="text-xs text-gray-500 mt-1">{cat.wings.length} wings</div>
    </button>
  ))}
</div>

// Wing grid (filtered by category)
{selectedCategory && (
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
    {filteredWings.map(wing => (
      <button onClick={() => setSelectedWing(wing.id)}
        class={`px-3 py-2.5 rounded-lg border text-sm text-left transition
          ${selectedWing === wing.id ? 'border-navy-700 bg-navy-50 text-navy-700 font-semibold' : 'border-gray-200'}`}
      >
        {wing.nameEn}
      </button>
    ))}
  </div>
)}
```

**Real-Time Validation:**
```jsx
// EPIC field example
const [epicStatus, setEpicStatus] = useState<'idle'|'valid'|'invalid'>('idle');

<div class="relative">
  <input
    onBlur={() => {
      const valid = /^[a-zA-Z]{3}\d{7}$/.test(form.epic);
      setEpicStatus(valid ? 'valid' : form.epic.length > 0 ? 'invalid' : 'idle');
    }}
    {...} 
  />
  {epicStatus === 'valid' && <CheckCircle class="absolute right-3 top-3.5 w-5 h-5 text-green-500" />}
  {epicStatus === 'invalid' && <X class="absolute right-3 top-3.5 w-5 h-5 text-red-500" />}
</div>
{epicStatus === 'invalid' && (
  <p class="mt-1 text-xs text-red-600">Format: 3 letters + 7 digits (e.g. RJE1234567)</p>
)}
```

---

## Button System Improvements

### Current Issues
- `btn-primary bg-gold text-gold-foreground` variant exists — non-standard, confusing
- Arrow icons in buttons (`ArrowRight`) slide on hover — distracting
- `btn-ghost` underlines on hover — bad UX for button behavior

### Exact UI Changes

**File: `src/styles.css` — Button tokens**

```css
/* PRIMARY — Navy */
.btn-primary {
  background-color: oklch(0.30 0.14 255);  /* Navy-700 */
  color: white;
  font-size: 15px;
  font-weight: 600;
  padding: 0 24px;
  height: 48px;         /* mobile */
  border-radius: 8px;
  border: none;
  /* Remove: translateX arrow animation */
  /* Keep: scale(0.97) active state */
  /* Keep: box-shadow on hover */
}

@media (min-width: 768px) {
  .btn-primary { height: 44px; }
}

/* REMOVE: Gold button variant completely */
/* Any gold CTAs are redesigned to use .btn-primary */

/* GHOST — fix underline on hover */
.btn-ghost:hover {
  background-color: oklch(from var(--color-primary) l c h / 0.06);
  /* REMOVE: text-decoration: underline; */
}
```

**Remove Arrow Icons from Button Text:**
```jsx
// CURRENT (many locations):
<Link className="btn-primary">
  <Users /> Apply for Membership <ArrowRight />
</Link>

// NEW:
<Link className="btn-primary">
  Apply for Membership
</Link>
```

**Reason:** Arrow icons add visual noise and the "sliding arrow" animation is a distraction. Button text should communicate direction, not icons.

---

## Modal Improvements

### Current Issues
- Loan application modal uses a "chat" UI flow with no visible progress indicator
- Modal close button (`X`) is 32px with minimal visual affordance
- Modal backdrop has blur effect causing performance issues on low-end devices

### Exact UI Changes

**File: `src/routes/members.tsx` — Modal component**

**Close button:**
```jsx
// CURRENT: Small X in top-right corner
// NEW: Larger, with text label on desktop
<button class="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition p-2 rounded-lg hover:bg-gray-100">
  <X class="w-5 h-5" />
  <span class="text-sm hidden sm:inline">Close</span>
</button>
```

**Modal overlay:**
```css
/* CURRENT: backdrop-blur-md (GPU heavy) */
/* NEW: Simple dark overlay, no blur */
.modal-overlay {
  background-color: rgba(0, 0, 0, 0.45);
  /* no backdrop-filter */
}
```

**Loan Chatbot → Step Form:**
```
CURRENT: Sequential chatbot messages with input
NEW: 3-step form with clear progress:
  Step 1: Select loan type (visual card grid)
  Step 2: Fill details (4 fields max)
  Step 3: Confirm + Submit
```

**Progress indicator inside modal:**
```
○── ─ ─ ── ○── ─ ─ ── ○
1           2           3
Loan Type   Details   Confirm
```

---

## Empty State Improvements

### Current Issues
- Empty states show icon + 2 lines of text only
- No actionable suggestion when directory is empty
- Empty states don't adapt to which tab/filter caused the empty result

### Exact UI Changes

**File: `src/components/EmptyState.tsx`**

```jsx
function EmptyState({ tab, hasFilters, onClearFilters }) {
  return (
    <div class="py-20 flex flex-col items-center text-center max-w-sm mx-auto gap-4">
      <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <SearchX class="w-8 h-8 text-gray-400" />
      </div>
      
      <div>
        <h3 class="text-lg font-semibold text-gray-900">
          {hasFilters ? 'No results match your filters' : 'No records found'}
        </h3>
        <p class="text-sm text-gray-500 mt-1">
          {hasFilters 
            ? 'Try adjusting or clearing your search filters.'
            : tab === 'businesses' 
              ? 'No businesses are registered in this area yet.'
              : 'No members found with current criteria.'}
        </p>
      </div>

      {hasFilters && (
        <button onClick={onClearFilters} class="btn-secondary text-sm py-2 px-4">
          Clear all filters
        </button>
      )}

      {tab === 'businesses' && !hasFilters && (
        <Link to="/membership" class="btn-primary text-sm py-2 px-4">
          Register Your Business →
        </Link>
      )}
    </div>
  );
}
```

---

## Error State Improvements

### Current Issues
- API error shows `AlertCircle` + error message text — useful for developers, not users
- No retry button in error state

### Exact UI Changes

```jsx
function ErrorState({ error, onRetry }) {
  return (
    <div class="py-16 flex flex-col items-center text-center max-w-sm mx-auto gap-4 bg-red-50 rounded-2xl border border-red-100 p-8">
      <AlertCircle class="w-10 h-10 text-red-400" />
      <div>
        <h3 class="text-base font-semibold text-red-800">Something went wrong</h3>
        <p class="text-sm text-red-600 mt-1">
          We couldn't load this data. Please try again.
        </p>
      </div>
      <button onClick={onRetry} class="btn-secondary text-sm py-2 px-4">
        ↺ Try Again
      </button>
    </div>
  );
}
```

---

## Responsive Design Tasks

### Breakpoint Strategy

```
Mobile first: < 640px (sm)
Small:        640px (sm)
Medium:       768px (md)
Large:        1024px (lg)   ← Desktop nav shows HERE (not xl)
XLarge:       1280px (xl)   ← Max content width
```

**Key breakpoint changes:**
- Desktop nav: `xl:` → `lg:` (from 1280px to 1024px)
- Bottom nav hidden: `xl:hidden` → `lg:hidden`
- Dashboard sidebar: visible from `lg:` (1024px)
- 3-column card grids: from `md:` (768px), not `lg:`

### Responsive Checklists by Component

**Header:**
- [x] 64px height at all breakpoints
- [ ] Logo only on <640px (hide organization name text)
- [ ] Hamburger visible <1024px
- [ ] Full nav visible ≥1024px

**Hero:**
- [ ] Single-column <768px
- [ ] Image hidden <640px (text only)
- [ ] CTA buttons: full-width <640px, auto-width ≥640px
- [ ] No search box on hero (moved to dedicated page)

**Cards:**
- [ ] 1-column <640px
- [ ] 2-column 640px–1023px
- [ ] 3-column ≥1024px

**Forms:**
- [ ] Single-column always
- [ ] Progress steps: show numbers only <640px, show labels ≥640px
- [ ] Submit button: full-width <640px

**Tables:**
- [ ] Mobile: Card list view (ActivityCard pattern)
- [ ] Tablet+: Table view with horizontal scroll if needed

---

## Mobile Interaction Improvements

### Touch Target Audit

All interactive elements must meet these minimum sizes:

| Element | Current | Required | Change |
|---------|---------|---------|--------|
| Form inputs | 44px | 52px (mobile) | +8px |
| Primary buttons | 48px | 48px | OK |
| Nav tab items | ~48px | 52px | +4px |
| Bottom nav items | 48px | 56px | +8px |
| Close button (X) | ~32px | 44px | +12px |
| Accordion trigger | 44px | 48px | +4px |
| Quick action tiles | ~90px | 80px min-width | OK |

### Gesture Improvements

**Swipe to dismiss modals:** Add touch swipe-down gesture to close bottom-sheet style modals.

**Pull-to-refresh:** Not implemented — consider adding to member directory for real-time data refresh.

**Tap feedback:** All interactive elements should show `active:scale-[0.98]` on tap for tactile feedback confirmation.

---

## Frontend Handoff Notes

### CSS Token Updates Required

**File: `src/styles.css`**

```css
/* CHANGES to :root */
:root {
  /* Remove */
  --parchment: ...;         /* unused after redesign */
  --dot-color: ...;         /* dot background removed */
  
  /* Add */
  --surface-page: oklch(0.985 0.002 252);   /* Gray-50 page bg */
  --surface-card: oklch(1 0 0);              /* White card bg */
  --surface-raised: oklch(0.97 0.004 252);   /* Gray-100 */
  
  /* Update */
  --background: var(--surface-page);  /* Remove warm parchment tone */
  
  /* Remove body dot pattern */
  /* body { background-image: radial-gradient(...) } → REMOVE */
}
```

### Framer Motion — Usage Reduction

Current framer-motion usage:
- `motion.div` for nav underline animation → Replace with CSS transition
- `AnimatePresence` for video play overlay → Keep (this is fine)
- `motion.button` for play button → Keep
- Dashboard tab content transitions → Keep (adds meaningful UX context)

**Bundle saving:** Removing framer-motion from `SiteHeader.tsx` and `index.tsx` (where it's imported for small effects) may reduce bundle size.

### Import Optimization

```tsx
// CURRENT (SiteHeader.tsx imports framer-motion for 1 animation):
import { motion } from "framer-motion";

// NEW: Replace with CSS-only active indicator
// Remove framer-motion import from SiteHeader.tsx
```

### Splash Screen Timing

**File: `src/routes/__root.tsx`**

```tsx
// CURRENT: 2.2 seconds + 0.55 fade = 2.75s block
const fadeTimer = setTimeout(() => { setIsFadingOut(true); }, 2200);

// NEW: 800ms + 300ms fade = 1.1s block
const fadeTimer = setTimeout(() => { setIsFadingOut(true); }, 800);
```

### `window.confirm` Replacement

**File: `src/routes/membership.tsx`**

```tsx
// CURRENT: 
if (window.confirm("Are you sure you want to clear your registration draft?")) {...}

// NEW: Create a simple inline confirmation UI
const [showClearConfirm, setShowClearConfirm] = useState(false);
// Render: A small warning card below the "Clear Draft" button
```

---

## Component Priority Order

Execute in this sequence to minimize regressions:

### Phase 1 — Foundation (No UI visible impact)
1. Update CSS tokens in `styles.css` (remove dot bg, update spacing, fix btn-ghost underline)
2. Update splash timing in `__root.tsx` (2.75s → 1.1s)
3. Fix form label HTML (`htmlFor` + `id` associations)
4. Add `aria-live` to announcement/ticker content
5. Update `<html lang>` SSR attribute handling

### Phase 2 — Navigation (High impact, affects all pages)
6. Redesign `SiteHeader.tsx` — remove ticker bar, update height to 64px
7. Create `AnnouncementBanner.tsx` (dismissible, replaces ticker)
8. Redesign `BottomNavigation.tsx` — update labels, active pill style
9. Update `breakpoint: xl` → `lg` for nav visibility threshold

### Phase 3 — Home Page (Conversion critical)
10. Simplify hero — remove search box, add YES/NO split CTA
11. Add membership fee (₹500) below primary CTA
12. Move trust signals adjacent to CTA (not below stats)
13. Update stats section — remove background patterns
14. Remove framer-motion import from SiteHeader and hero where replaced by CSS

### Phase 4 — Membership Form (Highest friction point)
15. Split Step 1 into 3 sub-steps
16. Replace 3-dropdown DOB with single `<input type="date">`
17. Implement real-time validation (blur-based, not submit-based)
18. Redesign wing picker (category grid → wing grid)
19. Replace `window.confirm` with inline confirmation UI

### Phase 5 — Dashboard
20. Add sidebar navigation (desktop) / segmented tabs (mobile)
21. Redesign member identity card (no gradient, readable text)
22. Expand quick action buttons (full-width, 52px)
23. Implement role-gated views (Member vs. Coordinator)

### Phase 6 — Members Page
24. Separate services to `/services` route
25. Remove sticky-stacking scroll animation
26. Implement simple CSS grid for service cards
27. Improve empty state and error state components

### Phase 7 — Polish
28. Update button system (remove gold variant, remove arrow animations)
29. Update modal close button (larger, labeled)
30. Update table styles (header background, row heights)
31. Audit all remaining `text-[10px]`/`text-[9px]` instances
32. Final accessibility pass (focus states, ARIA labels)
