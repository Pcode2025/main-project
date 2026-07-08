const OPENROUTER_BASE = 'https://openrouter.ai/api/v1/chat/completions';

const sanitizeJsonString = (text) => {
  // Strip markdown code fences
  let cleaned = text.replace(/^```(?:json)?\s*/m, '').replace(/\s*```$/m, '').trim();

  // Remove any leading/trailing text before/after the JSON structure
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  let start = -1;
  if (firstBrace === -1 && firstBracket === -1) return cleaned;
  if (firstBrace === -1) start = firstBracket;
  else if (firstBracket === -1) start = firstBrace;
  else start = Math.min(firstBrace, firstBracket);

  const isArray = cleaned[start] === '[';
  let end = isArray ? cleaned.lastIndexOf(']') : cleaned.lastIndexOf('}');
  if (end === -1) end = cleaned.length - 1;

  cleaned = cleaned.slice(start, end + 1);

  // Fix control characters inside JSON string values
  // Replace actual newlines/tabs/carriage returns inside strings with escaped versions
  cleaned = cleaned.replace(/[\x00-\x1F\x7F]/g, (ch) => {
    switch (ch) {
      case '\n': return '\\n';
      case '\r': return '\\r';
      case '\t': return '\\t';
      default: return '';
    }
  });

  return cleaned;
};

const parseJsonSafe = (text) => {
  const sanitized = sanitizeJsonString(text);
  try {
    return JSON.parse(sanitized);
  } catch (e) {
    // Second attempt: try to fix common issues like trailing commas
    const fixed = sanitized
      .replace(/,\s*([}\]])/g, '$1')  // Remove trailing commas
      .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');  // Quote unquoted keys
    return JSON.parse(fixed);
  }
};

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
          content: 'You are a course creation assistant. Always respond with valid JSON only. No markdown, no code fences, no extra text. Ensure all string values are properly escaped JSON strings with no raw newlines or control characters.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenRouter error ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response from OpenRouter');
  return sanitizeJsonString(text);
};

export { parseJsonSafe };
