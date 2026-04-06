import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert, I18nManager } from 'react-native';
import { translations, type Language, type TranslationKey } from '../i18n/translations';

// NOTE: AppContext intentionally does NOT import from src/theme/index.ts.
// useColors() lives in theme/index.ts and consumes this context — not the reverse.

type AppContextValue = {
  isDarkMode: boolean;
  language: Language;
  isRTL: boolean;
  toggleDarkMode: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguageState] = useState<Language>('en');

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((v) => !v);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    const shouldBeRTL = lang === 'ar';
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.forceRTL(shouldBeRTL);
      Alert.alert(
        translations[lang]['alert.rtlTitle'],
        translations[lang]['alert.rtlMessage'],
        [{ text: translations[lang]['alert.ok'] }],
      );
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => translations[language][key],
    [language],
  );

  const value = useMemo<AppContextValue>(
    () => ({ isDarkMode, language, isRTL: language === 'ar', toggleDarkMode, setLanguage, t }),
    [isDarkMode, language, toggleDarkMode, setLanguage, t],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside <AppProvider>');
  return ctx;
}
