# 03 — Design Tokens + Visual Direction (v2)

## Token System

The Design Token System for the TNVS portal is managed directly in `src/styles.css` using CSS custom properties (variables) defined under the `:root` pseudo-class:

```css
:root {
  /* === BORDER RADIUS === */
  --radius:         0.5rem;      /* Base radius (8px) */
  --radius-input:   0.625rem;    /* Inputs (10px) */
  --radius-btn:     0.5rem;      /* Buttons (8px) */
  --radius-card:    0.75rem;     /* Cards (12px) */
  --radius-modal:   1rem;        /* Modals (16px) */
  --radius-pill:    9999px;      /* Pill badges & status indicators */

  /* === SPACING & TOUCH TARGETS === */
  --spacing-touch:    48px;      /* Primary mobile touch target min-height */
  --spacing-touch-sm: 44px;      /* Secondary desktop touch target min-height */

  /* === TYPE SCALE (Enforcing min 12px) === */
  --text-caption:      0.75rem;   /* 12px — absolute minimum */
  --text-body-sm:      0.875rem;  /* 14px */
  --text-body-md:      1rem;      /* 16px */
  --text-body-lg:      1.125rem;  /* 18px */
  --text-display-sm:   1.5rem;    /* 24px */
  --text-display-md:   1.875rem;  /* 30px */
  --text-display-lg:   2.25rem;   /* 36px */
  --text-display-xl:   3rem;      /* 48px */
  --text-display-2xl:  3.75rem;   /* 60px */

  /* === SHADOWS === */
  --shadow-xs: 0 1px 2px oklch(0.20 0.025 252 / 0.04);
  --shadow-sm: 0 1px 0 oklch(0.88 0.015 90), 0 4px 12px -4px oklch(0.20 0.025 252 / 0.08);
  --shadow-md: 0 1px 0 oklch(0.88 0.015 90), 0 8px 24px -8px oklch(0.20 0.025 252 / 0.12);
  --shadow-lg: 0 1px 0 oklch(0.88 0.015 90), 0 16px 48px -16px oklch(0.20 0.025 252 / 0.16);

  /* === COLOR SYSTEM (OKLCH - high contrast & premium look) === */
  --background:           oklch(0.985 0.003 252);   /* Cool-gray canvas background */
  --surface-page:         oklch(0.985 0.003 252);
  --surface-card:         oklch(1 0 0);             /* Pure white card backgrounds */
  --surface-raised:       oklch(0.970 0.004 252);   /* Raised light gray panel surface */
  
  --foreground:           oklch(0.18 0.020 252);    /* Dark charcoal text for readability */
  --ink:                  oklch(0.14 0.018 252);    /* Headings */
  
  --card:                 oklch(1 0 0);
  --card-foreground:      oklch(0.18 0.020 252);
  --popover:              oklch(1 0 0);
  --popover-foreground:   oklch(0.18 0.020 252);

  --primary:              oklch(0.28 0.14 255);    /* Institutional Navy-700 */
  --primary-foreground:   oklch(1 0 0);
  --secondary:            oklch(0.96 0.02 255);
  --secondary-foreground:  oklch(0.28 0.10 255);
  
  --muted:                oklch(0.960 0.005 252);
  --muted-foreground:     oklch(0.50 0.015 252);   /* WCAG AA compliant */
  
  --accent:               oklch(0.94 0.03 255);
  --accent-foreground:    oklch(0.28 0.10 255);

  --gold:                 oklch(0.76 0.13 85);     /* Celebratory Gold accent */
  --gold-foreground:      oklch(0.14 0.018 252);
  
  --navy:                 oklch(0.28 0.14 255);
  --navy-light:           oklch(0.40 0.14 255);
  --gold-light:           oklch(0.88 0.08 85);

  --border:               oklch(0.900 0.008 252);  /* Cool border gray */
  --input:                oklch(1 0 0);
  --ring:                 oklch(0.28 0.14 255);

  /* Info / Demo Banner */
  --info:                 oklch(0.95 0.03 240);    /* Soft blue surface */
  --info-border:          oklch(0.70 0.08 240);    /* Info border blue */
  --info-foreground:      oklch(0.25 0.12 245);    /* Dark blue text */
  
  /* Status Colors */
  --destructive:          oklch(0.50 0.22 28);     /* WCAG compliant deep red */
  --destructive-foreground: oklch(1 0 0);
}
```

