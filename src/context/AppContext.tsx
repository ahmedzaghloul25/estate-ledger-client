import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, I18nManager } from 'react-native';
import { translations, type Language, type TranslationKey } from '../i18n/translations';
import { loginApi, setToken, setOnUnauthorized, type LoginResponse } from '../services/api';

// NOTE: AppContext intentionally does NOT import from src/theme/index.ts.
// useColors() lives in theme/index.ts and consumes this context — not the reverse.

type AppContextValue = {
  isDarkMode: boolean;
  language: Language;
  isRTL: boolean;
  toggleDarkMode: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  token: string | null;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguageState] = useState<Language>('en');
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);

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

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginApi(email, password);
    setToken(result.accessToken);
    setTokenState(result.accessToken);
    setUser(result.user);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenState(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      setToken(null);
      setTokenState(null);
      setUser(null);
    });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      isDarkMode,
      language,
      isRTL: language === 'ar',
      toggleDarkMode,
      setLanguage,
      t,
      token,
      user,
      login,
      logout,
    }),
    [isDarkMode, language, toggleDarkMode, setLanguage, t, token, user, login, logout],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside <AppProvider>');
  return ctx;
}
