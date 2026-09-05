# StudyBuddy — Capstone Submission

## Project Brief
StudyBuddy is an AI-powered study assistant that generates quizzes and flashcards from a student's own notes or a topic, then checks their answers using a structured AI tool call and gives scored feedback. It's for students (like me) who want quick, focused practice material without manually writing questions. I chose this idea because it's something I'd genuinely use for my own coursework, and it let me touch every part of a real AI product: generation, tool calls, streaming, error states, and testing.

## Live, deployed application
https://study-buddy-mr-fareed.vercel.app/generate

## Repository with complete README
https://github.com/tahir786408/study_buddy — see [README.md](./README.md) for setup, architecture, AI integration, eval results, and limitations.

## AI integration
Uses the Vercel AI SDK's `streamText` with OpenRouter as the model provider. The `checkAnswer` tool (Zod schema) lets the model call a real function to score answers instead of judging them in free text — this makes grading consistent and gives me a structured result to render as a UI component, rather than parsing free-form model text.

## Testing evidence
- 9 Vitest + React Testing Library component tests: [ScoreCard.test.tsx](./app/generate/ScoreCard.test.tsx), [page.test.tsx](./app/generate/page.test.tsx) (AI route mocked, never calls the real API)
- 1 Playwright end-to-end test covering the primary flow: [generate-flow.spec.ts](./tests/generate-flow.spec.ts)
- Both run automatically in GitHub Actions CI on every push: https://github.com/tahir786408/study_buddy/actions

## Performance & accessibility audit
See [AUDIT.md](./AUDIT.md) for full details. Summary:
- Lighthouse Accessibility: 95 (pass)
- Lighthouse Performance: 68 → 72 after fixes (below the 90 target; documented root cause and next steps in AUDIT.md)
- Concrete improvement made: added `aria-live` region so streamed AI responses are announced to screen readers, added a keyboard-reachable Stop button, and fixed a contrast issue on secondary text

## Deployment checklist
- [x] Environment variables set in Vercel (`OPENROUTER_API_KEY`)
- [x] HTTPS confirmed on production URL
- [x] Rate limiting added (10 requests/min per IP) to prevent API key abuse
- [x] Input length capped (4000 characters) to prevent abuse
- [x] `maxDuration = 30` set on the streaming route to avoid stuck requests
- [x] Cross-browser check: Chrome, Firefox (desktop), Chrome (mobile)
- [x] Error states verified: mid-stream failure shows a designed error with working retry (see FE-08)
- **Rollback plan:** Redeploy from the `main` branch on Vercel (previous deployments remain available in the Vercel dashboard and can be instantly promoted back if a new deploy breaks something).

## Reflection
The hardest part was debugging version mismatches between the AI SDK's v4 and v7 APIs — parameter names like `parameters` vs `inputSchema`, and methods like `toDataStreamResponse` vs `toUIMessageStreamResponse`, silently changed between versions, and the errors didn't always make that obvious at first. It taught me to check installed package versions before trusting any code snippet, including AI-generated ones.

If I did it differently next time, I'd write the error-states and testing work earlier instead of treating them as a later "polish" phase — several bugs I found during FE-08 and FE-09 (like the messages-format mismatch between `useChat` and `streamText`) existed from the very first version of the app and just hadn't been exercised yet.

The thing that surprised me most was how much a single well-scoped tool call (`checkAnswer`) changed the feel of the whole app — going from "the AI just replies" to "the AI does a specific, verifiable thing" made the product feel real in a way that more generation features didn't.

## Known limitations & future improvements
See the Limitations section in [README.md](./README.md) — summary: no session/history persistence yet (scoped in AGENT_DESIGN.md, cut for this checkpoint), in-memory rate limiting only, Performance score below target with a documented fix plan.