---

## Tailwind v4 @theme Extension

These CSS custom properties are mapped into the Tailwind CSS v4 `@theme` block inside `src/styles.css` to enable semantic visual utilities:

```css
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  
  --color-gold: var(--gold);
  --color-gold-foreground: var(--gold-foreground);
  --color-navy: var(--navy);
  --color-navy-light: var(--navy-light);
  --color-gold-light: var(--gold-light);
  --color-surface-info: var(--info);
  --color-border-info: var(--info-border);
  --color-text-info: var(--info-foreground);
  
  --font-tamil: 'Noto Serif Tamil', 'Noto Sans Tamil', serif;
  --font-display: 'Fraunces', 'Noto Serif Tamil', serif;
  --font-body: 'Inter', 'Noto Sans Tamil', sans-serif;
}
```

---

## Component Class Specifications

### 1. Utility Bar
* **Container:** `w-full h-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 z-50`
* **Text:** `text-[11px] sm:text-xs text-slate-300 font-medium tracking-wide`
* **States:** Hover links: `hover:text-gold transition-colors`
* **Mobile:** Remains a single strip, elements fit or wrap cleanly via flex wrap.

### 2. Navigation Bar
* **Container:** `fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 z-40 transition-all duration-200`
* **Text:** `text-sm font-semibold text-slate-800`
* **States:** Active links: `text-primary border-b-2 border-primary pb-1`; Hover links: `text-primary transition-colors`
* **Mobile:** Desktop links hide (`hidden md:flex`). Brand logo and mobile Hamburger toggle (`md:hidden`) are displayed.

### 3. Hero Section
* **Container:** `relative w-full overflow-hidden bg-white py-12 sm:py-20 border-b border-slate-100`
* **Text:** Headings: `font-display font-bold text-slate-900 leading-tight text-3xl sm:text-5xl`; Paragraphs: `font-tamil text-slate-600 text-sm sm:text-base leading-relaxed`
* **Mobile:** Stacks into a single column, centering copy and placing CTAs below details.

### 4. Stats Row
* **Container:** `w-full stats-grid gap-4 bg-slate-50 border border-slate-100 rounded-2xl stats-card-padding`
* **Text:** Numbers: `text-2xl sm:text-4xl font-extrabold text-primary tracking-tight`; Labels: `text-xs text-slate-500 font-medium font-tamil`
* **Mobile:** Adapts to 1-column block on screen widths <380px via `.stats-grid` helper class.

### 5. Service Card
* **Container:** `card-base card-interactive p-6 flex flex-col gap-4 bg-white rounded-xl border border-slate-100 shadow-sm`
* **Text:** Title: `text-lg font-bold text-slate-800`; Description: `text-sm text-slate-500 font-tamil leading-relaxed`
* **States:** Hover: `border-primary/20 shadow-md`
* **Mobile:** Stacks cleanly as single card. Touch lift translations disabled on mobile.

### 6. Wing Card
* **Container:** `bg-white border border-slate-100 hover:border-primary/15 rounded-xl p-5 hover:shadow-md transition-all flex items-start gap-4`
* **Text:** Title: `text-base font-bold text-slate-800`; Description: `text-xs text-slate-500 leading-relaxed`

### 7. Registration Stepper Indicator
* **Container:** `flex items-center justify-between w-full max-w-md mx-auto mb-8 relative px-4`
* **Connecting Line:** `absolute top-4 left-4 right-4 h-0.5 bg-slate-200 -z-10`
* **Toggles:** Active step indicator: `w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm`; Inactive step: `w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200`

