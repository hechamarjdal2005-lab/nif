export function NotreHistoire() {
  return (
    <section id="notre-histoire" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div>
          <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4 font-medium">Notre Histoire</p>
          <h2 className="font-heading text-3xl sm:text-4xl text-white mb-6 leading-tight">
            Un Héritage de <span className="gold-text">L&apos;Art Parfumeur</span>
          </h2>
          <div className="space-y-4 text-dark-500 leading-relaxed">
            <p>
              Fondée au cœur de Marrakech, Maison Nif Chrif perpétue la tradition millénaire
              de la parfumerie marocaine. Nos créations naissent de la rencontre entre les
              essences les plus précieuses du Royaume et un savoir-faire artisanal transmis
              de génération en génération.
            </p>
            <p>
              Chaque flacon raconte une histoire — celle des souks animés, des jardins secrets,
              et des paysages grandioses du Maroc. Nous sélectionnons méticuleusement chaque
              ingrédient, de l&apos;oud du Souss à la rose de Kelaat M&apos;Gouna, pour créer
              des parfums qui évoquent l&apos;âme du Maroc.
            </p>
            <p>
              Notre engagement : vous offrir des fragrances d&apos;exception, alliant tradition
              et modernité, dans le respect de l&apos;artisanat et de la nature.
            </p>
          </div>
        </div>

        {/* Gallery placeholders */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-dark-50 border border-dark-200 rounded-xl overflow-hidden flex items-center justify-center">
              <span className="text-dark-300 text-5xl">✦</span>
            </div>
            <div className="aspect-square bg-dark-50 border border-dark-200 rounded-xl overflow-hidden flex items-center justify-center">
              <span className="text-dark-300 text-3xl">◆</span>
            </div>
          </div>
          <div className="space-y-4 pt-8">
            <div className="aspect-square bg-dark-50 border border-dark-200 rounded-xl overflow-hidden flex items-center justify-center">
              <span className="text-dark-300 text-3xl">◆</span>
            </div>
            <div className="aspect-[3/4] bg-dark-50 border border-dark-200 rounded-xl overflow-hidden flex items-center justify-center">
              <span className="text-dark-300 text-5xl">✦</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
