# Accessibility & Performance Audit (FE-10)

## Page audited
`/generate` — the primary AI interaction flow (deployed at https://study-buddy-mr-fareed.vercel.app/generate)

## Baseline scores (Lighthouse, Mobile, incognito)
- Performance: 68
- Accessibility: 95
- Best Practices: 100
- SEO: 60

## Issues found
1. **Contrast issue**: `text-gray-500` on light backgrounds didn't meet the contrast ratio requirement (flagged by Lighthouse's Contrast audit).
2. **Missing AI-specific accessibility**: streamed AI responses weren't announced to screen readers (no `aria-live` region), and there was no keyboard-reachable way to stop an in-progress response.
3. **Performance**: Lighthouse flagged unused JavaScript (~85 KiB), a long main-thread task, and render-blocking requests as the main contributors to a below-target Performance score.

## Fixes applied
1. Changed `text-gray-500` to `text-gray-600` on the subtitle and empty-state text in `app/generate/page.tsx` to meet contrast requirements.
2. Added `aria-live="polite"` and `aria-relevant="additions text"` to the message list container, so new AI responses are announced politely to screen reader users as they stream in.
3. Added a keyboard-reachable "Stop" button that replaces "Send" while a response is streaming, wired to `useChat`'s `stop()` function, so a user can interrupt generation without a mouse.

## After scores (Lighthouse, Mobile, incognito)
- Performance: 72 (+4)
- Accessibility: 95 (already passing; contrast fix maintained the score while removing a flagged issue)
- Best Practices: 100 (unchanged)

## What I'd add with more time
- Performance is still below the 80 target. The main remaining cost is JavaScript execution time from the AI SDK bundle. With more time I'd:
  - Code-split the `/3d-demo` route's Three.js dependencies away from the main app bundle (confirm they aren't leaking into shared chunks)
  - Audit and trim unused Tailwind classes with PurgeCSS analysis
  - Investigate deferring non-critical JavaScript with `next/dynamic` for below-the-fold components (e.g. ScoreCard, ToolStatus)
- Run a full keyboard-only pass through the checkAnswer flow with a screen reader (NVDA/VoiceOver) to manually verify the aria-live announcements read naturally, not just that they're present in the DOM.