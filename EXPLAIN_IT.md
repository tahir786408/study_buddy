# Explain It Like You Built It

The part of my build I found trickiest was how AI tool calls work in my app.

When a student asks me to check their quiz answer, the AI doesn't judge it itself — instead it calls a small function I wrote called checkAnswer, and passes it the question, the correct answer, and the student's answer. My function compares the two answers, calculates a score, and sends that result back. The AI then takes that result and shows it as a colored score card (green if correct, red if wrong) instead of just replying in plain text.

I also learned how streaming works — instead of waiting for the AI's full response, the answer comes back in small pieces one after another, and my frontend adds each piece to the screen as it arrives. That's why the text looks like it's being typed out live.

Understanding this helped me debug real errors — at one point my messages weren't in the format the AI model expected, and knowing exactly how data flows from the browser to the backend to the AI and back is what let me find and fix that.