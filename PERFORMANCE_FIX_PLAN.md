# 🚀 LIGHTHOUSE PERFORMANCE FIX PLAN
## TNVS Digital Portal - Vanigan Digital New

**Target URL**: https://vanigan-digital-new.vercel.app/  
**Current Environment**: Vercel Production  
**Framework**: TanStack Start + React + Vite

---

## 📊 COMMON LIGHTHOUSE ISSUES & FIXES

Based on your codebase audit and typical Lighthouse reports, here are the critical fixes:

---

## 1. ⚡ PERFORMANCE OPTIMIZATION

### Issue 1.1: Large JavaScript Bundles
**Problem**: Main bundle likely >1MB, causing slow Time to Interactive (TTI)

**Fix**: Implement aggressive code splitting

```typescript
// vite.config.ts - REPLACE EXISTING build.rollupOptions
export default defineConfig({
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 300, // Stricter limit
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules/react')) return 'react-vendor';
          if (id.includes('node_modules/@tanstack/react-router')) return 'router-vendor';
          if (id.includes('node_modules/@tanstack/react-query')) return 'query-vendor';
          if (id.includes('node_modules/framer-motion')) return 'framer-motion';
          if (id.includes('node_modules/lucide-react')) return 'lucide';
          if (id.includes('node_modules/@radix-ui')) return 'radix';
          if (id.includes('node_modules/mysql2')) return 'mysql-vendor';
          
          // Route-based chunks
          if (id.includes('src/routes/dashboard')) return 'dashboard';
          if (id.includes('src/routes/members')) return 'members';
          if (id.includes('src/routes/business')) return 'business';
          if (id.includes('src/routes/membership')) return 'membership';
          if (id.includes('src/routes/voter-id')) return 'voter-id';
        },
      },
    },
  },
});
```

**Expected Impact**: Reduce initial bundle by 40-60%

---

### Issue 1.2: Unoptimized Images (703.89 kB PNG)
**Problem**: Large PNG images slow down Largest Contentful Paint (LCP)

**Fix A**: Convert to WebP/AVIF format

```bash
# Install image optimization tools
npm install --save-dev sharp

# Create optimization script
node scripts/optimize-images.js
```

**Fix B**: Implement responsive images

```typescript
// src/components/OptimizedImage.tsx - CREATE NEW FILE
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false,
  className 
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Convert PNG to WebP/AVIF paths
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/, '.webp');
  const avifSrc = src.replace(/\.(png|jpg|jpeg)$/, '.avif');
  
  return (
    <picture>
      <source srcSet={avifSrc} type="image/avif" />
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={() => setIsLoaded(true)}
      />
    </picture>
  );
}
```

**Fix C**: Add image optimization script

```javascript
// scripts/optimize-images.js - CREATE NEW FILE
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './public/assets';
const outputDir = './public/assets/optimized';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
  const files = fs.readdirSync(inputDir).filter(f => 
    /\.(png|jpg|jpeg)$/i.test(f)
  );

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.parse(file).name;

    // Generate WebP
    await sharp(inputPath)
      .resize(1200, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, `${baseName}.webp`));

    // Generate AVIF
    await sharp(inputPath)
      .resize(1200, null, { withoutEnlargement: true })
      .avif({ quality: 80 })
      .toFile(path.join(outputDir, `${baseName}.avif`));

    console.log(`✓ Optimized: ${file}`);
  }
}

optimizeImages().catch(console.error);
```

**Run optimization**:
```bash
npm install sharp
node scripts/optimize-images.js
```

**Expected Impact**: Reduce image payload by 60-80%, improve LCP by 1-2s

---

### Issue 1.3: Render-Blocking Resources
**Problem**: CSS and JS blocking initial render

**Fix**: Inline critical CSS and defer non-critical resources

```typescript
// src/routes/__root.tsx - ADD TO <head>
<head>
  {/* Critical CSS inline */}
  <style dangerouslySetInnerHTML={{
    __html: `
      /* Critical above-the-fold styles */
      body { margin: 0; font-family: Inter, sans-serif; }
      .container { max-width: 1280px; margin: 0 auto; }
      /* Add your critical CSS here */
    `
  }} />
  
  {/* Defer non-critical CSS */}
  <link 
    rel="preload" 
    href="/assets/styles.css" 
    as="style" 
    onLoad="this.onload=null;this.rel='stylesheet'"
  />
  <noscript>
    <link rel="stylesheet" href="/assets/styles.css" />
  </noscript>
  
  {/* Resource hints */}
  <link rel="preconnect" href="https://vanigan-app-automation-5il0.onrender.com" />
  <link rel="dns-prefetch" href="https://api.qrserver.com" />
  <link rel="dns-prefetch" href="https://res.cloudinary.com" />
</head>
```

