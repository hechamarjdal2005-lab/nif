import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-darker border-t border-dark-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-heading text-2xl gold-text mb-4">{SITE_NAME}</h3>
            <p className="text-dark-500 text-sm leading-relaxed">
              Parfumerie artisanale marocaine, alliant traditions ancestrales et modernité.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-gold mb-4">Collection</h4>
            <ul className="space-y-3">
              <li><Link href="/collection/homme" className="text-sm text-dark-500 hover:text-gold transition-colors">Homme</Link></li>
              <li><Link href="/collection/femme" className="text-sm text-dark-500 hover:text-gold transition-colors">Femme</Link></li>
              <li><Link href="/collection/packs" className="text-sm text-dark-500 hover:text-gold transition-colors">Coffrets</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-gold mb-4">Maison</h4>
            <ul className="space-y-3">
              <li><Link href="/#notre-histoire" className="text-sm text-dark-500 hover:text-gold transition-colors">Notre Histoire</Link></li>
              <li><Link href="/#temoignages" className="text-sm text-dark-500 hover:text-gold transition-colors">Témoignages</Link></li>
              <li><Link href="/#contact" className="text-sm text-dark-500 hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-gold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-dark-500">
              <li>Marrakech, Maroc</li>
              <li>+212 6 00 00 00 00</li>
              <li>contact@maisonnifchrif.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-dark-500">
            © {new Date().getFullYear()} {SITE_NAME}. Tous droits réservés.
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-xs text-dark-500 hover:text-gold transition-colors">Politique de confidentialité</Link>
            <Link href="#" className="text-xs text-dark-500 hover:text-gold transition-colors">Conditions générales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
