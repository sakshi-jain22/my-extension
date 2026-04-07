export interface ActiveTabContext {
  title: string;
  url: string;
  content: string;
}

function readActiveTab(): Promise<chrome.tabs.Tab | null> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        reject(new Error(lastError.message));
        return;
      }

      resolve(tabs[0] ?? null);
    });
  });
}

function extractPageContext(tabId: number): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => {
          const text = document.body?.innerText || '';
          return text.replace(/\s+/g, ' ').trim().slice(0, 4000);
        },
      },
      (results) => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          reject(new Error(lastError.message));
          return;
        }

        resolve((results?.[0]?.result as string | undefined) ?? '');
      },
    );
  });
}

export async function getActiveTabContext(): Promise<ActiveTabContext | null> {
  try {
    const tab = await readActiveTab();
    if (!tab || typeof tab.id !== 'number') {
      return null;
    }

    const title = tab.title?.trim() || 'Untitled tab';
    const url = tab.url?.trim() || 'Unknown URL';
    const content = await extractPageContext(tab.id);

    return {
      title,
      url,
      content: content || 'No readable page text was available.',
    };
  } catch (error) {
    console.warn('Could not read active tab context:', error);
    return null;
  }
}
