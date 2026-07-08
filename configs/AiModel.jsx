const OPENROUTER_BASE = 'https://openrouter.ai/api/v1/chat/completions';

const cleanJson = (text) =>
  text.replace(/^```(?:json)?\s*/m, '').replace(/\s*```$/m, '').trim();

export const generateWithOpenRouter = async (prompt, model) => {
  const response = await fetch(OPENROUTER_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
      'X-Title': 'AI Course Generator',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a course creation assistant. Always respond with valid JSON only — no markdown, no code fences, no extra text.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenRouter error ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response from OpenRouter');
  return cleanJson(text);
};
