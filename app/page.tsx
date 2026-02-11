import Link from "next/link";
import { Moon, Star, Sparkles, BookOpen, Brain, Lock, Check, ArrowRight, Crown, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarField } from "@/components/shared/StarField";
import { OracleIcon, CrystalIcon, DreamCatcherIcon } from "@/components/shared/MysticIcons";
import { TIERS, formatPrice } from "@/lib/subscription";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField count={150} />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 md:px-12 lg:px-20">
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
          <Moon className="w-6 h-6 sm:w-8 sm:h-8 text-mystic-400" />
          <span className="font-display text-lg sm:text-xl text-lunar">DreamOracle</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/pricing" className="hidden sm:block">
            <Button variant="ghost" className="text-lunar hover:text-mystic-300 hover:bg-mystic-900/30 text-sm sm:text-base px-2 sm:px-4">
              Tarifs
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="text-lunar hover:text-mystic-300 hover:bg-mystic-900/30 text-sm sm:text-base px-2 sm:px-4">
              Connexion
            </Button>
          </Link>
          <Link href="/register">
            <Button className="btn-mystic text-sm sm:text-base px-3 sm:px-4">
              Commencer
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24 md:pb-32 text-center">
        <div className="animate-float mb-6 sm:mb-8">
          <div className="relative">
            <Moon className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gold glow-gold" />
            <Sparkles className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-mystic-400 animate-twinkle" />
            <Star className="absolute -bottom-0.5 -left-2 sm:-bottom-1 sm:-left-3 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gold-light animate-twinkle" style={{ animationDelay: "1s" }} />
          </div>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-lunar mb-4 sm:mb-6 max-w-4xl px-2">
          Explorez les <span className="text-gradient-mystic">Mystères</span> de vos{" "}
          <span className="text-gradient-gold">Rêves</span>
        </h1>

        <p className="font-mystical text-sm sm:text-base md:text-lg lg:text-xl text-mystic-300 mb-6 sm:mb-8 md:mb-10 max-w-2xl px-2">
          Laissez l&apos;Oracle décoder les messages cachés de votre subconscient.
          Enregistrez, analysez et comprenez vos rêves comme jamais auparavant.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
          <Link href="/register" className="w-full sm:w-auto">
            <Button className="btn-mystic btn-gold text-sm sm:text-base md:text-lg px-6 sm:px-8 py-4 sm:py-5 md:py-6 w-full">
              Commencer Gratuitement
            </Button>
          </Link>
          <Link href="#features" className="w-full sm:w-auto">
            <Button variant="outline" className="border-mystic-500 text-mystic-300 hover:bg-mystic-900/30 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-4 sm:py-5 md:py-6 w-full">
              Découvrir
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-4 sm:px-6 py-12 sm:py-16 md:py-24 md:px-12 lg:px-20">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-lunar mb-3 sm:mb-4">
            Comment ça fonctionne
          </h2>
          <div className="divider-ornament max-w-xs mx-auto">
            <Star className="w-4 h-4" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
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
      <section className="relative z-10 px-4 sm:px-6 py-12 sm:py-16 md:py-24 md:px-12 lg:px-20 bg-night-light/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-lunar mb-4 sm:mb-6">
                Un voyage intérieur guidé par l&apos;Oracle
              </h2>
              <p className="text-mystic-300 mb-6 sm:mb-8 font-mystical text-sm sm:text-base md:text-lg">
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

            <div className="glass-card p-4 sm:p-6 md:p-8">
              <div className="text-center mb-4 sm:mb-6">
                <Moon className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-mystic-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="font-display text-lg sm:text-xl md:text-2xl text-lunar">Exemple d&apos;interprétation</h3>
              </div>
              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
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

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 px-4 sm:px-6 py-12 sm:py-16 md:py-24 md:px-12 lg:px-20">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-lunar mb-3 sm:mb-4">
            Choisissez votre voyage
          </h2>
          <div className="divider-ornament max-w-xs mx-auto mb-4">
            <Star className="w-4 h-4" />
          </div>
          <p className="text-mystic-300 font-mystical text-sm sm:text-base max-w-2xl mx-auto">
            Commencez gratuitement et évoluez selon vos besoins
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="glass-card p-5 sm:p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-mystic-800/50">
                <Moon className="h-5 w-5 text-mystic-400" />
              </div>
              <div>
                <h3 className="font-display text-lg text-lunar">{TIERS.FREE.displayName}</h3>
                <p className="text-xs text-mystic-400">{TIERS.FREE.description}</p>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-lunar mb-4">Gratuit</div>
            <ul className="space-y-2 mb-6 flex-grow">
              {TIERS.FREE.features.slice(0, 4).map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-mystic-300">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/register" className="w-full">
              <Button variant="outline" className="w-full border-mystic-600 text-mystic-300 hover:bg-mystic-800/50">
                Commencer gratuitement
              </Button>
            </Link>
          </div>

          {/* Essential Tier - Highlighted */}
          <div className="glass-card p-5 sm:p-6 flex flex-col border-mystic-500/50 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-mystic-500 to-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                Populaire
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-mystic-700/50">
                <Star className="h-5 w-5 text-mystic-300" />
              </div>
              <div>
                <h3 className="font-display text-lg text-lunar">{TIERS.ESSENTIAL.displayName}</h3>
                <p className="text-xs text-mystic-400">{TIERS.ESSENTIAL.description}</p>
              </div>
            </div>
            <div className="mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-lunar">{formatPrice(TIERS.ESSENTIAL.monthlyPrice)}</span>
              <span className="text-mystic-400 text-sm">/mois</span>
            </div>
            <ul className="space-y-2 mb-4 flex-grow">
              {TIERS.ESSENTIAL.features.slice(0, 5).map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-mystic-300">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-center gap-1.5 text-xs text-mystic-400 mb-4">
              <Mic className="h-3 w-3" />
              <span>Inclut la transcription vocale</span>
            </div>
            <Link href="/pricing" className="w-full">
              <Button className="w-full btn-mystic">
                Essai gratuit 7 jours
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="glass-card p-5 sm:p-6 flex flex-col sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gold/20">
                <Crown className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h3 className="font-display text-lg text-lunar">{TIERS.PREMIUM.displayName}</h3>
                <p className="text-xs text-mystic-400">{TIERS.PREMIUM.description}</p>
              </div>
            </div>
            <div className="mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-lunar">{formatPrice(TIERS.PREMIUM.monthlyPrice)}</span>
              <span className="text-mystic-400 text-sm">/mois</span>
            </div>
            <ul className="space-y-2 mb-6 flex-grow">
              {TIERS.PREMIUM.features.slice(0, 5).map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-mystic-300">
                  <Check className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/pricing" className="w-full">
              <Button className="w-full btn-mystic btn-gold">
                Débloquer l&apos;Oracle
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/pricing" className="text-mystic-400 hover:text-mystic-300 text-sm inline-flex items-center gap-1">
            Voir tous les détails et comparer les plans
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 sm:px-6 py-12 sm:py-16 md:py-24 md:px-12 lg:px-20 text-center">
        <div className="max-w-3xl mx-auto">
          <Moon className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gold mx-auto mb-4 sm:mb-6 animate-float" />
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-lunar mb-4 sm:mb-6">
            Prêt à explorer vos rêves ?
          </h2>
          <p className="text-mystic-300 mb-6 sm:mb-8 font-mystical text-sm sm:text-base md:text-lg px-2">
            Rejoignez des milliers de rêveurs qui découvrent chaque jour
            les secrets de leur subconscient.
          </p>
          <Link href="/register">
            <Button className="btn-mystic btn-gold text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6">
              Créer mon compte gratuit
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-mystic-800/50 px-4 sm:px-6 py-6 sm:py-8 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto flex flex-col gap-4 sm:gap-6 md:flex-row md:justify-between items-center">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-mystic-400" />
            <span className="font-display text-sm sm:text-base text-lunar">DreamOracle</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-mystic-400">
            <Link href="/privacy" className="hover:text-mystic-300">Confidentialité</Link>
            <Link href="/terms" className="hover:text-mystic-300">Conditions</Link>
            <Link href="/pricing" className="hover:text-mystic-300">Tarifs</Link>
            <Link href="/contact" className="hover:text-mystic-300">Contact</Link>
          </div>
          <p className="text-mystic-500 text-xs sm:text-sm text-center">
            © {new Date().getFullYear()} DreamOracle. Tous droits réservés.
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
    <div className="glass-card p-4 sm:p-6 md:p-8 text-center group hover:border-gold/30 transition-all">
      <div className="text-mystic-400 mb-3 sm:mb-4 flex justify-center group-hover:text-gold transition-colors [&>svg]:w-8 [&>svg]:h-8 sm:[&>svg]:w-10 sm:[&>svg]:h-10">
        {icon}
      </div>
      <h3 className="font-display text-lg sm:text-xl text-lunar mb-2 sm:mb-3">{title}</h3>
      <p className="text-mystic-300 text-sm sm:text-base">{description}</p>
    </div>
  );
}

function BenefitItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-start sm:items-center gap-2 sm:gap-3 text-lunar text-sm sm:text-base">
      <span className="text-gold flex-shrink-0 mt-0.5 sm:mt-0">{icon}</span>
      <span>{text}</span>
    </li>
  );
}
