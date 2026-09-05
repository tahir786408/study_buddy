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


## Signature Hero Shader (FE-AA3)

**What I built:** A custom GLSL fragment shader at `/hero-shader` — a purple-to-teal aurora-style gradient with layered sine waves that drift over time and lean toward the cursor, plus a subtle grain pass on top.

**Uniforms used:** `u_time` (drives the wave animation), `u_resolution` (keeps the pattern aspect-correct across screen sizes), `u_mouse` (shifts the flow field toward the cursor position).

**Reduced-motion/perf fallback:** Device pixel ratio is capped at 1.5 to avoid over-rendering on high-DPI screens, the animation loop pauses when the browser tab is hidden (via the Page Visibility API), and users with `prefers-reduced-motion` enabled see a static CSS gradient in the same color palette instead of the animated shader.

**What each shader block does (in my words):**
- UV coordinates are aspect-corrected so the pattern doesn't stretch on wide screens.
- Mouse position is blended into the UVs so the whole pattern subtly shifts toward the cursor.
- Two sine waves at different frequencies/phases are combined to create the organic, drifting "aurora" look rather than a simple repeating pattern.
- The two brand colors are mixed based on that combined wave value.
- A cheap pseudo-random grain value is added on top for texture, so the gradient doesn't look flat/plasticky.


## Production Deployment (FE-11)

**Live URL:** https://study-buddy-mr-fareed.vercel.app

**What it does:** StudyBuddy is an AI-powered study assistant. Paste notes or a topic, and it generates a quiz or flashcards. Submit an answer and it's checked automatically via a server-side AI tool, with a scored result card.

**How to run locally:**
```bash
git clone https://github.com/tahir786408/study_buddy.git
cd study_buddy
npm install --legacy-peer-deps
```
Create a `.env.local` file with:

Then run:
```bash
npm run dev
```

**Environment variables:**
| Variable | Purpose |
|---|---|
| `OPENROUTER_API_KEY` | Auth key for the OpenRouter AI provider used to generate quiz/flashcard content |

**Architecture overview:**
- **Frontend:** Next.js App Router, React, Tailwind CSS
- **AI layer:** Vercel AI SDK (`streamText`, `tools`) talking to OpenRouter's free model
- **Chat route (`app/api/chat/route.ts`):** streams AI responses, defines the `checkAnswer` tool with a Zod schema, rate-limits requests (10/min per IP), caps input length (4000 chars), and sets `maxDuration = 30` to prevent stuck streams
- **UI (`app/generate/page.tsx`):** uses `useChat` to render streamed text, tool call lifecycle states (loading/success/error), a skeleton for pending responses, a designed empty state, and a retry-on-error flow
- **Testing:** Vitest + React Testing Library for component tests (mocked AI route), Playwright for one end-to-end test of the primary flow, both run in GitHub Actions CI
- **Other pages:** `/button-demo` (motion micro-interactions), `/3d-demo` (React Three Fiber configurator), `/hero-shader` (custom GLSL fragment shader)

**Production hardening:**
- Rate limiting: 10 requests per minute per IP (in-memory, resets on server restart)
- Input length capped at 4000 characters to prevent abuse
- `maxDuration = 30` on the streaming route to avoid runaway requests

**How AI tools built this:** I used Claude and Cursor throughout — for scaffolding new routes and components, debugging TypeScript/version-mismatch errors (e.g. `ai` SDK v4 vs v7 API changes), and writing test cases. I reviewed and understood every generated block before committing it, and fixed several AI-introduced bugs myself (e.g. duplicate `messages` destructuring, wrong `tool()` parameter name for the installed SDK version).

**Browsers tested:** Chrome, Firefox (desktop), Chrome mobile.



## Eval Results
Manually tested the primary flow (quiz generation + answer checking) with 10 different topics and answer combinations:
- Quiz/flashcard generation: 10/10 produced relevant, correctly formatted output from the given topic/notes
- checkAnswer tool: 10/10 correctly scored exact matches (100) and no-matches (0); partial credit scoring worked as expected for close answers
- Error handling: verified retry works after a simulated mid-stream failure (see FE-08 testing)
- Rate limiting: verified 11th request within a minute correctly returns a 429

## Limitations
- Uses a free OpenRouter model, which can occasionally be slower or less consistent in formatting than a paid model
- No user accounts or saved history — each session starts fresh, so there's no cross-session tracking of which topics a student struggles with (documented as a cut scope in BUILD_LOG.md)
- Rate limiting is in-memory only and resets on server restart — fine at this scale, but wouldn't hold up under multi-instance production deployment
- Lighthouse Performance score is 72–88 depending on the page, below the ideal 90 target (see AUDIT.md for details and next steps)