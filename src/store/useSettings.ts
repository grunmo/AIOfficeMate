import { create } from 'zustand';
import { apiGet, apiPut } from '@/utils/api';
import type { Settings } from '@/types/api';

type SettingsKey = keyof Settings;

interface SettingsState extends Settings {
  loaded: boolean;
  setSetting: <K extends SettingsKey>(key: K, value: Settings[K]) => void;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
  workDir: '/Users/me/Documents/work',
  llmProvider: 'mock',
  llmModel: 'default-model',
  llmApiKey: '',
  llmBaseUrl: '',
  namingTemplate: '{日期}_{分类}_{原始文件名}',
  theme: 'light',
};

export const useSettings = create<SettingsState>((set, get) => ({
  ...defaultSettings,
  loaded: false,
  setSetting: (key, value) => {
    set((state) => ({ ...state, [key]: value }));
  },
  loadSettings: async () => {
    try {
      const data = await apiGet<Settings>('/settings');
      set({ ...defaultSettings, ...data, loaded: true });
    } catch {
      set({ ...defaultSettings, loaded: true });
    }
  },
  saveSettings: async () => {
    const { loaded, ...rest } = get();
    try {
      await apiPut<{ success: boolean }>('/settings', rest);
    } catch {
      // ignore
    }
  },
}));
