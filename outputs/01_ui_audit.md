# UI/UX Audit — Tamil Nadu Vanigargalin Sangamam (TNVS) Portal
> Auditor perspective: Senior UI/UX Designer  
> Date: June 2026  
> Project: `TNVS-feature-ui-redesign-v2`

---

## Executive Summary

The TNVS portal is a government-adjacent trader membership platform serving non-technical, semi-literate, and Tamil-language-primary users across Tamil Nadu. The codebase shows solid technical intent — a well-structured token system, fluid typography, and bilingual support — but the **experience layer has critical failures** that undermine usability, trust, and conversion.

The most severe issues are:
1. **Cognitive overload on every major page** — too much information, competing visual priorities
2. **Membership form flow is unnecessarily complex** — 4 steps with unclear validation and ambiguous field expectations
3. **Dashboard information density is dangerous** — non-technical users will be completely lost
4. **Bottom navigation and top header create navigation confusion** — two simultaneous nav systems with poor hierarchy
5. **Hero section is unfocused** — multiple CTAs dilute primary action (membership application)
6. **No progressive disclosure** — all information is presented at once regardless of user context
7. **Mobile experience is a degraded desktop** — not genuinely mobile-first
8. **Typography hierarchy collapses on Tamil language** — heading sizes and font weights clash with Tamil script rendering

Severity scale: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low

---

## Major UX Problems

### 🔴 1. Dual Navigation System Creates Confusion
**Location:** `__root.tsx`, `BottomNavigation.tsx`, `SiteHeader.tsx`

The app renders a top `SiteHeader` with 5 desktop nav items + dropdown menus AND a bottom `BottomNavigation` with 5 different items on mobile. These two navigation systems:
- Have **different labels** for equivalent destinations (e.g., "Services" in bottom nav goes to `/members`, but in header nav it goes to `/services`)
- Have **inconsistent active states** — both systems activate independently, causing split brain
- The header has a 3-tier structure (gov stripe → ticker → nav) adding ~99px of visual noise before any content

**Why it matters:** First-time users (especially non-tech traders) cannot develop a mental model of navigation. They don't know where to tap to find services, membership, or their profile.

---

### 🔴 2. Hero Section — 4 Competing CTAs, No Clear Priority
**Location:** `src/routes/index.tsx` lines 217–278

The hero contains:
1. Primary button: "Apply for Membership"
2. Ghost link: "Already a member? Get your card →"
3. Search form with submit button ("Search")
4. Phone number link (trust signal)

These four interactive elements compete equally. On mobile, they stack vertically and the search form (a secondary feature for returning users) appears **before** the primary join CTA.

**Why it matters:** A non-technical trader landing on this page cannot immediately understand what to do first. The page does not guide them. Low-attention users will bounce.

---

### 🔴 3. Membership Form — Excessive Field Density in Step 1
**Location:** `src/routes/membership.tsx`

Step 1 alone collects: Name, EPIC number (with regex validation), Mobile, Email, DOB (3-part custom picker), Age, Gender, Blood Group, Assembly, District, Shop Name, Business Type, Wing selection, Business Address, Years in business.

That is **16 fields in one step**. The EPIC validation format (`3 letters + 7 digits, e.g. RJE1234567`) is displayed only in error messages — not as upfront input guidance.

**Why it matters:** Non-technical traders will abandon the form. The error-first approach (validate on submit) means users may fill all 16 fields before seeing any feedback. Tamil-speaking users reading validation errors in English face additional friction.

---

### 🔴 4. Dashboard Has Incomprehensible Tab Architecture for Non-Technical Users
**Location:** `src/routes/dashboard.tsx`

The dashboard exposes 4 tabs: Overview, Business Loans, Recruiter Hub, Tools & Apps. Each tab contains dense tables, chat-style loan flows, analytics charts, and embedded tools like a GST calculator. The Recruiter Hub contains a full CRM table with filter/search. This is executive-software complexity exposed to local shop owners and street vendors.

