const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

export type AIResponse = {
  text: string;
  error?: string;
};

export async function generateAIResponse(prompt: string): Promise<AIResponse> {
  try {
    const cachedResponse = checkCache(prompt);
    if (cachedResponse) return { text: cachedResponse };

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate AI response');
    }
    const generatedText = data.candidates[0].content.parts[0].text;
    updateCache(prompt, generatedText);
    return { text: generatedText };
  } catch (error) {
    return {
      text: '',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

// Simple in-memory cache
const cache: Record<string, { text: string, timestamp: number }> = {};

function checkCache(prompt: string): string | null {
  const entry = cache[prompt];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > 3600000) {
    delete cache[prompt];
    return null;
  }
  return entry.text;
}

function updateCache(prompt: string, text: string): void {
  const keys = Object.keys(cache);
  if (keys.length >= 100) {
    delete cache[keys[0]];
  }
  cache[prompt] = { text, timestamp: Date.now() };
} 