import type { CreateAppLocalStorageSlice, AppLocalStorageState } from '@/stores/types';
import type { ThemeOptions, LanguageOptions } from '@/stores/types/app';

export enum Theme {
  dark = 'dark',
  light = 'light',
}

export const themeOptions = {
  dark: Theme.dark,
  light: Theme.light,
};

export enum Language {
  en = 'en-us',
  cn = 'zh-cn',
  tw = 'zh-tw',
  id = 'id',
  vi = 'vi',
  tr = 'tr',
  ua = 'ua',
  hi = 'hi',
  ja = 'ja',
  ko = 'ko',
}

// key: ISO 3166 Country Codes
export const languageOptions = {
  us: Language.en,
  cn: Language.cn,
  tw: Language.tw,
  id: Language.id,
  vn: Language.vi,
  tr: Language.tr,
  ua: Language.ua,
  in: Language.hi,
  jp: Language.ja,
  kr: Language.ko,
};

export const initialAppLocalStorageState = {
  appState: {
    theme: Theme.light,
    language: Language.en,
  } as AppLocalStorageState,
};

export const dappLocalStorageSlice: CreateAppLocalStorageSlice = (setState) => {
  return {
    ...initialAppLocalStorageState,
    appActions: {
      setTheme: (theme: ThemeOptions) => {
        setState((state) => {
          const store = { ...state };
          store.appState.theme = themeOptions[theme];
          return store;
        });
      },
      setLanguage: (language: LanguageOptions) => {
        setState((state) => {
          const store = { ...state };
          store.appState.language = languageOptions[language];
          return store;
        });
      },
    },
  };
};
