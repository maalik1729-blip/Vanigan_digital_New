# TNVS UI Redesign — Antigravity Workflow

Frontend-only redesign pipeline. No backend changes.

---

## Setup (One Time)

1. Copy this entire `ui_redesign/` folder into the root of the
   Vanigan-Digital project:

   ```
   Vanigan-Digital/
   ├── ui_redesign/        ← drop here
   ├── src/
   ├── package.json
   └── ...
   ```

2. Open the Vanigan-Digital folder as a Workspace in Antigravity:
   Agent Manager → + Open Workspace → select Vanigan-Digital/

3. Antigravity will auto-load GEMINI.md and .agent/ from ui_redesign/

---

## How to Run

Full pipeline (all 5 stages, no interruptions):
```
/ui-redesign
```

Individual stages (run in order):
```
/ui-audit          ← reads src/ code, writes outputs/01_ui_audit.md
/ux-strategy       ← reads audit, writes outputs/02_ux_strategy.md
/visual-tokens     ← writes outputs/03_visual_tokens.md + updates src/styles.css
/component-fixes   ← modifies actual src/ files, writes outputs/04_change_plan.md
/ux-review         ← verifies all changes, opens browser at 375px
```

---

## What Gets Changed

| Stage | Output docs | Actual src/ changes |
|-------|-------------|---------------------|
| 1 — Audit | outputs/01_ui_audit.md | None |
| 2 — Strategy | outputs/02_ux_strategy.md | None |
| 3 — Tokens | outputs/03_visual_tokens.md | src/styles.css (tokens added) |
| 4 — Fixes | outputs/04_change_plan.md | src/routes/membership.tsx (38 districts) |
| | | src/components/layout/* (shared Nav/Footer) |
| | | src/styles.css (Lenis removed, animations) |
| | | src/routes/dashboard.tsx (demo banner) |
| | | src/routes/assistant.tsx (demo banner) |
| 5 — Review | outputs/05_final_review.md | None (verification only) |

---

## What Does NOT Get Changed

- voter-api-server.js
- package.json
- vite.config.ts
- tsconfig.json
- Any file outside src/

---

## After the Pipeline

Run in terminal to confirm no errors:
```
npm run build
```

If build passes → share outputs/05_final_review.md for sign-off.
If build fails → share the error with the agent:
"Fix TypeScript errors from the build: [paste error]"

---

## Project Structure After Pipeline Runs

```
Vanigan-Digital/
├── ui_redesign/              ← this folder (don't delete)
│   ├── GEMINI.md
│   ├── README.md
│   ├── .agent/
│   │   ├── workflows/
│   │   │   ├── ui-redesign.md
│   │   │   └── stages.md
│   │   └── rules/
│   │       └── project-rules.md
│   └── outputs/              ← agent writes here
│       ├── 01_ui_audit.md
│       ├── 02_ux_strategy.md
│       ├── 03_visual_tokens.md
│       ├── 04_change_plan.md
│       ├── 05_final_review.md
│       └── change_log.md
├── src/                      ← agent modifies these
│   ├── styles.css            ← tokens added
│   ├── routes/
│   │   └── membership.tsx    ← 38 districts fixed
│   └── components/
│       └── layout/           ← shared Nav/Footer extracted here
└── ...
```
