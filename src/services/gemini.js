const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

function buildPrompt(newsInput, persona, customCtx) {
  const personaLine = customCtx?.trim()
    ? `User Persona: ${persona}. Additional context: ${customCtx}`
    : `User Persona: ${persona}`;

  return `You are Percept — an AI news intelligence assistant built for Economic Times that personalises news for different types of readers.

${personaLine}

NEWS INPUT:
${newsInput}

Your task: Analyse the news and generate a personalised intelligence brief. Return ONLY a valid JSON object — no markdown, no backticks, no preamble.

{
  "headline": "A punchy 8–12 word headline summarising what happened (as if you're writing it for this persona)",
  "summary": "A clear 3–4 sentence factual summary of the news. Plain English.",
  "impact": [
    "Impact point 1 — highly specific to the ${persona} persona",
    "Impact point 2",
    "Impact point 3"
  ],
  "implications": [
    "Broader economic/social/policy implication 1",
    "Broader implication 2",
    "Broader implication 3"
  ],
  "suggestions": [
    "Concrete actionable suggestion 1 for a ${persona}",
    "Concrete suggestion 2",
    "Concrete suggestion 3"
  ],
  "sentiment": "positive | negative | neutral | mixed"
}

Rules:
- Every impact and suggestion MUST be specific to the ${persona} persona — not generic advice.
- Suggestions must be immediately actionable, not vague platitudes.
- Sentiment must be exactly one of: positive, negative, neutral, mixed.
- Return ONLY valid JSON.`;
}

export async function analyzeNews({ newsInput, persona, customCtx }) {
  if (!API_KEY) throw new Error('Gemini API key not configured in .env');

  const prompt = buildPrompt(newsInput, persona, customCtx);

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1200,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini API error (${res.status})`);
  }

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  // Strip any accidental markdown fences
  const cleaned = rawText.replace(/```json|```/gi, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Could not parse Gemini response. Please try again.');
  }
}
