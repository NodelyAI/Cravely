import { AIChat } from '../components/features/AIChat';
import { motion } from 'framer-motion';

export default function AIChatPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col min-h-[calc(100vh-5rem)] md:min-h-[calc(100vh-6rem)]"
    >
      <header className="mb-4 md:mb-6">
        <div className="max-w-3xl mx-auto text-center sm:text-left px-2">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">AI Assistant</h1>
          <p className="text-text-muted mt-1">Get menu ideas, recipe suggestions, and culinary advice</p>
        </div>
      </header>
      
      <div className="flex-1 w-full max-w-4xl mx-auto px-0 sm:px-4">
        <AIChat />
      </div>
    </motion.div>
  );
}