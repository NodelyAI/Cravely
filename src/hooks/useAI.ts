import { useState } from 'react';
import { generateAIResponse } from '../services/ai';
import type { AIResponse } from '../services/ai';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (prompt: string): Promise<AIResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await generateAIResponse(prompt);
      if (response.error) {
        setError(response.error);
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return { text: '', error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { generateResponse, loading, error };
} 