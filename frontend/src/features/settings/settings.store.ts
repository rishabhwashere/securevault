import { create } from 'zustand';

interface SettingsState {
  autoLockMinutes: number;
  compactCards: boolean;
  blurSensitive: boolean;
  setAutoLockMinutes: (value: number) => void;
  setCompactCards: (value: boolean) => void;
  setBlurSensitive: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  autoLockMinutes: 10,
  compactCards: false,
  blurSensitive: true,
  setAutoLockMinutes: (autoLockMinutes) => set({ autoLockMinutes }),
  setCompactCards: (compactCards) => set({ compactCards }),
  setBlurSensitive: (blurSensitive) => set({ blurSensitive })
}));
