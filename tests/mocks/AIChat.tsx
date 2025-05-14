// Mock AIChat component for tests
import type { AIContext } from '../../src/services/ai';

// Props with correct types
interface AIChatProps {
  context?: AIContext;
}

export function AIChat(_props: AIChatProps) {
  return (
    <div data-testid="ai-chat-mock">
      <h2>AI Assistant</h2>
      <div className="chat-container">
        <div className="messages">
          <div className="message">How can I help you with your order?</div>
        </div>
        <form>
          <input
            type="text"
            placeholder="Ask about the menu..."
            data-testid="chat-input"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
