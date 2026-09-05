import { streamText, tool, convertToModelMessages } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

export const maxDuration = 30; // seconds — prevents a stuck stream from running forever

// Simple in-memory rate limiter — caps each IP to 10 requests per minute.
// Resets on server restart; fine for this scale, no external service needed.
const requestLog = new Map<string, number[]>();
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT;
}

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
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return new Response("Too many requests. Please wait a moment and try again.", {
      status: 429,
    });
  }

  const { messages } = await req.json();

  const lastMessage = messages[messages.length - 1];
  const textLength = JSON.stringify(lastMessage).length;
  if (textLength > 4000) {
    return new Response("Message too long. Please keep it under 4000 characters.", {
      status: 400,
    });
  }

  const result = streamText({
    model: openrouter(MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: { checkAnswer },
  });

  return result.toUIMessageStreamResponse();
}