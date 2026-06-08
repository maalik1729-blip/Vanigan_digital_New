# Individual Stage Commands

---

# /ui-audit
// turbo
Load GEMINI.md for context.
Run Stage 1 from ui-redesign.md only.
Write outputs/01_ui_audit.md.
Confirm in chat: files read, key findings count by severity.

---

# /ux-strategy
// turbo
Load GEMINI.md. Read outputs/01_ui_audit.md (halt if missing).
Run Stage 2 from ui-redesign.md only.
Write outputs/02_ux_strategy.md.

---

# /visual-tokens
// turbo
Load GEMINI.md.
Read outputs/01_ui_audit.md and outputs/02_ux_strategy.md.
Run Stage 3 from ui-redesign.md only.
Write outputs/03_visual_tokens.md.
Write updated src/styles.css with token block added.

---

# /component-fixes
// turbo
Load GEMINI.md.
Read outputs/03_visual_tokens.md and outputs/02_ux_strategy.md.
Run Stage 4 from ui-redesign.md only.
Write outputs/04_change_plan.md.
Modify actual src/ files as specified.

---

# /ux-review
// turbo
Load GEMINI.md. Read outputs/04_change_plan.md (halt if missing).
Run Stage 5 from ui-redesign.md only.
Write outputs/05_final_review.md.
Use browser subagent to check 375px viewport on all routes.
