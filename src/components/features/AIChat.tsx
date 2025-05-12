import { useState, useRef, useEffect } from 'react';
import { useAI } from '../../hooks/useAI';
import { motion, AnimatePresence } from 'framer-motion';

export function AIChat() {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState<Array<{ prompt: string; response: string }>>([]);
  const { generateResponse, loading, error } = useAI();
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    
    // Add user message immediately for better UX
    setResponses(prev => [...prev, { prompt, response: '' }]);
    const currentPrompt = prompt;
    setPrompt('');
    
    // Generate AI response
    const result = await generateResponse(currentPrompt);
    
    if (result.text) {
      setResponses(prev => 
        prev.map((item, index) => 
          index === prev.length - 1 ? { prompt: currentPrompt, response: result.text } : item
        )
      );
    } else {
      // Handle error case
      setResponses(prev => 
        prev.map((item, index) => 
          index === prev.length - 1 ? { prompt: currentPrompt, response: 'Sorry, I could not generate a response at this time.' } : item
        )
      );
    }
  }

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [responses, loading]);

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
      <header className="px-4 py-3 bg-primary/5 border-b border-primary/10">
        <h2 className="text-lg font-semibold text-primary flex items-center">
          <span className="mr-2">🤖</span> AI Assistant
        </h2>
        <p className="text-sm text-text-muted">Ask questions about menu planning, recipes, or food service</p>
      </header>
      
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-background/50">
        {responses.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-text-muted p-4 text-center">
            <div className="w-16 h-16 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Ready to assist you</h3>
            <p className="max-w-md text-sm">Ask about menu recommendations, ingredient substitutions, cooking techniques, or any restaurant management questions.</p>
          </div>
        ) : (
          responses.map((item, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <div className="bg-primary/5 p-3 rounded-lg text-sm sm:text-base">
                <p className="font-medium text-primary mb-1 flex items-center">
                  <span className="mr-2">👤</span> You
                </p>
                <p className="text-text-primary">{item.prompt}</p>
              </div>
              
              <AnimatePresence mode="wait">
                {index === responses.length - 1 && !item.response && loading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-background p-3 rounded-lg animate-pulse text-sm sm:text-base"
                  >
                    <p className="font-medium text-accent mb-1 flex items-center">
                      <span className="mr-2">🤖</span> AI
                    </p>
                    <div className="flex space-x-2 items-center text-text-muted">
                      <div className="h-3 w-3 bg-accent/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-3 w-3 bg-accent/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <div className="h-3 w-3 bg-accent/30 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                      <span className="ml-2">Thinking...</span>
                    </div>
                  </motion.div>
                ) : item.response && (
                  <motion.div 
                    key="response"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-accent/5 p-3 rounded-lg text-sm sm:text-base"
                  >
                    <p className="font-medium text-accent mb-1 flex items-center">
                      <span className="mr-2">🤖</span> AI
                    </p>
                    <p className="text-text-primary whitespace-pre-wrap">{item.response}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-error/10 text-error p-3 rounded-lg text-sm sm:text-base"
          >
            <p className="font-medium mb-1">Error</p>
            <p>{error}</p>
          </motion.div>
        )}
        
        <div ref={chatEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-gray-100 bg-white sticky bottom-0">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            ref={inputRef}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 p-2 sm:p-3 rounded-lg border border-gray-200 text-text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
            placeholder="Ask about menu suggestions, recipes, ingredients..."
            disabled={loading}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || !prompt.trim()}
            className="bg-primary text-white px-4 py-2 sm:py-3 rounded-lg disabled:bg-primary/50 text-sm sm:text-base font-medium flex items-center justify-center"
          >
            <span className="mr-2">Send</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </motion.button>
        </div>
      </form>
    </div>
  );
}