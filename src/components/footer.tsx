"use client";

import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { useLanguage } from "@/lib/language-context";
import { getTranslation } from "@/lib/i18n";

export function Footer() {
  const { locale } = useLanguage();
  const t = (key: string) => getTranslation(locale, key);
  const ar = locale === "ar";

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className={`font-heading text-xl text-primary mb-3 ${ar ? "font-arabic" : ""}`}>{SITE_NAME}</h3>
            <p className={`text-secondary text-sm leading-relaxed ${ar ? "font-arabic" : ""}`}>
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h4 className={`text-xs uppercase tracking-[0.12em] text-primary font-semibold mb-3 ${ar ? "font-arabic" : ""}`}>{t("footer.collection")}</h4>
            <ul className="space-y-2">
              <li><Link href="/collection/homme" className={`text-sm text-secondary hover:text-primary transition-colors ${ar ? "font-arabic" : ""}`}>{t("footer.homme")}</Link></li>
              <li><Link href="/collection/femme" className={`text-sm text-secondary hover:text-primary transition-colors ${ar ? "font-arabic" : ""}`}>{t("footer.femme")}</Link></li>
              <li><Link href="/collection/packs" className={`text-sm text-secondary hover:text-primary transition-colors ${ar ? "font-arabic" : ""}`}>{t("footer.coffrets")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={`text-xs uppercase tracking-[0.12em] text-primary font-semibold mb-3 ${ar ? "font-arabic" : ""}`}>{t("footer.maison")}</h4>
            <ul className="space-y-2">
              <li><Link href="/#notre-histoire" className={`text-sm text-secondary hover:text-primary transition-colors ${ar ? "font-arabic" : ""}`}>{t("footer.notreHistoire")}</Link></li>
              <li><Link href="/#temoignages" className={`text-sm text-secondary hover:text-primary transition-colors ${ar ? "font-arabic" : ""}`}>{t("footer.temoignages")}</Link></li>
              <li><Link href="/#contact" className={`text-sm text-secondary hover:text-primary transition-colors ${ar ? "font-arabic" : ""}`}>{t("footer.contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={`text-xs uppercase tracking-[0.12em] text-primary font-semibold mb-3 ${ar ? "font-arabic" : ""}`}>{t("footer.contact")}</h4>
            <ul className={`space-y-2 text-sm text-secondary ${ar ? "font-arabic" : ""}`}>
              <li>{t("footer.address")}</li>
              <li>+212 6 00 00 00 00</li>
              <li>contact@maisonnifchrif.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-outline-variant/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className={`text-xs text-secondary ${ar ? "font-arabic" : ""}`}>
            © {new Date().getFullYear()} {SITE_NAME}. {t("footer.rights")}
          </p>
          <div className="flex space-x-6">
            <Link href="#" className={`text-xs text-secondary hover:text-primary transition-colors ${ar ? "font-arabic" : ""}`}>{t("footer.privacy")}</Link>
            <Link href="#" className={`text-xs text-secondary hover:text-primary transition-colors ${ar ? "font-arabic" : ""}`}>{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
