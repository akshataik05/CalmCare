import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  translations,
  supportedLanguages as allSupportedLanguages,
  type Language,
  type TranslationKey,
} from '../components/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  supportedLanguages: ReadonlyArray<{ code: Language; name: string }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Detect saved language or browser language (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedLang = window.localStorage.getItem('auraLanguage') as Language | null;
      if (savedLang && translations[savedLang]) {
        setLanguageState(savedLang);
        return;
      }

      const browserLang = window.navigator?.language?.split?.('-')[0] as Language | undefined;
      if (browserLang && translations[browserLang]) {
        setLanguageState(browserLang);
      }
    } catch (error) {
      // Fail gracefully if localStorage is unavailable
      console.error('Error initializing language from storage or browser:', error);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    if (!translations[lang]) return;

    setLanguageState(lang);

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('auraLanguage', lang);
      } catch (error) {
        console.error('Error saving language to localStorage:', error);
      }
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      const table = translations[language] ?? translations.en;
      // Primary: current language, fallback: English, final: key name
      return table[key] ?? translations.en[key] ?? key;
    },
    [language]
  );

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage,
      t,
      supportedLanguages: allSupportedLanguages,
    }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
