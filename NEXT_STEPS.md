# The Plan to Keep Building

## How to add the next case study (reusing the Week 2 three-beat shape)
1. **Problem:** Write one line on what real need the next feature solves (e.g. "students want to track which topics they keep getting wrong").
2. **What I did:** Build it in the same Next.js app, in a new route or component, reusing the existing `checkAnswer` tool pattern and `useChat` setup.
3. **What came of it:** Add a short results/outcome note to the README under a new "Case Studies" section, with a live link and one metric or observation.

## Next real piece of work
**Session history / weak-topic tracking** — the feature I scoped in FL-06 but cut from the Checkpoint 1 build (documented in BUILD_LOG.md) because it needed a persistence layer. This is the next concrete thing to add: store which questions a student got wrong (localStorage first, then a real database if I keep building on it), and show a "topics to review" summary.

**Reminder set:** Added a recurring note in my phone's reminders app for next Saturday to revisit this feature — treating it like a standing weekly slot for capstone follow-up work.

## Keeping build context
My Claude Project ("FlyRank Internship") already has my proof statement, tech stack (Next.js, AI SDK, OpenRouter, Tailwind), and identity kit saved as standing context. Future updates to StudyBuddy start from a short conversation in that same project instead of re-explaining the whole stack each time.