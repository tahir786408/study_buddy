import { streamText, tool, convertToModelMessages } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const MODEL = "openrouter/free";

const SYSTEM_PROMPT = `You are StudyBuddy, an AI study assistant. When a student gives you notes or a topic, generate a short quiz (3-5 questions) or a set of flashcards (question/answer pairs) that help them study. Keep it concise, accurate, and focused only on the material provided. Format clearly with numbered questions or flashcard pairs. If the student gives you an answer to check, use the checkAnswer tool instead of judging it yourself.`;

const checkAnswer = tool({
  description:
    "Check a student's answer against the correct answer and return a score with feedback.",
  inputSchema: z.object({
    question: z.string().describe("The quiz question being answered"),
    correctAnswer: z.string().describe("The correct answer"),
    userAnswer: z.string().describe("The answer given by the student"),
  }),
  execute: async ({ correctAnswer, userAnswer }) => {
    const normalize = (s: string) => s.trim().toLowerCase();
    const isCorrect = normalize(correctAnswer) === normalize(userAnswer);

    let score = isCorrect ? 100 : 0;
    if (!isCorrect) {
      const correctWords = normalize(correctAnswer).split(" ");
      const userWords = normalize(userAnswer).split(" ");
      const overlap = correctWords.filter((w) => userWords.includes(w)).length;
      score = Math.round((overlap / correctWords.length) * 60);
    }

    const feedback = isCorrect
      ? "Great job! That's correct."
      : score > 0
      ? "Close, but not quite right. Check the key details."
      : "Not correct — review this topic again.";

    return { isCorrect, score, feedback };
  },
});
export async function POST(req: Request) {
  const { messages } = await req.json();

    const result = streamText({
    model: openrouter(MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: { checkAnswer },
  });

  return result.toUIMessageStreamResponse();
}