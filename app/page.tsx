import Link from "next/link";
import { Moon, Star, Sparkles, BookOpen, Brain, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarField } from "@/components/shared/StarField";
import { OracleIcon, CrystalIcon, DreamCatcherIcon } from "@/components/shared/MysticIcons";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField count={150} />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
        <Link href="/" className="flex items-center gap-2">
          <Moon className="w-8 h-8 text-mystic-400" />
          <span className="font-display text-xl text-lunar">DreamOracle</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-lunar hover:text-mystic-300 hover:bg-mystic-900/30">
              Connexion
            </Button>
          </Link>
          <Link href="/register">
            <Button className="btn-mystic">
              Commencer
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-32 text-center">
        <div className="animate-float mb-8">
          <div className="relative">
            <Moon className="w-24 h-24 text-gold glow-gold" />
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-mystic-400 animate-twinkle" />
            <Star className="absolute -bottom-1 -left-3 w-6 h-6 text-gold-light animate-twinkle" style={{ animationDelay: "1s" }} />
          </div>
        </div>

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-lunar mb-6 max-w-4xl">
          Explorez les <span className="text-gradient-mystic">Mystères</span> de vos{" "}
          <span className="text-gradient-gold">Rêves</span>
        </h1>

        <p className="font-mystical text-lg md:text-xl text-mystic-300 mb-10 max-w-2xl">
          Laissez l&apos;Oracle décoder les messages cachés de votre subconscient.
          Enregistrez, analysez et comprenez vos rêves comme jamais auparavant.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register">
            <Button className="btn-mystic btn-gold text-lg px-8 py-6">
              Commencer Gratuitement
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" className="border-mystic-500 text-mystic-300 hover:bg-mystic-900/30 text-lg px-8 py-6">
              Découvrir
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-24 md:px-12 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl text-lunar mb-4">
            Comment ça fonctionne
          </h2>
          <div className="divider-ornament max-w-xs mx-auto">
            <Star className="w-4 h-4" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<BookOpen className="w-10 h-10" />}
            title="Enregistrez"
            description="Notez vos rêves dès le réveil avec notre interface intuitive. Ajoutez émotions, symboles et détails."
          />
          <FeatureCard
            icon={<OracleIcon className="w-10 h-10" />}
            title="Interprétez"
            description="Notre Oracle IA analyse vos rêves selon la symbolique jungienne et ésotérique pour révéler leur signification."
          />
          <FeatureCard
            icon={<Brain className="w-10 h-10" />}
            title="Comprenez"
            description="Découvrez les thèmes récurrents, suivez votre évolution et apprenez à décoder les messages de votre inconscient."
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 px-6 py-24 md:px-12 lg:px-20 bg-night-light/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-lunar mb-6">
                Un voyage intérieur guidé par l&apos;Oracle
              </h2>
              <p className="text-mystic-300 mb-8 font-mystical text-lg">
                Chaque rêve est une porte vers votre monde intérieur.
                DreamOracle vous aide à franchir cette porte en toute sécurité.
              </p>

              <ul className="space-y-4">
                <BenefitItem
                  icon={<CrystalIcon className="w-5 h-5" />}
                  text="Interprétation personnalisée basée sur vos émotions"
                />
                <BenefitItem
                  icon={<DreamCatcherIcon className="w-5 h-5" />}
                  text="Détection des symboles et thèmes récurrents"
                />
                <BenefitItem
                  icon={<Lock className="w-5 h-5" />}
                  text="Vos rêves restent privés et sécurisés"
                />
                <BenefitItem
                  icon={<Sparkles className="w-5 h-5" />}
                  text="Conseils pratiques pour votre développement personnel"
                />
              </ul>
            </div>

            <div className="glass-card p-8">
              <div className="text-center mb-6">
                <Moon className="w-16 h-16 text-mystic-400 mx-auto mb-4" />
                <h3 className="font-display text-2xl text-lunar">Exemple d&apos;interprétation</h3>
              </div>
              <div className="space-y-4 text-sm">
                <div className="bg-mystic-900/30 rounded-lg p-4">
                  <p className="text-mystic-300 italic">
                    &quot;Je volais au-dessus d&apos;un océan infini, puis je suis tombé dans l&apos;eau...&quot;
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Symboles clés
                  </p>
                  <p className="text-mystic-200 text-sm">
                    Vol = liberté, aspirations • Océan = inconscient, émotions profondes •
                    Chute = transformation, lâcher-prise
                  </p>
                </div>
                <div className="border-t border-mystic-700 pt-4">
                  <p className="text-lunar-glow font-mystical">
                    Ce rêve suggère un désir de transcendance face à vos émotions.
                    La chute n&apos;est pas une défaite, mais une invitation à plonger
                    dans votre monde intérieur...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24 md:px-12 lg:px-20 text-center">
        <div className="max-w-3xl mx-auto">
          <Moon className="w-16 h-16 text-gold mx-auto mb-6 animate-float" />
          <h2 className="font-display text-3xl md:text-4xl text-lunar mb-6">
            Prêt à explorer vos rêves ?
          </h2>
          <p className="text-mystic-300 mb-8 font-mystical text-lg">
            Rejoignez des milliers de rêveurs qui découvrent chaque jour
            les secrets de leur subconscient.
          </p>
          <Link href="/register">
            <Button className="btn-mystic btn-gold text-lg px-10 py-6">
              Créer mon compte gratuit
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-mystic-800/50 px-6 py-8 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-mystic-400" />
            <span className="font-display text-lunar">DreamOracle</span>
          </div>
          <div className="flex gap-6 text-sm text-mystic-400">
            <Link href="/privacy" className="hover:text-mystic-300">Confidentialité</Link>
            <Link href="/terms" className="hover:text-mystic-300">Conditions</Link>
            <Link href="/contact" className="hover:text-mystic-300">Contact</Link>
          </div>
          <p className="text-mystic-500 text-sm">
            © 2024 DreamOracle. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-card p-8 text-center group hover:border-gold/30 transition-all">
      <div className="text-mystic-400 mb-4 flex justify-center group-hover:text-gold transition-colors">
        {icon}
      </div>
      <h3 className="font-display text-xl text-lunar mb-3">{title}</h3>
      <p className="text-mystic-300">{description}</p>
    </div>
  );
}

function BenefitItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-3 text-lunar">
      <span className="text-gold">{icon}</span>
      {text}
    </li>
  );
}
