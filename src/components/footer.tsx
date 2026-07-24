import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-heading text-xl text-primary mb-3">{SITE_NAME}</h3>
            <p className="text-secondary text-sm leading-relaxed">
              Parfumerie artisanale marocaine, alliant traditions ancestrales et modernité.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.12em] text-primary font-semibold mb-3">Collection</h4>
            <ul className="space-y-2">
              <li><Link href="/collection/homme" className="text-sm text-secondary hover:text-primary transition-colors">Homme</Link></li>
              <li><Link href="/collection/femme" className="text-sm text-secondary hover:text-primary transition-colors">Femme</Link></li>
              <li><Link href="/collection/packs" className="text-sm text-secondary hover:text-primary transition-colors">Coffrets</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.12em] text-primary font-semibold mb-3">Maison</h4>
            <ul className="space-y-2">
              <li><Link href="/#notre-histoire" className="text-sm text-secondary hover:text-primary transition-colors">Notre Histoire</Link></li>
              <li><Link href="/#temoignages" className="text-sm text-secondary hover:text-primary transition-colors">Témoignages</Link></li>
              <li><Link href="/#contact" className="text-sm text-secondary hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.12em] text-primary font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-secondary">
              <li>Marrakech, Maroc</li>
              <li>+212 6 00 00 00 00</li>
              <li>contact@maisonnifchrif.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-outline-variant/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-secondary">
            © {new Date().getFullYear()} {SITE_NAME}. Tous droits réservés.
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-xs text-secondary hover:text-primary transition-colors">Politique de confidentialité</Link>
            <Link href="#" className="text-xs text-secondary hover:text-primary transition-colors">Conditions générales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
