# 01 — TNVS Frontend UI Audit (v2)

## Executive Summary

The Tamil Nadu Vanigargalin Sangamam (TNVS) portal serves a diverse group of traders, many of whom are non-technical, mobile-first users accessing the site on budget Android devices over 4G connections. 

The current codebase is in an improved state compared to the initial layout, featuring a robust CSS custom properties system using OKLCH color tokens, responsive fonts, and unified header/footer components in the root router layout (`__root.tsx`). However, our code audit reveals a few residual brand inconsistencies, duplicate/incomplete district lists, animation overhead, and translation patterns that require remediation.

---

## Design Token Findings

We audited `src/styles.css` and all `.tsx` components for hardcoded hex colors or arbitrary Tailwind values. While the design token system is in place under `:root` in `src/styles.css`, several files bypass these tokens and hardcode colors:

1. **`src/routes/__root.tsx`** (Line 58) [Severity: Low]
   - Hardcoded `theme-color: #1e3a8a` in the router meta configuration.
   
2. **`src/routes/membership.tsx`** (Lines 878, 881, 887, 896, 900, 906, 912, 918, 920, 1569, 1784, 1794, 1800, 1834, 2292, 2302, 2308, 2346, 2382, 2485, 2494, 2500, 2526, 2532, 2734) [Severity: Medium]
   - Uses hardcoded hex colors like `#1e3a8a` in the membership card canvas drawings.
   - Extensively uses the dark blue `#002B7F` (e.g. `focus:ring-[#002B7F]/10`, `text-[#002B7F]`, `bg-[#002B7F]`) for inputs, labels, and buttons instead of mapped color tokens (`var(--color-primary)` or `bg-primary`).
   - Uses hardcoded `#F3F6FC` backgrounds instead of semantic tokens.

3. **`src/routes/voter-id.tsx`** (Lines 129, 132, 138, 147, 151, 157, 163, 169, 171, 768, 855, 904, 915) [Severity: Medium]
   - Uses hardcoded hex colors `#1e3a8a` for card canvas generation (e.g. `ctx.fillStyle = "#1e3a8a"`).
   - Hardcoded `#002B7F` for text and link layouts.
   - Hardcoded `#FAF8F5` card backgrounds.

4. **`src/routes/dashboard.tsx`** (Lines 2557, 2558, 2575, 2580, 2583) [Severity: Medium]
   - Hardcoded `#1e3a8a` in SVG loan activity gradients, paths, hover nodes, and text labels.

5. **`src/routes/analytics.tsx`** (Lines 319, 320, 323, 364, 388, 403) [Severity: Medium]
   - Hardcoded `#1e3a8a` in chart lines, hover circles, SVG filters, and gradients.

6. **`src/components/StackedServices.tsx`** (Line 56) [Severity: Low]
   - Hardcoded `imageBg: "#1e3a8a"`.

7. **`src/routes/organizer.tsx`** (Lines 134, 162, 176, 189, 196, 216, 239, 244) [Severity: Low]
   - Hardcoded green hex codes (`#009245`, `#007a38`) for organizer status labels and badges.

---

## Component Duplication Findings

1. **Navigation (Site Header):**
   - **Shared.** The navigation layout is correctly extracted to `src/components/SiteHeader.tsx` and referenced in `src/routes/__root.tsx`. No duplicate navigations exist in individual route files.

2. **Footer (Site Footer):**
   - **Shared.** The footer layout is extracted to `src/components/SiteFooter.tsx` and used exclusively in `src/routes/__root.tsx`.

3. **Bottom Navigation:**
   - **Shared.** The mobile bottom navigation is implemented as `src/components/BottomNavigation.tsx` and wired in `src/routes/__root.tsx`.

No component duplication was found across page routes.

---

## Critical Functional Bugs

1. **District Dropdown Discrepancies:** [CRITICAL]
   - **`src/routes/membership.tsx`** lists all 38 districts correctly via `DISTRICTS` array.
   - **`src/routes/business.index.tsx`** lists only 36 items via `TN_DISTRICTS` array. It is missing **Theni**, **Tiruvallur**, and **Kanniyakumari**, and has **Chengalpattu** duplicated twice.
   - In `business.index.tsx`, district buttons only display English names (`{d}`), failing the bilingual requirement.

2. **Language Toggle & Translation Patterns:** [CRITICAL]
   - The language toggle is wired to context (`LanguageProvider`) and persists in `localStorage` under `app_lang`.
   - In `membership.tsx` (Line 2105), the district dropdown option labels render:
     `{language === "ta" ? `${d.ta} / ${d.en}` : `${d.en} / ${d.ta}`}`
     This dynamically flips the order, producing `English / Tamil` when the language is English. This violates the project rule: *"All bilingual labels follow pattern: Tamil / English. Example: 'சென்னை / Chennai'."* The Tamil label must always be first.

