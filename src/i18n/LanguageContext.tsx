import React, { createContext, useContext, useEffect, useState } from "react";
import { Lang, translations, defaultLang } from "./translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  plural: (key: string, n: number, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "gustohelado.lang";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "en" || saved === "es" ? saved : defaultLang;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.title = translations[lang]["app.title"];
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", translations[lang]["app.description"]);
  }, [lang]);

  const t = (key: string, params?: Record<string, string | number>) => {
    let str = translations[lang][key] ?? translations.es[key] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replaceAll(`{${k}}`, String(v));
      });
    }
    return str;
  };

  const plural = (key: string, n: number, params: Record<string, string | number> = {}) =>
    t(`${key}.${n === 1 ? "one" : "many"}`, { n, ...params });

  const value: LanguageContextValue = {
    lang,
    setLang,
    toggleLang: () => setLang(lang === "es" ? "en" : "es"),
    t,
    plural,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
