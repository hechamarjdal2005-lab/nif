export function InstagramMasonry() {
  const items = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    color: ["bg-dark-100", "bg-dark-200", "bg-dark"][i % 3],
  }));

  return (
    <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-heading text-2xl sm:text-3xl gold-text mb-3">@MaisonNifChrif</h2>
        <p className="text-dark-500">Suivez-nous sur Instagram</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            className={`aspect-square ${item.color} rounded-lg overflow-hidden relative group cursor-pointer`}
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
              <span className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                ✦
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
