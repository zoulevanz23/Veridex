// Shared storage utility for the Veridex browser extension
// Stores API key, user preferences, and analysis history

const STORAGE_KEY = 'veridex-storage';

export interface StorageData {
  apiKey?: string;
  backendUrl?: string;
  lastAnalysis?: {
    timestamp: number;
    verdict: string;
    confidence: number;
  };
  preferences: {
    showSafetyIndicator: boolean;
    showSelectionTooltip: boolean;
    autoAnalyzeLinks: boolean;
  };
}

export const storage = {
  get: async (): Promise<StorageData> => {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEY, (result) => {
        resolve(result[STORAGE_KEY] || {
          backendUrl: 'http://localhost:5000',
          preferences: {
            showSafetyIndicator: true,
            showSelectionTooltip: true,
            autoAnalyzeLinks: false,
          },
        });
      });
    });
  },

  set: async (data: Partial<StorageData>): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEY]: data }, resolve);
    });
  },

  update: async (data: Partial<StorageData>): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEY, (current) => {
        const merged = { ...(current[STORAGE_KEY] || {}), ...data };
        chrome.storage.local.set({ [STORAGE_KEY]: merged }, resolve);
      });
    });
  },
};

export default storage;