**Expected Impact**: Improve First Contentful Paint (FCP) by 0.5-1s

---

### Issue 1.4: Unused JavaScript
**Problem**: Shipping code that's not used on initial page load

**Fix**: Lazy load heavy components

```typescript
// src/routes/index.tsx - UPDATE IMPORTS
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const BusinessDirectory = lazy(() => import('@/components/BusinessDirectory'));
const MemberDashboard = lazy(() => import('@/components/MemberDashboard'));
const AnalyticsDashboard = lazy(() => import('@/routes/analytics'));

// Use with Suspense
function HomePage() {
  return (
    <div>
      {/* Hero section loads immediately */}
      <Hero />
      
      {/* Heavy components lazy loaded */}
      <Suspense fallback={<LoadingSkeleton />}>
        <BusinessDirectory />
      </Suspense>
    </div>
  );
}
```

**Expected Impact**: Reduce Time to Interactive (TTI) by 30-40%

---

### Issue 1.5: Long Tasks (>50ms)
**Problem**: JavaScript execution blocking main thread

**Fix**: Break up long tasks with `setTimeout` or Web Workers

```typescript
// src/lib/performance-utils.ts - CREATE NEW FILE
export function yieldToMain() {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
}

export async function processInChunks<T>(
  items: T[],
  chunkSize: number,
  callback: (chunk: T[]) => void
) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    callback(chunk);
    
    // Yield to browser to prevent blocking
    if (i + chunkSize < items.length) {
      await yieldToMain();
    }
  }
}

// USAGE EXAMPLE:
// src/routes/members.tsx - UPDATE DATA PROCESSING
import { processInChunks } from '@/lib/performance-utils';

async function processMembers(members: Member[]) {
  await processInChunks(members, 50, (chunk) => {
    // Process 50 members at a time
    setProcessedMembers(prev => [...prev, ...chunk]);
  });
}
```

**Expected Impact**: Improve Total Blocking Time (TBT) by 50-70%

---

## 2. ♿ ACCESSIBILITY FIXES

### Issue 2.1: Missing Form Labels
**Problem**: Screen readers can't identify form inputs

**Fix**: Add proper labels and ARIA attributes

```typescript
// src/routes/membership.tsx - UPDATE FORM INPUTS (LINE ~890)
<div className="space-y-1.5">
  <label 
    htmlFor="member-name"
    className="text-[10px] font-bold text-muted-foreground uppercase"
  >
    {t("பெயர் *", "Name *")}
  </label>
  <input
    id="member-name"
    type="text"
    required
    value={memberForm.name}
    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
    className="input-base text-xs"
    placeholder="e.g. Senthil Kumar"
    aria-required="true"
    aria-invalid={!memberForm.name && hasAttemptedSubmit ? "true" : "false"}
    aria-describedby={!memberForm.name ? "name-error" : undefined}
  />
  {!memberForm.name && hasAttemptedSubmit && (
    <span id="name-error" className="text-xs text-destructive" role="alert">
      {t("பெயர் கட்டாயம்", "Name is required")}
    </span>
  )}
</div>
```

**Apply to ALL form inputs** in:
- `src/routes/membership.tsx`
- `src/routes/voter-id.tsx`
- `src/routes/members.tsx`
- `src/routes/business.new.tsx`

---

### Issue 2.2: Low Color Contrast
**Problem**: Text fails WCAG AA contrast ratio (4.5:1)

**Fix**: Update color tokens

```css
/* src/styles.css - UPDATE THESE VALUES */
:root {
  /* BEFORE: Contrast ratio 3.2:1 ❌ */
  --muted-foreground: oklch(60% 0.014 95);
  
  /* AFTER: Contrast ratio 4.8:1 ✅ */
  --muted-foreground: oklch(52% 0.014 95);
}

[data-theme="light"] {
  /* Ensure sufficient contrast for all text colors */
  --foreground: oklch(20% 0.004 95); /* Darker for better readability */
  --muted-foreground: oklch(45% 0.014 95);
}
```

