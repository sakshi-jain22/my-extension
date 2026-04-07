import React, { useState } from 'react';
import { KeyRound, ExternalLink, CheckCircle } from 'lucide-react';
import './Settings.scss';

interface SettingsProps {
  apiKey: string;
  onSave: (key: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ apiKey, onSave }) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(inputKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <KeyRound className="icon-glow" size={32} />
        <h2>Configuration</h2>
        <p>Set up your API Key to start chatting.</p>
      </div>

      <form onSubmit={handleSave} className="settings-form">
        <div className="input-group">
          <label htmlFor="apiKey">Google Gemini API Key</label>
          <input
            type="password"
            id="apiKey"
            placeholder="AIzaSy..."
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="save-button">
          {saved ? (
            <>
              <CheckCircle size={18} /> Saved
            </>
          ) : (
            'Save Key'
          )}
        </button>
      </form>

      <div className="help-box">
        <p>Don't have an API key?</p>
        <a 
          href="https://aistudio.google.com/app/apikey" 
          target="_blank" 
          rel="noopener noreferrer"
          className="get-key-link"
        >
          Get one at Google AI Studio <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};
