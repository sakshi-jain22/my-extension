import { useState, useEffect } from 'react';

// A custom hook to manage storage, falling back to localStorage if not in a Chrome Extension environment
export function useStorage(key: string, initialValue: string = '') {
  const [value, setValue] = useState<string>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if chrome.storage is available (we are in extension mode)
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get([key], (result) => {
        if (result[key] !== undefined) {
          setValue(result[key] as string);
        }
        setIsLoaded(true);
      });
    } else {
      // Fallback to localStorage for development
      const stored = localStorage.getItem(key);
      if (stored) {
        setValue(stored);
      }
      setIsLoaded(true);
    }
  }, [key]);

  const saveValue = (newValue: string) => {
    setValue(newValue);
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ [key]: newValue });
    } else {
      localStorage.setItem(key, newValue);
    }
  };

  const clearValue = () => {
    setValue('');
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.remove(key);
    } else {
      localStorage.removeItem(key);
    }
  };

  return { value, saveValue, clearValue, isLoaded };
}
