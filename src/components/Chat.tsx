import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, Wand2, Settings as SettingsIcon } from 'lucide-react';
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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;

    textarea.style.height = '0px';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [input]);

  const submitPrompt = async () => {
    if (!input.trim() || isLoading || !apiKey.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const tabContext = await getActiveTabContext();
      const response = await askGemini(userMsg, apiKey, tabContext);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error: any) {
      const message = String(error?.message || error);
      const friendlyMessage = /leaked|configured|api key/i.test(message)
        ? 'Gemini is blocked until you add a valid API key in Settings.'
        : `Error: ${message}`;
      setMessages(prev => [...prev, { role: 'model', content: friendlyMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    void submitPrompt();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void submitPrompt();
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
            <p>
              {apiKey.trim()
                ? "Ask anything and I'll use Gemini to assist."
                : 'Add a Gemini API key in Settings to start chatting.'}
            </p>
            {!apiKey.trim() && (
              <button type="button" className="empty-action" onClick={onOpenSettings}>
                Open Settings
              </button>
            )}
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
        <div className="composer-shell">
          <div className="composer-header">
            <div className="composer-label">
              <Wand2 size={14} />
              Ask about the current tab
            </div>
            <div className="composer-hint">Enter to send, Shift+Enter for a new line</div>
          </div>

          <div className="composer-row">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Gemini to summarize, explain, or inspect this page..."
              disabled={isLoading}
              autoFocus
              rows={2}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || !apiKey.trim()}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
