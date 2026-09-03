# Build Log: StudyBuddy Agent (FL-07)

## What I built
The core agent job from my FL-06 spec (study coach that generates quizzes/flashcards and checks answers) is implemented directly in my existing StudyBuddy Next.js app at `/generate`.

## Live tool/data connections
1. **OpenRouter API** (external service) — the agent calls a live LLM to generate quiz questions/flashcards from the student's notes or topic.
2. **checkAnswer tool** — a server-side tool with a typed schema that scores the student's answer and returns structured feedback, rendered as a ScoreCard component.

## What broke / what changed from the FL-06 spec
- **Session history / weak-topic tracking**: my original spec included storing which topics a student got wrong across sessions. I cut this for the Checkpoint 1 build — it needs a persistence layer (database or accounts) that wasn't part of my existing app, and would have pushed this past the ~10 hour budget. Deviation reason: prioritized a fully working end-to-end core loop (generate → answer → check → feedback) over an extra feature.
- **Off-topic guardrail**: I added a stronger instruction in the system prompt telling the agent to politely redirect if asked something unrelated to studying, after testing showed the base model would sometimes comply with off-topic requests.
- **Empty-input handling**: discovered during testing (from the FE-08 task) that empty/malformed input needed a designed empty state rather than letting the agent guess — this was already fixed as part of my error-states work and carries over directly into this agent's guardrails.

## Platform
Built directly into my own Next.js codebase (as justified in FL-06) rather than a separate agent platform — the AI SDK's `streamText` + `tools` API serves as the agent runtime.

## Result
Core job (generate quiz/flashcards → student answers → tool checks it → feedback shown) runs end to end with no mid-run manual editing, on the live deployed app.