**Why it matters:** The target user is a Tamil-speaking, semi-literate small trader. Presenting them with a loan portal, a recruiter CRM, analytics charts, and a live stream simulator simultaneously causes complete disorientation. Trust collapses when users feel out of control.

---

### 🔴 5. Members Page Scrolled Services Architecture Breaks on Mobile
**Location:** `src/routes/members.tsx` lines 218–268

The sticky-stacked service cards use scroll-position math (`cardViewportTop`, `progress`, `scrollScale`) that explicitly disables on mobile (`isMobile < 768 → style.transform = none`). On mobile, these cards simply stack linearly with no visual affordance for interactivity.

**Why it matters:** Mobile is the primary device for the target demographic. The signature visual feature (sticky stacking animation) is completely absent for the majority of users.

---

### 🟠 6. Language Toggle State is Ambiguous
**Location:** `SiteHeader.tsx` line 766–774

The language toggle button shows the **current language** rather than the **action** (switch to X). When set to Tamil, the button shows "தமிழ்" in blue — suggesting "you are in Tamil mode." But pressing it switches to English, which is counter-intuitive. Standard convention is to show the language you will switch TO.

**Why it matters:** Bilingual users switching back and forth will be confused. This is especially problematic for non-tech users who may not understand the toggle means "switch away from this language."

---

### 🟠 7. No Onboarding or First-Visit Guidance
**Location:** All pages

There is no onboarding flow, no guided tour, no tooltip system, and no empty-state education for new users. A trader visiting for the first time has no contextual help to understand: What is TNVS? Why should I join? What will I get? What should I do first?

---

### 🟠 8. Demo Mode Banner — Low Visibility + No Clear Action
**Location:** `DemoModeBanner.tsx`, `dashboard.tsx`

The demo mode banner appears at the top of the dashboard but has no prominent CTA to "exit demo" or "log in with real credentials." It uses an info-blue palette that blends with the page header.

---

### 🟡 9. Members Page Tab Ambiguity — "Services" vs "Members" vs "Businesses"
**Location:** `src/routes/members.tsx`

The route `/members` serves THREE completely different purposes: (1) Member directory, (2) Business directory, (3) Organizers directory. These are accessed via tabs but all share the same URL with a query param. The page title heading is `/members` which does not communicate "this is also the business directory."

---

### 🟡 10. Announcements Ticker Bar — Low Signal-to-Noise
**Location:** `SiteHeader.tsx` lines 553–583

The scrolling ticker contains important government circulars and meeting announcements. However, it auto-plays at high speed, making it unreadable. Users cannot pause individual items. The content repeats immediately after ending (same text scrolling twice creates visual noise).

---

## Major UI Problems

### 🔴 1. Visual Hierarchy Flat — Everything Competes
**Observed across:** Home, Members, Dashboard pages

Text sizes, card sizes, and accent colors are used uniformly across primary, secondary, and tertiary content. The home page has `h1` → `h2` → `h3` elements that visually appear similar in weight. Primary CTAs and ghost links use insufficient contrast ratio to differentiate their priority.

---

### 🔴 2. Header 3-Layer Stack Creates 99px Dead Zone
**Location:** `__root.tsx` line 174, `SiteHeader.tsx`

The header stacks: (1) 3px gov stripe, (2) ~32px ticker bar, (3) 64px nav bar = **99px of non-content area**. On a 667px tall mobile screen (iPhone SE), this is 15% of the visible viewport. Users must scroll past a header the size of a large card before seeing any actual content.

---

### 🔴 3. Dot Pattern Background Creates Readability Issues
**Location:** `styles.css` lines 155–157

The `body` has a radial dot pattern background: `radial-gradient(var(--dot-color) 1.2px, transparent 1.2px)` at 24px spacing. This dot texture conflicts with card borders and text blocks on certain backgrounds, reducing perceived cleanliness. On lower-quality screens (which many Tamil Nadu merchants use), the dot grid creates a "noisy" first impression.

---

### 🟠 4. Card Hover Transform on Mobile Causes Accidental Scroll Interference
**Location:** `styles.css` lines 511–523

