import React, { useState } from 'react';
import './App.scss';
import { Settings } from './components/Settings';
import { Chat } from './components/Chat';
import { useStorage } from './hooks/useStorage';

function App() {
  const { value: apiKey, saveValue, isLoaded } = useStorage('gemini_api_key');
  const [showSettings, setShowSettings] = useState(false);

  // Still loading from storage
  if (!isLoaded) {
    return (
      <div className="app-container loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // If we have an API key and user didn't request settings explicitly, show Chat
  if (apiKey && !showSettings) {
    return (
      <div className="app-container">
        <Chat apiKey={apiKey} onOpenSettings={() => setShowSettings(true)} />
      </div>
    );
  }

  // Otherwise, show Settings
  return (
    <div className="app-container">
      <Settings 
        apiKey={apiKey} 
        onSave={(newKey) => {
          saveValue(newKey);
          setShowSettings(false);
        }} 
      />
    </div>
  );
}

export default App;
