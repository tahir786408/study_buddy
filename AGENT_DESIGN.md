# Personal Agent Design: StudyBuddy Coach

## Job to be done
A study coach agent that helps a student prepare for a specific topic by generating quizzes/flashcards from their notes, checking their answers, and tracking which topics they're weak on — grounded only in the notes/topic the student provides (no made-up facts).

## User and usage frequency
Me (a software engineering student), used a few times a week while studying for exams or reviewing course material — roughly 2-4 sessions per week, 10-15 minutes each.

## Tools and data needed (with access plan)
- **Quiz/flashcard generator** (already built) — calls the OpenRouter LLM API with the student's notes/topic as input. Access: existing `OPENROUTER_API_KEY` env variable.
- **checkAnswer tool** (already built) — scores a student's answer against the correct answer. No external access needed, runs locally in the route handler.
- **Session history (new, needed for this agent)** — stores which topics/questions the student got wrong, so the agent can suggest what to review next. Access plan: simple in-memory or local JSON store for now (no user accounts yet); could move to a database (e.g. Supabase) later if the app needs persistence across devices.

## Draft instructions (system prompt additions)
"You are a study coach. Only use facts from the notes or topic the student gives you — never invent information not present in their input. When a student answers a question, always use the checkAnswer tool instead of judging yourself. After each session, summarize which topics the student struggled with and suggest they review those first next time."

## Five eval cases
1. Student pastes real notes and asks for a quiz → agent generates accurate questions strictly from those notes.
2. Student answers a question correctly → checkAnswer tool returns 100/100 and a green ScoreCard.
3. Student answers incorrectly → checkAnswer tool returns a partial/zero score with helpful feedback, not a made-up correction.
4. Student asks a question with no notes provided (empty input) → agent asks for a topic/notes instead of guessing or hallucinating content.
5. Student asks something unrelated to studying (e.g. "write me a poem") → agent politely redirects back to its study-coach role instead of complying off-topic.

## Risks and guardrails
- **Must confirm:** before storing or referencing anything from a previous session across topics (to avoid mixing unrelated subjects together).
- **Must never:** invent facts not present in the student's notes, especially for exam-prep content where wrong info could hurt their grade.
- **Must never:** silently fail on a tool error — always show a designed error state (already implemented in FE-08) rather than pretending to have checked the answer.

## Platform choice: Claude Project (free)
I'm using a **Claude Project** (already set up as "FlyRank Internship" with my proof statement and standing instructions) rather than a paid platform like Cowork or a custom n8n workflow. Justification: my agent's core logic (generation + tool-calling) is already built directly into my Next.js app using the AI SDK, so I don't need a separate agent-hosting platform — the "agent" lives in my own codebase. Compared to the scripted-agent alternative (running a fully custom orchestration script with no framework), a Claude Project-backed approach lets me reuse my existing prompt/tool setup with zero extra hosting cost, which fits the ~10 build-hour budget better.