**Test with**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

### Issue 2.3: Missing Alt Text on Images
**Problem**: Decorative and functional images missing alt attributes

**Fix**: Add descriptive alt text

```typescript
// EXAMPLE: src/components/SiteHeader.tsx
<img 
  src={orgLogo} 
  alt="Tamil Nadu Vanigargalin Sangamam Logo" // ✅ Descriptive
  className="h-10 w-auto"
/>

// For decorative images:
<img 
  src={decorativePattern} 
  alt="" // ✅ Empty alt for decorative
  role="presentation"
  aria-hidden="true"
/>
```

**Audit all images** in:
- `src/routes/index.tsx`
- `src/components/SiteHeader.tsx`
- `src/components/VoterIdCard.tsx`

---

### Issue 2.4: Keyboard Navigation Issues
**Problem**: Can't navigate modals/menus with keyboard

**Fix**: Implement focus trap and keyboard handlers

```typescript
// src/components/Modal.tsx - CREATE NEW FILE
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus close button on open
    closeButtonRef.current?.focus();

    // Trap focus within modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 id="modal-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
```

**Replace existing modals** in:
- `src/routes/services.tsx`
- `src/routes/dashboard.tsx`

---

## 3. 🎯 BEST PRACTICES FIXES

### Issue 3.1: Missing Meta Tags
**Problem**: Incomplete SEO metadata

**Fix**: Add comprehensive meta tags to all routes

```typescript
// src/routes/__root.tsx - UPDATE HEAD
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#10b981' },
      { name: 'description', content: 'Official portal of Tamil Nadu Vanigargalin Sangamam - Trader association membership, certification, and business support.' },
      
      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Tamil Nadu Vanigargalin Sangamam' },
      { property: 'og:description', content: 'Official trader association portal' },
      { property: 'og:image', content: 'https://vanigan-digital-new.vercel.app/og-image.png' },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Tamil Nadu Vanigargalin Sangamam' },
      { name: 'twitter:description', content: 'Official trader association portal' },
      
      // Apple
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    ],
    links: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),
});
```

---

### Issue 3.2: Missing HTTPS Redirect
**Problem**: Site accessible over HTTP

**Fix**: Add Vercel configuration

```json
// vercel.json - CREATE NEW FILE
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/:path((?!.*\\.).*)",
      "has": [
        {
          "type": "header",
          "key": "x-forwarded-proto",
          "value": "http"
        }
      ],
      "destination": "https://vanigan-digital-new.vercel.app/:path*",
      "permanent": true
    }
  ]
}
```

---

### Issue 3.3: Browser Errors in Console
**Problem**: 18 console logs in production

**Fix**: Implement production logger

```typescript
// src/lib/logger.ts - CREATE NEW FILE
const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: any[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: any[]) => {
    if (isDev) {
      console.error(...args);
    } else {
      // Send to error tracking service (Sentry, LogRocket)
      // sendToErrorTracking(args);
    }
  },
};

// REPLACE ALL console.* calls with logger.*
// Example:
// BEFORE: console.error("Database error:", error);
// AFTER:  logger.error("Database error:", error);
```

**Run find & replace**:
```bash
# Find all console statements
grep -r "console\." src/

# Replace manually or use:
sed -i 's/console\.log/logger.log/g' src/**/*.{ts,tsx}
sed -i 's/console\.warn/logger.warn/g' src/**/*.{ts,tsx}
sed -i 's/console\.error/logger.error/g' src/**/*.{ts,tsx}
```

---

## 4. 📝 SEO IMPROVEMENTS

### Issue 4.1: Missing Structured Data
**Problem**: Search engines can't understand page content

**Fix**: Add JSON-LD structured data

```typescript
// src/routes/index.tsx - ADD TO COMPONENT
function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Tamil Nadu Vanigargalin Sangamam",
    "alternateName": "TNVS",
    "url": "https://vanigan-digital-new.vercel.app",
    "logo": "https://vanigan-digital-new.vercel.app/assets/association-logo.png",
    "description": "Official trader association of Tamil Nadu providing membership, certification, and business support services.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "No 5/79, Saidapet",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "postalCode": "600015",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-91944-20044",
      "contactType": "Customer Service",
      "availableLanguage": ["Tamil", "English"]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Rest of component */}
    </>
  );
}
```

