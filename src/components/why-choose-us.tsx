import { Shield, Leaf, Award, Heart } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Ingrédients Nobles",
    description: "Sélection rigoureuse des meilleures essences naturelles du Maroc et du monde.",
  },
  {
    icon: Award,
    title: "Savoir-Faire Artisanal",
    description: "Chaque parfum est composé à la main par nos maîtres parfumeurs.",
  },
  {
    icon: Shield,
    title: "Qualité Garantie",
    description: "Longue tenue et sillage exceptionnel, certifié par nos experts.",
  },
  {
    icon: Heart,
    title: "Héritage Marocain",
    description: "Une tradition parfumière millénaire revisited avec modernité.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl gold-text mb-4">Pourquoi Nous Choisir</h2>
          <p className="text-dark-500 max-w-xl mx-auto">
            L&apos;excellence à chaque étape de notre création
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-xl border border-dark-200 hover:border-gold/20 transition-all duration-300 hover-lift"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                <feature.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-heading text-lg text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-dark-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
