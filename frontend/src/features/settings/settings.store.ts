import { create } from 'zustand';

interface SettingsState {
  compactCards: boolean;
  blurSensitive: boolean;
  setCompactCards: (value: boolean) => void;
  setBlurSensitive: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  compactCards: false,
  blurSensitive: true,
  setCompactCards: (compactCards) => set({ compactCards }),
  setBlurSensitive: (blurSensitive) => set({ blurSensitive })
}));