---

## Animation & Performance Findings

1. **Framer Motion Imports:**
   - Imported in 7 files: `src/routes/wings.tsx`, `src/routes/voter-id.tsx`, `src/routes/membership.tsx`, `src/routes/index.tsx`, `src/routes/dashboard.tsx`, `src/routes/analytics.tsx`, and `src/components/WordSwapper.tsx`.
   - Decorative animations should be reviewed. Page transitions and scrolling reveals have been replaced in `src/styles.css` with CSS transitions, but framer-motion is still imported across major route files.

2. **Lenis Smooth Scroll:**
   - No imports or usages of `Lenis` remain in `src/` files. Smooth scrolling is native-managed.

---

## Dead Dependency Findings

1. **Radix Packages:**
   - `@radix-ui/react-slot` is imported in `src/components/ui/button.tsx` (utilized by shadcn button components).
   - `@radix-ui/react-accordion` is imported in `src/components/ui/accordion.tsx` (utilized for FAQ page sections).
   - No unused Radix UI packages are present in `package.json`.

---

## Mobile Layout Findings

1. **Touch Targets:**
   - Standardized via CSS: `min-height: var(--spacing-touch)` (48px) on mobile and `var(--spacing-touch-sm)` (44px) on desktop for inputs and buttons.

2. **Form Accessibility & Spacing:**
   - The form in `membership.tsx` has been successfully refactored into smaller sub-steps (`subStep 1, 2, 3`), resolving the 16-field scrolling density blocker.

3. **Announcements Ticker:**
   - The ticker scrolling speed is 30s (`animate-marquee`). Hover state pauses it (`animate-marquee:hover`). It lacks appropriate screen reader descriptions (`role="marquee"`, `aria-label`).

---

## Prioritized Fix List

### 1. CRITICAL
* **Files:** [business.index.tsx](file:///d:/ziya/TNVS-feature-ui-redesign-v2/src/routes/business.index.tsx)
  * **Change:** Standardize `TN_DISTRICTS` to include all 38 districts. Remove duplicates (Chengalpattu) and add missing entries (Theni, Tiruvallur, Kanniyakumari).
  * **Reason:** Ensures consistent, accurate listings for directory queries across all districts.
* **Files:** [membership.tsx](file:///d:/ziya/TNVS-feature-ui-redesign-v2/src/routes/membership.tsx)
  * **Change:** Enforce static `Tamil / English` pattern for district dropdown options. Replace dynamic swap `d.en / d.ta` with static `{d.ta} / {d.en}`.
  * **Reason:** Compliance with bilingual style guidelines.

### 2. HIGH
* **Files:** [voter-id.tsx](file:///d:/ziya/TNVS-feature-ui-redesign-v2/src/routes/voter-id.tsx), [membership.tsx](file:///d:/ziya/TNVS-feature-ui-redesign-v2/src/routes/membership.tsx), [dashboard.tsx](file:///d:/ziya/TNVS-feature-ui-redesign-v2/src/routes/dashboard.tsx), [analytics.tsx](file:///d:/ziya/TNVS-feature-ui-redesign-v2/src/routes/analytics.tsx)
  * **Change:** Remove hardcoded navy/blue hex colors (`#1e3a8a`, `#002B7F`) from layout markup, inputs, focus rings, SVGs, and buttons. Map them to standard Tailwind classes (like `bg-primary`, `text-primary`, `border-primary`) or CSS custom property tokens. *(Note: Canvas drawings in `voter-id.tsx` and `membership.tsx` that render the physical ID card can keep hardcoded values if necessary for offline rendering accuracy, but UI elements must be mapped to tokens.)*

### 3. MEDIUM
* **Files:** [business.index.tsx](file:///d:/ziya/TNVS-feature-ui-redesign-v2/src/routes/business.index.tsx)
  * **Change:** Convert district button list to bilingual labels using `Tamil / English` pattern matching `DISTRICTS` from `membership.tsx`.
  * **Reason:** Enhances Tamil-literate user navigation.

### 4. LOW
* **Files:** [__root.tsx](file:///d:/ziya/TNVS-feature-ui-redesign-v2/src/routes/__root.tsx)
  * **Change:** Replace hardcoded `theme-color: #1e3a8a` with a dynamically mapped color value or standard brand navy hex to keep tags synced.
  * **Reason:** Maintain clean visual branding configs.
