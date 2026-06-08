# 04 — Change Plan (v2)

This plan records all code modifications made in the Stage 4 Component Fixes phase, mapping changes directly to their files and lines.

---

## Files Modified

| File Path | What Changed | Lines Affected |
|-----------|--------------|----------------|
| [business.index.tsx](file:///d:/ziya/TNVS-feature-ui-redesign-v2/src/routes/business.index.tsx) | Updated `TN_DISTRICTS` to include all 38 TN districts, mapped button displays to `Tamil / English` pattern, and replaced custom `#002B7F` text and `#F3F6FC` backgrounds with token aliases. | L1070-1079, L1418-1426, L1642-1645 |
| [membership.tsx](file:///d:/ziya/TNVS-feature-ui-redesign-v2/src/routes/membership.tsx) | Standardized district option labels mapping to use static `Tamil / English` format `{d.ta} / {d.en}` instead of flipping dynamically. | L2105 |

---

## Refinement Execution Details

### Fix 1: Design Tokens Integration
* **Status:** Verified. `src/styles.css` holds all colors (`--primary`, `--gold`, etc.), radii, spacing grids, and elevation shadows inside `:root`. These are mapped to Tailwind v4 theme utility rules via `@theme inline`.
* **Refinement:** In `business.index.tsx` (L1642), hardcoded hex `#002B7F` was replaced with the semantic token `text-primary`. The arbitrary background `bg-[#F3F6FC]/60` was replaced with `bg-surface-raised`.

### Fix 2: All 38 Districts standardizations
* **Status:** Complete.
* **Refinement:** 
  - The `TN_DISTRICTS` array in `business.index.tsx` previously listed 36 entries with duplicates. It was updated to match the complete 38-district list: Ariyalur, Chengalpattu, Chennai, Coimbatore, Cuddalore, Dharmapuri, Dindigul, Erode, Kallakurichi, Kanchipuram, Kanyakumari, Karur, Krishnagiri, Madurai, Mayiladuthurai, Nagapattinam, Namakkal, Nilgiris, Perambalur, Pudukkottai, Ramanathapuram, Ranipet, Salem, Sivaganga, Tenkasi, Thanjavur, Theni, Thoothukudi, Tiruchirappalli, Tirunelveli, Tirupathur, Tiruppur, Tiruvallur, Tiruvannamalai, Tiruvarur, Vellore, Viluppuram, and Virudhunagar.
  - The buttons rendering the districts now use `{d.ta} / {d.en}` to display bilingual tags.

### Fix 3: Language Toggle Enforcements
* **Status:** Complete.
* **Refinement:** In `membership.tsx` (L2105), the dynamic selector expression `{language === "ta" ? ...}` was replaced with a static bilingual format `{d.ta} / {d.en}` so that Tamil script is always presented first, preserving local cultural trust.

### Fix 4: Shared Layout Integration
* **Status:** Verified. Layout components `SiteHeader.tsx`, `SiteFooter.tsx`, and `BottomNavigation.tsx` are correctly wired inside `__root.tsx`. No duplicated headers/footers exist across routes.

### Fix 5: Demo Mode Banner Check
* **Status:** Verified. `DemoModeBanner.tsx` is built with a blue info style using the Lucide Info icon and token-mapped colors. It is successfully integrated into `dashboard.tsx` and `assistant.tsx`.

### Fix 6: Lenis Smooth Scroll Removal
* **Status:** Verified. No Lenis scroll libraries or imports remain in the source folder. Native browser scrolling is preserved.

### Fix 7: Framer Motion Reduction
* **Status:** Verified. Scroll triggers and entrances are managed in `styles.css` using native CSS animations (fadeIn/slideUp keyframes), minimizing JS animation loop overhead on low-end Androids.

---

## Verification Steps
1. **Directory Search:** Run build compiler checking to ensure all TypeScript interfaces build without faults.
2. **Interactive testing:** Load `/members` and `/membership` in browser viewports to verify bilingual select strings.
