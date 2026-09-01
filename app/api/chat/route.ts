// Model and system prompt config kept in one place, as required by the brief.
const MODEL = "openrouter/free";

const SYSTEM_PROMPT = `You are StudyBuddy, an AI study assistant. When a student gives you notes or a topic, generate a short quiz (3-5 questions) or a set of flashcards (question/answer pairs) that help them study. Keep it concise, accurate, and focused only on the material provided. Format clearly with numbered questions or flashcard pairs.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const openrouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      stream: true,
    }),
  });

  if (!openrouterResponse.ok || !openrouterResponse.body) {
    const errorText = await openrouterResponse.text();
    console.log("OpenRouter error:", openrouterResponse.status, errorText);
    return new Response("Failed to reach the AI provider.", { status: 502 });
}

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = openrouterResponse.body!.getReader();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const data = trimmed.slice(5).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const token = parsed.choices?.[0]?.delta?.content;
            if (token) controller.enqueue(encoder.encode(token));
          } catch {
            // Ignore any partial/malformed JSON chunk boundary.
          }
        }
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}