import { GoogleGenerativeAI } from '@google/generative-ai';

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

export async function askGemini(
  prompt: string,
  apiKey: string,
  tabContext?: TabContext | null,
): Promise<string> {
  const activeKey = apiKey || 'AIzaSyBSOcYVJqVn1S76VoCoRTMLqQ4LQG0TGCA';
  
  const genAI = new GoogleGenerativeAI(activeKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  try {
    const result = await model.generateContent(buildPrompt(prompt, tabContext));
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Error querying Gemini:', error);
    throw new Error(error.message || 'Failed to generate response');
  }
}
