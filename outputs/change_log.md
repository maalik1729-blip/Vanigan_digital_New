# Change Log

This file records all modifications made to the `src/` codebase as part of the UI/UX redesign.

* **2026-06-07T14:35:00+05:30** | `src/routes/business.index.tsx` | Updated `TN_DISTRICTS` to include all 38 TN districts, mapped button displays to `Tamil / English` pattern, and replaced custom `#002B7F` text and `#F3F6FC` backgrounds with token aliases.
* **2026-06-07T14:36:00+05:30** | `src/routes/membership.tsx` | Standardized district option labels mapping to use static `Tamil / English` format `{d.ta} / {d.en}` instead of flipping dynamically.
* **2026-06-07T22:15:00+05:30** | `src/routes/membership.tsx`, `src/routes/voter-id.tsx`, `src/routes/dashboard.tsx` | Refactored forms to map to Hallmark design rules: replaced customInputClass with standard input-base, added input-error handling for validation states, refactored hardcoded blue color hex #002B7F/hover hexes to semantic primary tokens, and stamped files with Hallmark page design meta.
* **2026-06-07T23:30:00+05:30** | `src/styles.css`, `src/routes/index.tsx`, `src/routes/membership.tsx`, `src/routes/dashboard.tsx`, `src/routes/voter-id.tsx` | Redesigned the visual shell and routes to use the Impeccable Neo Kinpaku design system. Configured dark lacquer backgrounds (`oklch(7% 0.006 95)`), raised lacquer cards (`oklch(11% 0.006 95)`), Kinpaku gold (`oklch(84% 0.19 80.46)`) accents, Verdigris Patina (`oklch(70% 0.12 188)`) status and RSVP indicators, and integrated Alumni/Albert Sans typography. All layout grids and touch targets successfully migrated to meet the technical system specifications.
* **2026-06-07T23:45:00+05:30** | `src/styles.css`, `src/routes/index.tsx`, `src/routes/membership.tsx`, `src/routes/dashboard.tsx`, `src/routes/voter-id.tsx` | Restored all route files to the original TNVS Trader Portal contents and business logic. Configured the primary design system in styles.css to use the Emerald Green accent color (`#10b981`) instead of Kinpaku Gold, creating a clean dark-lacquer and emerald theme across the entire portal.




