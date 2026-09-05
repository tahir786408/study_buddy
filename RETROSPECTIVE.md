# Retrospective

## What I set out to do
When I started this internship, my goal was simple: learn how to actually build and ship an AI-powered product, not just follow tutorials. I chose to build StudyBuddy, an AI quiz and flashcard generator for students, because it was something I'd genuinely use myself and it gave me a reason to touch every part of a real full-stack AI app — the model integration, the UI, the failure cases, and eventually the polish that separates a demo from something deployable.

## What changed
In Week 1, I could barely explain what a backend was doing when a form submitted. By the end, I was debugging AI SDK version mismatches between `ai@4` and `ai@7`, understanding exactly why `convertToModelMessages` needed an `await`, and writing my own Zod-schema tool for the model to call. The biggest shift wasn't technical vocabulary — it was learning to read error messages as information instead of as a wall. Early on, a TypeScript error like "No overload matches this call" would have stopped me completely. By Week 6, I was tracing it straight to a version-specific parameter name change (`parameters` vs `inputSchema`) and fixing it in one edit.

I also changed how I think about "done." My first version of the answer-checking tool worked the moment it returned a score. But the error-states week (FE-08) taught me that "it works" and "it's shippable" are different bars — a feature isn't finished until it survives an empty input, a killed network connection, and a user who double-clicks the retry button. That instinct — to sabotage my own work before someone else does — is probably the single most valuable habit I picked up.

Testing was the other big shift. I went from having zero tests to a Vitest + React Testing Library suite with 9 component tests and a Playwright end-to-end test, running in CI on every push. I used to think tests were something you add "if you have time." Now I think of them as the thing that lets me change code without holding my breath.

## What I'd build next
The most obvious next step is session history — letting a student's wrong answers persist across sessions so the app can tell them what to review next. I scoped this in my agent design (FL-06) but deliberately cut it from the Checkpoint 1 build because it needed a real persistence layer, and I wanted a fully working core loop first rather than a half-wired feature. That's documented honestly in my build log rather than hidden. If I kept building, this would be the very next thing, backed by a real database instead of the in-memory rate limiter I'm currently using for request throttling.

I'd also want to push the Lighthouse performance score higher — it currently sits between 72 and 88 depending on the page, below my 90 target, mostly due to JavaScript execution time from the AI SDK bundle. I have a specific plan for this already written in my accessibility audit: code-splitting the Three.js dependencies away from the main bundle and auditing unused Tailwind classes.

## The three most transferable things I learned
1. **Read the error, don't panic at it.** Almost every bug I hit — version mismatches, schema validation failures, a missing package — was fully explained in the stack trace once I actually read it end to end instead of just the first line.
2. **Ship the failure states, not just the happy path.** A feature that only works when everything goes right isn't a feature yet. Empty states, error retries, and rate limits are part of the actual product, not an afterthought.
3. **Use AI as a pair, not a replacement.** I used Claude and Cursor throughout this build, but I made a point of understanding every block before committing it, and I fixed several AI-introduced bugs myself (a duplicate destructuring statement, a wrong tool parameter name for my installed SDK version). That habit — reviewing rather than trusting blindly — is what let me actually debug things when the AI-generated code didn't match my exact package versions.