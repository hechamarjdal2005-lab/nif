"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Locale } from "@/lib/i18n";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "fr",
  setLocale: () => {},
});

function isAdminRoute(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.pathname.startsWith("/admin");
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isAdminRoute()) {
      document.documentElement.lang = "fr";
      document.documentElement.dir = "ltr";
      setMounted(true);
      return;
    }
    const stored = localStorage.getItem("locale") as Locale | null;
    if (stored === "fr" || stored === "ar") {
      setLocaleState(stored);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isAdminRoute()) {
      document.documentElement.lang = "fr";
      document.documentElement.dir = "ltr";
      return;
    }
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale, mounted]);

  const setLocale = useCallback((l: Locale) => {
    if (isAdminRoute()) return;
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
