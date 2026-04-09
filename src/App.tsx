import React, { useState } from 'react';
import './App.scss';
import { Chat } from './components/Chat';
import { Settings } from './components/Settings';
import { useStorage } from './hooks/useStorage';

function App() {
  const { value: apiKey, saveValue, isLoaded } = useStorage('gemini_api_key');
  const [showSettings, setShowSettings] = useState(false);

  if (!isLoaded) {
    return (
      <div className="app-container loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (showSettings) {
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

  return (
    <div className="app-container">
      <Chat apiKey={apiKey} onOpenSettings={() => setShowSettings(true)} />
    </div>
  );
}

export default App;
