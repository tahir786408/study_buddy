# I shipped StudyBuddy — here's the real story

Over the past few weeks I built StudyBuddy, an AI-powered quiz and flashcard generator, as my capstone for the FlyRank AI internship.

**One real decision:** I built the answer-checking as a proper AI tool call (not just the model judging text itself) — the model calls a `checkAnswer` function I wrote, with a typed schema, and that function returns a structured score and feedback that renders as a real component. This meant I had to learn the whole tool-calling lifecycle (input streaming → input available → output available → error), but it made the feature actually reliable instead of hoping the model "says the right thing."

**One real limitation:** There's no session history yet. Every time you open the app, it starts fresh — it doesn't remember which topics you got wrong last time. I scoped this feature and then deliberately cut it for this checkpoint because it needed a real persistence layer, and I wanted a fully working core loop first rather than a half-built feature. It's the next thing I'm building.

Live app: https://study-buddy-mr-fareed.vercel.app
Code: https://github.com/tahir786408/study_buddy

#buildinpublic #AIengineering #FlyRankInternship