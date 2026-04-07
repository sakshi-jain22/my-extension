import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, Settings as SettingsIcon } from 'lucide-react';
import { askGemini } from '../lib/gemini';
import { getActiveTabContext } from '../lib/tabContext';
import './Chat.scss';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ChatProps {
  apiKey: string;
  onOpenSettings: () => void;
}

export const Chat: React.FC<ChatProps> = ({ apiKey, onOpenSettings }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const tabContext = await getActiveTabContext();
      const response = await askGemini(userMsg, apiKey, tabContext);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'model', content: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="title">
          <Sparkles className="icon" size={18} />
          Gemini Assistant
        </div>
        <button onClick={onOpenSettings} className="settings-btn" title="Settings">
          <SettingsIcon size={18} />
        </button>
      </header>

      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="empty-state">
            <Sparkles size={48} className="empty-icon" />
            <h3>How can I help you?</h3>
            <p>Ask anything and I'll use Gemini to assist.</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`message-bubble ${msg.role}`}>
              <div className="content">{msg.content}</div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message-bubble model loading">
            <Loader2 className="spinner" size={20} />
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Gemini..."
          disabled={isLoading}
          autoFocus
        />
        <button type="submit" disabled={!input.trim() || isLoading}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
