const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

export type AIResponse = {
  text: string;
  error?: string;
};

export type AIContext = {
  tableId?: string;
  restaurantId?: string;
  lastOrders?: Array<any>;
  userPreferences?: Record<string, any>;
};

export async function generateAIResponse(prompt: string, context?: AIContext): Promise<AIResponse> {
  try {
    // Create a cache key that includes context if available
    const cacheKey = context ? `${prompt}-${JSON.stringify(context)}` : prompt;
    const cachedResponse = checkCache(cacheKey);
    if (cachedResponse) return { text: cachedResponse };

    // Enhance the prompt with context
    let enhancedPrompt = prompt;
    if (context) {
      // Format context information for the AI
      const contextParts = [];
      
      if (context.tableId) {
        contextParts.push(`Table ID: ${context.tableId}`);
      }
      
      if (context.restaurantId) {
        contextParts.push(`Restaurant ID: ${context.restaurantId}`);
      }
      
      if (context.lastOrders && context.lastOrders.length > 0) {
        contextParts.push(`Last Orders: ${JSON.stringify(context.lastOrders)}`);
      }
      
      if (context.userPreferences) {
        contextParts.push(`User Preferences: ${JSON.stringify(context.userPreferences)}`);
      }
      
      if (contextParts.length > 0) {
        enhancedPrompt = `Context:\n${contextParts.join('\n')}\n\nUser Query: ${prompt}`;
      }
    }

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: enhancedPrompt }
            ]
          }
        ]
      }),
    });    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate AI response');
    }
    const generatedText = data.candidates[0].content.parts[0].text;
    updateCache(cacheKey, generatedText);
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

function checkCache(key: string): string | null {
  const entry = cache[key];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > 3600000) {
    delete cache[key];
    return null;
  }
  return entry.text;
}

function updateCache(key: string, text: string): void {
  const keys = Object.keys(cache);
  if (keys.length >= 100) {
    delete cache[keys[0]];
  }
  cache[key] = { text, timestamp: Date.now() };
}