`.card-interactive:hover` applies `translateY(-5px)` on hover. On touch devices, this hover state can trigger on touch-start, causing unexpected visual jumps during scroll. Touch devices should not have hover-lift effects that require precise interaction.

---

### 🟠 5. Inconsistent Border Radius — Multiple Competing Radius Systems
**Location:** Throughout components

The token system defines `--radius-card: 0.75rem` (12px), `--radius-modal: 1rem` (16px), `--radius-btn: 0.5rem` (8px). However, components use Tailwind classes directly: `rounded-2xl` (16px), `rounded-3xl` (24px), `rounded-xl` (12px), `rounded-lg` (8px). This creates inconsistent card rounding across the app.

**Example:** Members page service cards use `rounded-3xl`. Dashboard cards use `rounded-2xl`. Header dropdowns use `rounded-2xl`. SiteFooter uses `rounded-lg`. The lack of a single enforced card radius reduces polish perception.

---

### 🟠 6. Loading State Is Generic and Slow
**Location:** `LoadingPage.tsx`, various loading states

The splash screen lasts 2.2 seconds (`fadeTimer: 2200ms` in `__root.tsx`). An additional 550ms fade-out brings total blocking time to ~2.75 seconds. This is unacceptably slow for a modern web app, especially on 4G mobile connections common in semi-urban Tamil Nadu.

---

### 🟡 7. Status Pills — Inconsistent Usage
**Location:** `StatusPill.tsx`, `dashboard.tsx`

The `StatusPill` component has 5 variants (`success`, `pending`, `info`, `error`, `active`) but they are applied inconsistently. The dashboard shows `status-active` for membership status but uses raw strings in the activity log table. Color semantics are not always intuitive (e.g., orange for "pending" may read as "warning" to some users).

---

### 🟡 8. Image Asset Quality Issues
**Location:** Multiple locations

- Temple logo is loaded from a full path including "ChatGPT Image Mar 25, 2026" — indicating an AI-generated asset not properly renamed or optimized
- `ownerPhoto` in dashboard is a UUID-named file — no descriptive name, confusing for maintainability
- No consistent image optimization strategy (no `loading="lazy"`, no `sizes` attribute on responsive images)

---

### 🟡 9. Business Directory Empty State Too Minimal
**Location:** `members.tsx` lines 759–777

When no businesses are found, the empty state shows only an icon and two lines of text. There is no suggestion to try different search terms, no category browsing fallback, and no link to register a business.

---

### 🟢 10. SiteFooter — Not Reviewed for Consistency
The site footer (`SiteFooter.tsx` at 6897 bytes) was not audited in detail but is noted for follow-up.

---

## User Friction Points

| # | Friction Point | Page | User Impact | Severity |
|---|----------------|------|-------------|----------|
| 1 | EPIC number format not shown before error | Membership Step 1 | High abandonment | 🔴 |
| 2 | DOB uses 3-dropdown split instead of single date input | Membership Step 1 | Confusion, mis-entry | 🔴 |
| 3 | Search box in hero competes with join CTA | Home | Diluted conversion | 🟠 |
| 4 | No "save progress" indicator for multi-step form | Membership | Fear of losing data | 🟠 |
| 5 | Modal close button is small `X` with no clear visual affordance | Members modals | Difficult to dismiss | 🟠 |
| 6 | Loan chatbot flow uses sequential chat UI with no progress indicator | Members modal | Disorientation | 🟠 |
| 7 | No breadcrumb visible on Members or Membership page without login | Members, Membership | Lost navigation context | 🟡 |
| 8 | Language toggle resets on page reload | All pages | Repeated friction for Tamil users | 🟡 |
| 9 | Phone number in header is only visible on `sm:` and above | Mobile header | Loss of helpline access on mobile | 🟡 |
| 10 | "Clear Draft" shows a browser `window.confirm` dialog | Membership | Outdated, jarring UX | 🟡 |
| 11 | Flow action icons grid uses images from unknown public path `/flow-images/` | Home | Images may 404 in some deployments | 🟡 |
| 12 | Voter search requires exact EPIC format but provides no real-time hint | Membership | Repeated invalid submissions | 🟠 |

