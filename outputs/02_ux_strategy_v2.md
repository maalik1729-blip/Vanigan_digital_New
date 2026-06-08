# 02 — UX Strategy (v2)

## Strategy Overview

The user experience strategy for the Tamil Nadu Vanigargalin Sangamam (TNVS) portal prioritizes clarity, speed, and trust for small business merchants and traders who are primarily mobile users. The primary UX goals are:
1. **Reduce Friction:** Eliminate multi-field confusion on forms and make data lookup easy.
2. **Promote Trust:** Standardize bilingual visuals, verify credentials clearly, and present a professional government-adjacent styling system.
3. **Enhance Mobile Performance:** Target responsive interactions, reduce layout clutter (avoiding dual-nav confusion), and ensure solid tap targets (48px mobile height).

---

## Navigation Architecture

To prevent split-brain navigation on mobile, we establish a clean, responsive layout structure:
* **Layout Division:**
  - **Desktop Viewport:** The top horizontal navigation bar (`SiteHeader.tsx`) serves as the primary route selector with drop-downs for detailed services, organizational wings, and contact resources.
  - **Mobile Viewport:** The sticky bottom navigation bar (`BottomNavigation.tsx`) serves as the thumb-friendly primary route selector containing the five core navigation routes: Home (`/`), Services (`/services`), Directory (`/members`), Account (`/dashboard`), and Help (`/assistant`). The top site header collapses to show only the branding logo, helpline button, and mobile menu hamburger to minimize header dead zone (reduced from 99px to 64px height).
* **State Synchronization:** Navigation active states must be synchronized globally using the TanStack Router active route selectors, avoiding mismatched highlights between top and bottom nav bars.

---

## Registration Form Architecture

The membership registration form (`membership.tsx`) consists of a 5-step flow. To make this process seamless on mobile:
* **Micro-Step Form Layout:**
  - **Step 1 (Member Details):** Structured into three progress steps:
    - *Sub-step 1: Identity & Authentication* (EPIC Number, Mobile Number).
    - *Sub-step 2: Personal & Location Details* (Name, DOB, Assembly, District).
    - *Sub-step 3: Business Information* (Shop Name, Business Type, Wing, Address).
  - This progression reduces cognitive load by displaying at most 4 fields at any one time, down from the legacy 16 fields.
* **Upfront Validation Guidance:**
  - Standard Zod validations run in React Hook Form. To prevent submit-time shocks, inline helper text must be added below critical inputs:
    - *EPIC Input:* Explicitly specify format: `e.g. RJE1234567 (3 letters + 7 digits)` instead of showing only on submit error.
    - *Mobile Input:* Specify `10-digit mobile number` format.
* **Persistent Form Drafts:**
  - Save progress in `localStorage` dynamically as the user fills fields. If the browser reloads or the user navigates back, restore form state from drafts. Provide a clear, non-blocking component-level "Clear Draft" button rather than using legacy browser `window.confirm()` alerts.

---

## Dashboard Auth Flow (Demo Mode)

The dashboard (`dashboard.tsx`) is crucial for traders searching for loan eligibility, download tools, or verifying certificates.
* **Authentication States:**
  - Since the portal is frontend-first with database endpoints mocked, the login screen accepts a mobile number + simulated OTP pin code. 
  - If the user enters credentials matching mock data, log in as active member. 
  - If mock auth falls back to "Demo Mode", display a clear, non-intrusive **blue info-style banner** (replacing legacy amber warnings) explaining: *"You are viewing the dashboard in Demo Mode. Real member data requires a logged-in account."*
* **Simplified Tabs:**
  - Standardize dashboard tabs to focus on: **Overview** (membership status, card download, quick links) and **Services** (loans, legal support, tools). Gate coordinator tools (CRM, tables) to coordinators, reducing layout clutter for basic traders.

---

## Card Generator Flow

The voter ID card generator (`voter-id.tsx`) allows returning members to fetch their digital card by searching by EPIC number.
* **Lookup Flow:**
  - **Match Found:** Instantly render the high-fidelity `VoterIdCard` canvas element with download (PDF/Print) and WhatsApp sharing triggers.
  - **Match Not Found:** Instead of a empty page state or error toast, display a user-friendly modal with options:
    - *"Try search with a demo EPIC code (e.g. RJE1234567)"*
    - *"Register as a new member to generate your custom card instantly (Apply for Membership)"*
    - *"Contact Support Helpline for manual lookup"*

---

## Language Toggle Decision

We recommend **Option A: Implement full bilingual support utilizing the dynamic `useLanguage` context hook and local storage persistence.**
* **Bilingual Visual Enforcements:**
  - Do NOT toggle order of languages in label elements based on state (e.g. do not show English/Tamil when English is selected).
  - Enforce the static `Tamil / English` pattern (e.g., `சென்னை / Chennai`) on all main headings, select dropdown items, and navigation menus. Tamil script must always appear first to show local cultural alignment and respect, followed by English for translation support.

---

## Component Hierarchy Recommendations

1. **Root Router Wrapper (`__root.tsx`):** Hosts the `LanguageProvider`, `ThemeProvider`, layout skip links, `SiteHeader`, page `Outlet`, `SiteFooter`, and `BottomNavigation`.
2. **Form Stepper Layout (`HorizontalSteps.tsx`):** Renders progress ticks above the active registration steps.
3. **Card Canvas Wrapper (`VoterIdCard.tsx`):** A high-fidelity CSS and canvas container displaying membership passes with QR codes.

---

## State Management Recommendations

* **Language Context:** Managed via `useLanguage` context hook, syncing selections to `localStorage` key `app_lang` and updating the document HTML lang attribute dynamically.
* **Form Drafts:** Managed via React Hook Form integrated with a custom `useEffect` state syncing form fields to a JSON object in local storage.
* **Auth State:** Managed using a light React Context wrapper or router context, storing mock login state/tokens in browser memory.

---

## Recommended UX Priorities (Top 10)

1. **Bilingual Dropdowns:** Standardize all 38 districts in `business.index.tsx` to match the bilingual `Tamil / English` format.
2. **Synchronize Nav Systems:** Align desktop Top Nav and mobile Bottom Nav active routes.
3. **Form Micro-Steps:** Keep form divisions to maximum 4 fields per sub-step.
4. **Upfront EPIC Form Hints:** Put format guidance text right next to form inputs.
5. **No window.confirm:** Replace browser native alerts with React-based UI toast prompts.
6. **Blue Demo Banner:** Implement the info-style blue banner with a Lucide info icon.
7. **Bilingual Select Pattern:** Enforce static `Tamil / English` (Tamil first) across all district option mappings.
8. **Voter-Id Helper Mode:** Provide clear fallback actions when EPIC lookups fail.
9. **Reduce Mobile Header Dead Zone:** Lock mobile header height to max 64px.
10. **Touch targets:** Enforce `min-h-11` (44px) to `min-h-12` (48px) for mobile buttons and interactive components.
