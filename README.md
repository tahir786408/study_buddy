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