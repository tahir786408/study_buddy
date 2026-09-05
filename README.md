This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## AI Tool: checkAnswer

The `/api/chat` route defines a server-side tool the model can call when a student submits an answer for grading.

**Location:** `app/api/chat/route.ts`

**Schema (Zod):**
- `question` (string) — the quiz question being answered
- `correctAnswer` (string) — the correct answer
- `userAnswer` (string) — the answer the student submitted

**Returns:**
- `isCorrect` (boolean)
- `score` (number, 0–100)
- `feedback` (string) — short encouraging or corrective message

**How it works:** The model detects when a student is asking to check an answer and calls `checkAnswer` instead of judging the answer itself. Scoring does an exact case-insensitive match for full credit, or partial credit based on word overlap.

**UI states rendered** (in `app/generate/page.tsx`):
- `input-streaming` — pulsing "Reading the answer..." card
- `input-available` — pulsing "Checking your answer..." card
- `output-available` — a `ScoreCard` component (green border if correct, orange if partial, red if wrong)
- `output-error` — a red bordered error card, shown if the tool execution fails


## Button Motion Choices (FE-AA1)

The Send button at `/button-demo` uses:
- **300ms ease-out** for color/width transitions between states — fast enough to feel responsive, not so fast it feels like a snap.
- **Spin animation (1s linear, infinite)** for the loading spinner — a constant speed reads as "still working," unlike an easing that would suggest it's slowing down/speeding up.
- **0.4s shake** on error and **0.3s pop** on success — short enough not to delay the user from reading the text label, skipped entirely under `prefers-reduced-motion` while the red/green color and text label still communicate the result.
- Only `transform` and `opacity`/color are animated — no layout-affecting properties — so there's no layout thrash during transitions.



## 3D Experience (FE-AA2)

**What I built:** A configurable 3D torus-knot shape at `/3d-demo` using React Three Fiber. The user can orbit/rotate it (drag), change its color, and toggle between solid and wireframe materials.

**Perf notes:**
- Used a procedural geometry (`torusKnotGeometry`) instead of an imported 3D model file, so there's no model download/compression concern — the whole scene is generated in code and is tiny in bundle size.
- The `<Canvas>` is wrapped in `Suspense` with a loading fallback, and `dpr={[1, 1.5]}` caps the pixel ratio so it doesn't over-render on high-DPI phone screens.
- Respects `prefers-reduced-motion`: if enabled, the interactive 3D canvas is replaced with a static text fallback instead of an animated scene.
- Touch works out of the box since `OrbitControls` from drei supports touch drag/pinch natively — tested on mobile.

**With more time, I'd add:** a real imported `.glb` model with DRACO compression instead of a procedural shape, and a frame-rate counter to verify performance more rigorously (the FE-10 lens mentioned in the brief).

