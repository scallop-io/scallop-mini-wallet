import type { themeOptions, languageOptions } from '@/stores/slices/app';

export type ThemeOptions = keyof typeof themeOptions;
export type ThemeValues = (typeof themeOptions)[ThemeOptions];
export type LanguageOptions = keyof typeof languageOptions;
export type LanguageValues = (typeof languageOptions)[LanguageOptions];

export interface AppLocalStorageState {
  theme: ThemeValues;
  language: LanguageValues;
}

interface AppLocalStorageActions {
  setTheme: (theme: ThemeOptions) => void;
  setLanguage: (language: LanguageOptions) => void;
}

export interface AppLocalStorageSlice {
  appState: AppLocalStorageState;
  appActions: AppLocalStorageActions;
}
