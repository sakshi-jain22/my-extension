import { GoogleGenerativeAI } from '@google/generative-ai';
import { DEFAULT_GEMINI_MODEL } from './geminiModels';
const DEFAULT_GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY?.trim() ?? '';
const FALLBACK_MODELS = [
  DEFAULT_GEMINI_MODEL,
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash-lite-001',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
];

export interface TabContext {
  title: string;
  url: string;
  content: string;
}

function buildPrompt(prompt: string, tabContext?: TabContext | null): string {
  if (!tabContext) {
    return prompt;
  }

  return [
    'You are a browser assistant. Use the current tab context to answer the user when relevant.',
    'If the user is asking about the page, refer to the tab content and be specific.',
    '',
    `Current tab title: ${tabContext.title}`,
    `Current tab URL: ${tabContext.url}`,
    'Current tab content excerpt:',
    tabContext.content,
    '',
    `User prompt: ${prompt}`,
  ].join('\n');
}

function isTransientModelError(error: any): boolean {
  const status = error?.status ?? error?.response?.status;
  const message = String(error?.message || error || '').toLowerCase();

  return (
    status === 503 ||
    status === 429 ||
    message.includes('high demand') ||
    message.includes('temporarily unavailable') ||
    message.includes('service unavailable') ||
    message.includes('resource exhausted')
  );
}

function isQuotaError(error: any): boolean {
  const status = error?.status ?? error?.response?.status;
  const message = String(error?.message || error || '').toLowerCase();

  return (
    status === 429 ||
    message.includes('quota') ||
    message.includes('billing') ||
    message.includes('rate limit')
  );
}

function buildFallbackChain(activeModel: string): string[] {
  const ordered = [activeModel, ...FALLBACK_MODELS];
  const deduped: string[] = [];

  for (const model of ordered) {
    if (model && !deduped.includes(model)) {
      deduped.push(model);
    }
  }

  return deduped;
}

async function generateWithModel(apiKey: string, modelName: string, prompt: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function askGemini(
  prompt: string,
  apiKey: string,
  modelName: string,
  tabContext?: TabContext | null,
): Promise<string> {
  const activeKey = apiKey?.trim() || DEFAULT_GEMINI_API_KEY;
  if (!activeKey) {
    throw new Error('No Gemini API key is configured. Set REACT_APP_GEMINI_API_KEY or save a key in Settings.');
  }

  const activeModel = modelName?.trim() || DEFAULT_GEMINI_MODEL;
  const fullPrompt = buildPrompt(prompt, tabContext);

  try {
    return await generateWithModel(activeKey, activeModel, fullPrompt);
  } catch (error: any) {
    if (isTransientModelError(error)) {
      for (const fallbackModel of buildFallbackChain(activeModel)) {
        if (fallbackModel === activeModel) {
          continue;
        }

        try {
          console.warn(`Model ${activeModel} unavailable, retrying with ${fallbackModel}`);
          return await generateWithModel(activeKey, fallbackModel, fullPrompt);
        } catch (fallbackError: any) {
          if (!isTransientModelError(fallbackError)) {
            console.error(`Gemini fallback ${fallbackModel} failed:`, fallbackError);
            throw new Error(fallbackError.message || 'Failed to generate response');
          }
        }
      }

      if (isQuotaError(error)) {
        throw new Error('Gemini quota is exhausted for this model or project. Try another model or check your billing and usage limits.');
      }

      throw new Error('Gemini is temporarily overloaded. Please try again in a moment.');
    }

    console.error('Error querying Gemini:', error);
    if (isQuotaError(error)) {
      throw new Error('Gemini quota is exhausted for this model or project. Try another model or check your billing and usage limits.');
    }
    throw new Error(error.message || 'Failed to generate response');
  }
}
