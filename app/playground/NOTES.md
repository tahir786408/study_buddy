# NOTES.md — Custom Components vs shadcn/ui

## What I built from scratch (in `app/playground/`)
- **Modal.tsx** — `role="dialog"` + `aria-modal="true"`, manual focus trap (Tab/Shift+Tab cycling via querying focusable elements), Escape to close, focus returned to the trigger element on close.
- **Tabs.tsx** — `role="tablist"/"tab"/"tabpanel"`, roving tabindex pattern, Arrow Left/Right + Home/End navigation, `aria-selected` and `aria-controls` wired correctly.
- **Disclosure.tsx** — native `<button>` with `aria-expanded`/`aria-controls`, relying on the browser's built-in Enter/Space activation rather than reimplementing it.

All three were keyboard-tested manually (no mouse) and behaved correctly.

## What shadcn/ui handled that I missed

1. **Portal rendering.** shadcn's Dialog renders through `DialogPortal`, mounting the dialog at the end of `document.body`. My modal renders in place in the normal DOM tree — if a parent container had `overflow: hidden` or a lower `z-index`, my modal could get visually clipped. shadcn's approach avoids that entirely.

2. **Structured description support.** shadcn provides a dedicated `DialogDescription` component that's automatically wired to `aria-describedby`. My modal only wires up `aria-labelledby` for the title — there's no structured way to add a linked description, so a screen reader user gets less context on what the dialog is for.

3. **Animation state without breaking accessibility.** shadcn uses `data-open`/`data-closed` attributes to drive fade/zoom transitions via CSS, timed so the transition doesn't interfere with focus management. My modal shows and hides instantly with no transition — simpler, but also means I never had to solve the harder problem of animating a dialog without stealing focus mid-transition.

4. **Built on a tested primitives library, not custom logic.** shadcn's dialog and tabs are thin wrappers around Base UI (`@base-ui/react`), a library whose accessibility behavior has been exercised across many production apps and edge cases (e.g. nested dialogs, RTL layouts, various screen readers). My implementation is hand-rolled — it passed my manual tests, but it hasn't been exposed to the edge cases a maintained library has already found and fixed.

5. **Variant system for scaling design.** shadcn's `TabsList` uses `cva` (class-variance-authority) to support style variants (e.g. `default` vs `line`) through one prop. My Tabs component hardcodes a single visual style directly in the className string — fine for one use case, but it would need to be rewritten, not extended, if a second visual style were needed elsewhere in the app.

## Takeaway
Building these by hand first made the shadcn source actually legible — I recognized every ARIA attribute and knew why it was there, instead of just trusting an import. The gaps above aren't things I did "wrong" so much as problems a library has already paid the cost of solving (portal rendering, animation-safe focus handling, cross-browser edge cases) that aren't worth re-solving for every project.