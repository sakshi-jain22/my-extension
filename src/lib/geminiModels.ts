export interface GeminiModelOption {
  id: string;
  label: string;
  description?: string;
}

export const GEMINI_MODEL_OPTIONS: GeminiModelOption[] = [
  {
    id: 'gemini-2.5-flash',
    label: 'Gemini 2.5 Flash',
    description: 'Stable version of Gemini 2.5 Flash.',
  },
  {
    id: 'gemini-2.5-pro',
    label: 'Gemini 2.5 Pro',
    description: 'Stable release of Gemini 2.5 Pro.',
  },
  {
    id: 'gemini-2.0-flash',
    label: 'Gemini 2.0 Flash',
    description: 'Fast and versatile multimodal model.',
  },
  {
    id: 'gemini-2.0-flash-001',
    label: 'Gemini 2.0 Flash 001',
    description: 'Stable version of Gemini 2.0 Flash.',
  },
  {
    id: 'gemini-2.0-flash-lite',
    label: 'Gemini 2.0 Flash-Lite',
    description: 'Lightweight flash model for quick responses.',
  },
  {
    id: 'gemini-2.0-flash-lite-001',
    label: 'Gemini 2.0 Flash-Lite 001',
    description: 'Stable version of Gemini 2.0 Flash-Lite.',
  },
  {
    id: 'gemini-flash-latest',
    label: 'Gemini Flash Latest',
    description: 'Latest release of Gemini Flash.',
  },
  {
    id: 'gemini-flash-lite-latest',
    label: 'Gemini Flash-Lite Latest',
    description: 'Latest release of Gemini Flash-Lite.',
  },
  {
    id: 'gemini-pro-latest',
    label: 'Gemini Pro Latest',
    description: 'Latest release of Gemini Pro.',
  },
  {
    id: 'gemini-2.5-flash-lite',
    label: 'Gemini 2.5 Flash-Lite',
    description: 'Stable version of Gemini 2.5 Flash-Lite.',
  },
  {
    id: 'gemini-3-pro-preview',
    label: 'Gemini 3 Pro Preview',
    description: 'Preview release of Gemini 3 Pro.',
  },
  {
    id: 'gemini-3-flash-preview',
    label: 'Gemini 3 Flash Preview',
    description: 'Preview release of Gemini 3 Flash.',
  },
  {
    id: 'gemini-3.1-pro-preview',
    label: 'Gemini 3.1 Pro Preview',
    description: 'Preview release of Gemini 3.1 Pro.',
  },
  {
    id: 'gemini-3.1-pro-preview-customtools',
    label: 'Gemini 3.1 Pro Preview Custom Tools',
    description: 'Optimized for custom tool usage.',
  },
  {
    id: 'gemini-3.1-flash-lite-preview',
    label: 'Gemini 3.1 Flash Lite Preview',
    description: 'Preview release of Gemini 3.1 Flash Lite.',
  },
];

export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