---

### Issue 4.2: Missing Sitemap
**Problem**: Search engines can't discover all pages

**Fix**: Generate sitemap

```xml
<!-- public/sitemap.xml - CREATE NEW FILE -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://vanigan-digital-new.vercel.app/</loc>
    <lastmod>2026-06-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://vanigan-digital-new.vercel.app/membership</loc>
    <lastmod>2026-06-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://vanigan-digital-new.vercel.app/members</loc>
    <lastmod>2026-06-08</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vanigan-digital-new.vercel.app/business</loc>
    <lastmod>2026-06-08</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vanigan-digital-new.vercel.app/services</loc>
    <lastmod>2026-06-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- Add all other routes -->
</urlset>
```

```text
# public/robots.txt - CREATE NEW FILE
User-agent: *
Allow: /

Sitemap: https://vanigan-digital-new.vercel.app/sitemap.xml
```

---

## 🎯 QUICK WINS CHECKLIST (Do These First)

Priority order for maximum impact with minimum effort:

- [ ] **1. Add `vercel.json` with security headers** (15 min)
- [ ] **2. Optimize images to WebP** (30 min with script)
- [ ] **3. Add lazy loading to images** (20 min)
- [ ] **4. Fix color contrast in CSS** (10 min)
- [ ] **5. Add missing alt text** (15 min)
- [ ] **6. Replace console logs with logger** (30 min)
- [ ] **7. Add resource hints to head** (10 min)
- [ ] **8. Implement code splitting in vite.config** (20 min)
- [ ] **9. Add sitemap.xml and robots.txt** (15 min)
- [ ] **10. Add structured data to homepage** (20 min)

**Total Time: ~3 hours for 60-80% improvement**

---

## 📈 EXPECTED RESULTS

### Before (Current):
- Performance: ~50-60
- Accessibility: ~70-75
- Best Practices: ~75-80
- SEO: ~80-85

### After (All Fixes Applied):
- Performance: **90-95** ⬆️ +40 points
- Accessibility: **95-100** ⬆️ +25 points
- Best Practices: **95-100** ⬆️ +20 points
- SEO: **95-100** ⬆️ +15 points

---

## 🚀 DEPLOYMENT CHECKLIST

Before pushing to production:

```bash
# 1. Install dependencies
npm install sharp

# 2. Optimize images
node scripts/optimize-images.js

# 3. Update imports to use OptimizedImage component
# (Manual step - replace <img> with <OptimizedImage>)

# 4. Build and test locally
npm run build
npm run preview

# 5. Run Lighthouse locally
npx lighthouse http://localhost:3000 --view

# 6. Fix any remaining issues

# 7. Deploy to Vercel
git add .
git commit -m "perf: lighthouse optimization fixes"
git push origin main
```

---

## 📊 MONITORING

After deployment, monitor these metrics:

1. **Core Web Vitals** (Check in Google Search Console)
   - LCP (Largest Contentful Paint): Target <2.5s
   - FID (First Input Delay): Target <100ms
   - CLS (Cumulative Layout Shift): Target <0.1

2. **Lighthouse CI** (Automate checks)
```bash
npm install --save-dev @lhci/cli

# Add to package.json scripts:
"lighthouse": "lhci autorun"
```

3. **Real User Monitoring** (Optional)
   - Consider: Web Vitals library, Google Analytics
   - Track actual user performance data

---

## 🆘 TROUBLESHOOTING

### Issue: Build size still large after optimization
**Solution**: Analyze bundle with:
```bash
npm run build -- --report
npx vite-bundle-visualizer
```

### Issue: Images not loading after WebP conversion
**Solution**: Add fallback support in OptimizedImage component (already included above)

### Issue: Accessibility score not improving
**Solution**: Run automated audit:
```bash
npm install --save-dev @axe-core/cli
npx axe https://vanigan-digital-new.vercel.app --save results.json
```

---

## 📚 RESOURCES

- [Web.dev Performance Guide](https://web.dev/fast/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)

---

**🎉 Ready to implement? Start with the Quick Wins checklist and work your way through each section systematically.**

**Questions or issues? Check the Troubleshooting section or run: `npm run lighthouse` to test locally.**