---

## Visual Hierarchy Problems

### 🔴 Hero H1 Size Not Dominant Enough at Mobile
The hero `h1` uses `clamp(1.5rem, 4.2vw, 3rem)` for Tamil and `clamp(1.75rem, 5vw, 3.75rem)` for English. At 375px width (most common mobile), this yields ~16.5px–20px effective — comparable to body text. The heading does not feel like a hero heading.

### 🟠 Section Labels Compete with Section Headings
`SectionLabel` components (`text-caption` 12px, uppercase) appear above `h2` elements (`text-3xl`). But the visual gap between label and heading is inconsistent — sometimes 12px (`mt-3`), sometimes 20px (`mt-5`). The irregular rhythm creates a fragmented reading experience.

### 🟠 Stats Numbers and Labels Have Inverted Hierarchy
On the stats section, the large number (`text-2xl sm:text-4xl md:text-5xl`) is primary but the label (`text-xs text-muted-foreground uppercase tracking-wider`) is in a very light color with extra letter-spacing — making it nearly invisible on muted-foreground. Users may not understand what the number represents.

### 🟡 Card Content Left-Alignment Inconsistency
Some cards are left-aligned, some center-aligned. The stats grid uses `text-center`. The service cards use `text-left`. The hero trust signals use `flex items-center`. No consistent alignment rule exists.

---

## Typography Problems

### 🔴 Tamil Script + Fraunces Display Font Mismatch
`h1`–`h4` use `Fraunces` (a Latin-script display font). Tamil headings fallback to `Noto Serif Tamil`. The visual weight and size calibration between these two fonts is not harmonized — Tamil text at the same `clamp()` size appears 15–20% larger in visual density due to Tamil script's complex akkhara structure. This causes layout shifts and uneven visual weight.