### 8. Form Input Field
* **Container:** `space-y-1.5 w-full`
* **Field:** `input-base w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-3 focus:ring-primary/10 focus:border-primary min-h-[48px] bg-white text-slate-800`
* **States:** Focus: `border-primary ring-2 ring-primary/10`; Error: `border-destructive ring-destructive/10 bg-destructive/5`

### 9. Primary Button
* **Container:** `btn-primary inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-lg text-sm transition shadow-sm min-h-[48px] cursor-pointer`
* **States:** Hover: `bg-primary/95 shadow-md`; Active: `scale-95`; Disabled: `opacity-55 cursor-not-allowed`

### 10. Secondary Button
* **Container:** `btn-secondary inline-flex items-center justify-center gap-2 bg-white text-primary border-2 border-slate-200 font-bold py-3 px-6 rounded-lg text-sm transition min-h-[48px] cursor-pointer`
* **States:** Hover: `bg-slate-50 border-primary/25`; Active: `scale-95`

### 11. Dashboard Member Card
* **Container:** `w-full max-w-sm mx-auto overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 relative text-white`
* **Branding Line:** Top header uses Gold accents (Logo alignment) and clean metadata rows.

### 12. Demo Mode Banner
* **Container:** `w-full bg-surface-info border border-border-info rounded-xl p-4 flex items-start gap-3 text-text-info my-4`
* **Icon:** `Lucide Info (w-5 h-5 text-text-info shrink-0 mt-0.5)`
* **Text:** `text-sm font-medium leading-relaxed font-tamil`

### 13. Footer
* **Container:** `w-full bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 mt-16`
* **Heading Text:** `text-sm font-bold text-white uppercase tracking-wider mb-4`
* **Body Text:** `text-xs sm:text-sm text-slate-400 leading-relaxed font-tamil`

---

## What Replaces Framer Motion

To optimize mobile performance and reduce JavaScript bundle processing overhead, decorative scroll reveals and layout animations are replaced with hardware-accelerated CSS properties:

1. **Scroll Reveals (whileInView replacements):**
   - Implemented via a simple CSS class-based transition (`.section-reveal` and `.section-visible` toggles triggered by a minimal IntersectionObserver in `ScrollReveal.tsx`).
   - Uses `transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)` to slide components smoothly into view.

2. **Fade-In Entrances:**
   - Replacing simple opacity transitions with utility classes:
     ```css
     @keyframes fade-in {
       from { opacity: 0; transform: translateY(6px); }
       to   { opacity: 1; transform: translateY(0); }
     }
     .animate-fade-in {
       animation: fade-in 0.25s ease-out both;
     }
     ```

3. **Slide-Up Blocks:**
   - Mapped directly as hardware-accelerated CSS transformations:
     ```css
     @keyframes slide-up {
       from { opacity: 0; transform: translateY(16px); }
       to   { opacity: 1; transform: translateY(0); }
     }
     .animate-slide-up {
       animation: slide-up 0.3s ease-out both;
     }
     ```

---

## Font Strategy

The typography structure uses Google Fonts loaded asynchronously to ensure LCP scores remain high even on slow 4G merchant connections:

1. **Font Delivery Rules:**
   - Link configurations in `__root.tsx` include preconnect hints to speed up DNS handshakes for Google Fonts:
     `<link rel="preconnect" href="https://fonts.googleapis.com" />`
     `<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />`
   - Head stylesheets use `&display=swap` to avoid blocking render phases:
     `href="https://fonts.googleapis.com/css2?family=Noto+Serif+Tamil:wght@400;500;600&family=Noto+Sans+Tamil:wght@400;500;600&family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap"`

2. **Tamil Text Sizing Calibration:**
   - Tamil headings inherit Noto Serif Tamil rendering. To compensate for the visual weight of complex Tamil glyph structures, they are scaled down using clamp functions relative to English display settings.
   - Line height for Tamil paragraphs is locked to `line-height: 1.7` minimum (via `.font-tamil` base utility) to prevent text clipping of diacritics.
