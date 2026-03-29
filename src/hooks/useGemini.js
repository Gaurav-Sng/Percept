// src/hooks/useGemini.js
// Calls Gemini 2.0 Flash and returns structured JSON for Percept

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`;

function buildPrompt(newsInput, persona, customCtx) {
  const personaLine = customCtx?.trim()
    ? `User Persona: ${persona}. Additional context: ${customCtx}`
    : `User Persona: ${persona}`;

  return `You are Percept — an AI news intelligence assistant built for Economic Times that personalises economic and business news for different types of readers.

${personaLine}

NEWS INPUT:
${newsInput}

Your task: Analyse the above news and generate a personalised intelligence brief for this user.

Respond ONLY with a valid JSON object in this exact shape (no markdown fences, no extra text):

{
  "headline": "A 6-10 word punchy title capturing the essence of the news for this persona",
  "summary": "A clear 3–4 sentence factual summary of what happened. Plain English.",
  "impact": [
    "Direct impact point 1 — highly specific to this persona",
    "Direct impact point 2",
    "Direct impact point 3"
  ],
  "implications": [
    "Broader economic/social/policy implication 1",
    "Broader implication 2",
    "Broader implication 3"
  ],
  "suggestions": [
    "Concrete actionable suggestion 1 tailored to this persona",
    "Actionable suggestion 2",
    "Actionable suggestion 3"
  ],
  "sentiment": "positive"
}

Rules:
- Every impact & suggestion must be ultra-specific to the ${persona} persona.
- Avoid generic advice — make the user feel this was written just for them.
- Keep each bullet to 1–2 tight sentences.
- sentiment must be exactly one of: "positive", "negative", "neutral", "mixed"
- Return ONLY the JSON. Nothing else.`;
}

export async function analyzeNews(newsInput, persona, customCtx) {
  if (!API_KEY) throw new Error('Gemini API key not found. Check your .env file (VITE_GEMINI_API_KEY).');

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
    throw new Error(err?.error?.message || `Gemini API error ${res.status}`);
  }

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Strip any accidental markdown fences
  const cleaned = rawText.replace(/```json|```/gi, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Gemini returned an unexpected format. Please try again.');
  }
}