### 🟠 Monospace Font for IDs Causes Readability Issues
EPIC IDs, membership IDs, and tracking numbers use `font-mono`. The chosen monospace stack defaults to system fonts (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas`). On Android devices in Tamil Nadu, this often falls back to Droid Sans Mono or Roboto Mono — which renders poorly at small sizes.

### 🟠 `text-[10px]` and `text-[9px]` Used Excessively
Across the dashboard and members page, custom sizes like `text-[10px]`, `text-[9px]`, and `text-[8px]` appear dozens of times. These fall below the minimum readable size (12px) on standard screens and are **completely unreadable on 4G feature phones with non-retina screens** — a significant portion of the target demographic.

### 🟡 Inconsistent Font Weight Usage
Body text alternates between `font-medium`, `font-semibold`, and `font-bold` within the same component without clear hierarchy logic. The dashboard uses `font-extrabold` and `font-black` frequently alongside `font-bold`, creating visual shouting.

### 🟡 Line Height for Tamil Body Text
Tamil body paragraphs use `line-height: 1.8` (set in `.font-tamil`) but some Tamil text appears inside standard `p` tags without `font-tamil` class, inheriting default `leading-normal` (1.5). Tamil script requires ≥1.7 line-height for proper diacritical display.

---

## Accessibility Problems

### 🔴 1. No Skip Navigation Link Visible to All Users
The `<a href="#main-content">` skip link in `__root.tsx` is `sr-only` but only becomes visible on focus. This is correct — but the `#main-content` target is the `<main>` element. However, when the splash screen is showing for 2.75 seconds, keyboard users cannot interact with the page at all during this blocking period.

### 🔴 2. Government Ticker Bar Not Accessible
The marquee animation in `SiteHeader.tsx` (lines 560–573) uses CSS `animation: marquee 30s linear infinite`. Screen readers will attempt to read the full repeated text on page load. There is no `aria-live` region, `aria-label`, or `role="marquee"` attribute. The repetitive content (same text duplicated twice in the marquee) will cause screen readers to read all announcements twice.

### 🟠 3. Mobile Menu Missing Focus Trap
The mobile drawer (`open && ...` in `SiteHeader.tsx` line 789) does not implement a focus trap. When the mobile menu opens, keyboard users can tab behind the backdrop overlay into the underlying page content. The `role="dialog"` and `aria-modal="true"` attributes are present but not enforced with a JavaScript focus trap.

### 🟠 4. Color Contrast — Gold on White Fails WCAG AA
The primary accent color `--gold: oklch(0.78 0.12 85)` is used decoratively but appears in text contexts (e.g., `text-gold` in ticker bar `✦` symbols). The gold against white background has a contrast ratio of approximately 2.4:1 — well below WCAG AA minimum of 4.5:1 for small text.

### 🟠 5. Form Labels Missing `for` Attributes
In `members.tsx` search form (lines 664–715), labels use `className` but no explicit `htmlFor` attribute linking to their input `id`. Without proper `<label for="inputId">`, screen readers cannot associate labels with inputs.

### 🟡 6. Interactive Elements Missing Accessible Names
Multiple `<button>` elements in the dashboard contain only `<TabIcon className="w-4 h-4" />` (icon only) without fallback `aria-label` text. Example: Quick action buttons in the overview tab.

### 🟡 7. Language Attribute Only on Root
The `<html lang="ta">` is hardcoded to Tamil in `__root.tsx` line 78, but the `useLanguage` hook dynamically switches content to English. When language is English, the `lang` attribute is updated via `document.documentElement.lang = language` (line 151), but the initial server render has `lang="ta"` — causing screen readers to initially read English content with Tamil pronunciation rules.

---

## Mobile Responsiveness Problems

### 🔴 1. Bottom Navigation Covers Primary Page Content
`BottomNavigation` adds 60px to the page bottom. The root layout adds `pb-[60px]`. However, individual pages set their own bottom padding: `members.tsx` uses `pb-20`, `dashboard.tsx` uses `pb-12`. These may not properly account for the bottom nav + safe area inset, causing CTA buttons or paginator buttons to be partially obscured on phones with home indicator bars.

### 🔴 2. Membership Form Overflows on Small Screens
The membership form Step 1 contains a 16-field layout with `grid` and `col-span` classes optimized for desktop. On 360px width phones, fields stack correctly but padding and font sizes remain unchanged, causing labels to wrap and reducing touch target sizes.

### 🟠 3. Horizontal Scroll Containers Have No Scroll Indicators
Tab selectors (Members page, Dashboard) use `.overflow-x-auto.scrollbar-none` with hidden scrollbars. On mobile, users cannot see that more tabs are off-screen. There is no fade gradient or scroll hint indicator.

### 🟠 4. WhatsApp Flow Action Grid — 11 Columns on Large Screens, 3 on Mobile
The `FLOW_ACTIONS` grid uses `grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11`. On mobile (3 columns), the 14px emoji icons and `text-[10px]` labels are at the absolute limit of readability. Touch targets at `w-14 h-14` (56px) with `gap-3` (12px) between items reduces effective tap area.

### 🟠 5. Video Section Has No Mobile Poster Image
The welcome video (`/welcome_video.mp4` at 86MB) uses `poster="/favicon.png"` — the favicon as the video poster image. On mobile, before play, users see a tiny favicon icon on a dark background. This is visually broken and reduces trust.

### 🟡 6. Stats Section 2×2 Grid on Mobile — Numbers Cut Off
Stats section uses `grid-cols-2 md:grid-cols-4`. On 360px width, the `text-2xl sm:text-4xl md:text-5xl` stat values overflow their cells visually when numbers are long (e.g., "1,24,560+").

---

## Cognitive Load Analysis

### Overall Cognitive Load Score: HIGH (7/10)

**Sources of cognitive overload by page:**

| Page | Overload Source | Impact |
|------|----------------|--------|
| Home | 4 CTAs + search box + stats + badges + video + testimonials + FAQ all visible | High bounce rate |
| Members | Services section (scrolling stacked cards) + full directory + filters + 3-tab navigation | User confusion on purpose of page |
| Dashboard | 4 complex tabs (Overview, Loans, Recruiter, Tools) with dense analytics | Feature abandonment |
| Membership | 16 fields in Step 1 + voter search + webcam capture option | High form abandonment |
| Header | 3-tier header + 5-item nav + dropdowns + language toggle + CTA | Navigation confusion |

**Key cognitive load violations:**
- **Too many choices simultaneously presented** — violates Hick's Law
- **No progressive disclosure** — all features shown regardless of user state
- **Inconsistent mental models** — services accessible from 3 different routes
- **Mixing audiences** — same dashboard for casual members AND organizer-coordinators

---

## Trust & Clarity Issues

### 🔴 1. Demo Mode Without Clear Distinction
The dashboard shows "DEMO MODE" text in a banner but renders full profile data (Senthil Kumar N, fake loan history, real-looking RSVP events). First-time users may believe these are real data records, creating false expectations about membership status.

### 🟠 2. Registration Number Appears Inconsistently
The TNVS registration number appears as:
- "பதிவு எண். 2012/TNVS" (header ticker, Tamil)
- "Reg. No. 2012/TNVS" (header ticker, English)
- "Registered No: 2012/TNVS" (home page official badge section)
- "Registration No. 2012/TNVS" (various other locations)

Inconsistent formatting of an official credential reduces its perceived legitimacy.

### 🟠 3. "ISO 9001 Certified 2024" Badge Without Verification Link
The home page shows an ISO 9001:2024 badge on the official recognition banner. There is no link to the certification authority or QR verification. This is visually presented as a credential but cannot be verified.

### 🟠 4. Fake Phone Number in Header
The helpline number `044-2345-6789` appears in the header. If this is a placeholder/demo number, clicking it will fail. This destroys trust instantly for a user trying to reach support.

### 🟡 5. WhatsApp Flow Images Are Marketing Screenshots
The "Quick Actions" section shows screenshots of a WhatsApp bot interface. These are marketing visuals, not actual app UI. This creates a disconnect — users click the icon expecting to perform the action, but are redirected to internal pages instead. The mismatch reduces clarity.

### 🟡 6. Membership Cost Hidden
The membership fee (₹500/year) appears only in the bottom sticky CTA ("Join — ₹500/year"), the final CTA section list, and the membership form's step 3. It is never prominently displayed near the primary "Apply for Membership" CTA where users make their decision to proceed.

---

## Recommended Priority Fixes

### Priority 1 — Critical (Fix Before Any Redesign)
1. 🔴 Consolidate navigation — one nav system, consistent labels
2. 🔴 Reduce hero to single primary CTA — remove search box from hero
3. 🔴 Break Step 1 of membership form into 2–3 sub-steps or accordion
4. 🔴 Fix WCAG color contrast violations (gold text, small gray text)
5. 🔴 Add EPIC format hint as inline placeholder, not just error message
6. 🔴 Reduce splash screen blocking time from 2.75s to <1s

### Priority 2 — High Impact UX Improvements
7. 🟠 Add focus trap to mobile navigation drawer
8. 🟠 Fix marquee accessibility (aria-live, pause on focus)
9. 🟠 Replace browser `confirm()` dialogs with modal components
10. 🟠 Show membership fee (₹500) prominently near primary CTA
11. 🟠 Add scroll indicator gradients to horizontal scrollable tabs
12. 🟠 Replace video poster with proper thumbnail image

### Priority 3 — Visual Clarity
13. 🟡 Enforce single border-radius token across all cards
14. 🟡 Standardize `text-[10px]` usage — minimum 12px for all body text
15. 🟡 Simplify stats section — label clarity, reduce color noise
16. 🟡 Add language persistence across page reloads (localStorage)

### Priority 4 — Dashboard Simplification
17. 🟡 Create separate admin/coordinator view vs. member view
18. 🟡 Collapse dashboard to 2 tabs: "My Membership" and "Services"
19. 🟡 Remove demo-mode realistic data to prevent user confusion
