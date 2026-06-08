# Agent Rules — TNVS Frontend Redesign

## Scope Enforcement (Highest Priority)
- NEVER modify: voter-api-server.js, package.json, vite.config.ts,
  tsconfig.json, eslint.config.js, or any file outside src/
- NEVER add new npm packages — work with what is installed
- NEVER modify the outputs/ folder contents from a previous stage run
  (append a _v2 suffix if re-running)
- ALL changes are inside src/ only

## Code Rules
- TypeScript only — no .js files inside src/
- Tailwind classes only for styling — no inline style={} objects
  unless Tailwind cannot express the property
- Use CSS custom properties (var(--color-navy)) in src/styles.css
  as the single source of truth for brand colors
- Do not introduce new component libraries — use what is in
  src/components/ui/ (shadcn) already
- Framer Motion: reduce, do not add new usages
- Lenis: remove if found, do not add

## Quality Rules
- Every change must be TypeScript-valid — no @ts-ignore additions
- Every Select/option component must use the full 38-district array
  defined in Stage 4. Never partial.
- All bilingual labels follow pattern: Tamil / English
  Example: "சென்னை / Chennai" not "Chennai (சென்னை)"
- Touch targets: all interactive elements must have min-h-11
  (44px) on mobile — check Tailwind responsive prefix

## Communication Rules
- After each stage: post a 3-line summary in chat
  Line 1: Files read
  Line 2: Files written/modified
  Line 3: Top finding or blocker
- If a required file from a previous stage is missing:
  HALT and tell the user exactly which command to run first
- If a src/ file does not exist where expected:
  List what files DO exist in that directory before proceeding
- Never silently skip a fix from Stage 4

## Output Rules
- outputs/ folder: markdown files only, no code files
- src/ changes: real working TypeScript/TSX code only
- Document every src/ file modified in outputs/change_log.md
  Format: [timestamp] | [file path] | [what changed]
