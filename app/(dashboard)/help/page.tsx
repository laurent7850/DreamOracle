import {
  Moon,
  BookOpen,
  Sparkles,
  Edit,
  Trash2,
  Settings,
  Lightbulb,
  HelpCircle,
  ChevronRight,
  Mic,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Aide - DreamOracle",
  description: "Guide d'utilisation de DreamOracle",
};

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-mystic-800/50">
            <HelpCircle className="w-12 h-12 text-gold" />
          </div>
        </div>
        <h1 className="font-display text-3xl text-lunar">
          Guide d&apos;utilisation
        </h1>
        <p className="text-mystic-400 max-w-2xl mx-auto">
          Bienvenue dans DreamOracle, votre oracle personnel pour explorer et
          comprendre vos rêves grâce à l&apos;intelligence artificielle.
        </p>
      </div>

      {/* Quick Start */}
      <Card className="glass-card border-gold/20">
        <CardHeader>
          <CardTitle className="font-display text-xl text-gold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Démarrage rapide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-mystic-900/30 p-4 rounded-lg border border-mystic-700/30 text-center">
              <div className="text-2xl font-display text-gold mb-2">1</div>
              <p className="text-mystic-300 text-sm">
                Enregistrez votre rêve dès le réveil
              </p>
            </div>
            <div className="bg-mystic-900/30 p-4 rounded-lg border border-mystic-700/30 text-center">
              <div className="text-2xl font-display text-gold mb-2">2</div>
              <p className="text-mystic-300 text-sm">
                Choisissez un style d&apos;interprétation
              </p>
            </div>
            <div className="bg-mystic-900/30 p-4 rounded-lg border border-mystic-700/30 text-center">
              <div className="text-2xl font-display text-gold mb-2">3</div>
              <p className="text-mystic-300 text-sm">
                Découvrez le sens caché de votre rêve
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recording a Dream */}
      <Card className="glass-card border-mystic-700/30">
        <CardHeader>
          <CardTitle className="font-display text-xl text-lunar flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-mystic-400" />
            Enregistrer un rêve
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-mystic-300">
            Cliquez sur <Badge className="bg-gold/20 text-gold border-gold/30">Nouveau rêve</Badge> pour
            accéder au formulaire d&apos;enregistrement.
          </p>

          <div className="space-y-3">
            <h4 className="text-lunar font-medium">Informations à renseigner :</h4>
            <ul className="space-y-2 text-mystic-300">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                <span>
                  <strong className="text-lunar">Titre</strong> - Un nom court et évocateur
                  (ex: &quot;Vol au-dessus de l&apos;océan&quot;)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                <span>
                  <strong className="text-lunar">Description</strong> - Le plus de détails
                  possible : lieux, personnes, actions, couleurs, sensations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                <span>
                  <strong className="text-lunar">Émotions</strong> - Ce que vous avez
                  ressenti pendant ou après le rêve
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                <span>
                  <strong className="text-lunar">Lucidité</strong> - De 0 (inconscient) à
                  5 (totalement lucide, contrôle du rêve)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                <span>
                  <strong className="text-lunar">Tags</strong> - Vos propres mots-clés
                  pour organiser vos rêves
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Voice Recording */}
      <Card className="glass-card border-gold/20">
        <CardHeader>
          <CardTitle className="font-display text-xl text-gold flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Dictée vocale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-mystic-300">
            Vous pouvez <strong className="text-lunar">dicter votre rêve</strong> au lieu de le taper !
            Idéal pour capturer rapidement vos rêves dès le réveil.
          </p>

          <div className="space-y-3">
            <h4 className="text-lunar font-medium">Comment utiliser le micro :</h4>
            <ol className="space-y-2 text-mystic-300 list-decimal list-inside">
              <li>Repérez le bouton <Badge variant="outline" className="border-mystic-600 text-mystic-300"><Mic className="w-3 h-3 inline" /></Badge> à côté du champ de description</li>
              <li>Cliquez dessus pour <strong className="text-lunar">commencer l&apos;enregistrement</strong></li>
              <li>Parlez clairement en français</li>
              <li>Le texte s&apos;ajoute automatiquement à votre description</li>
              <li>Cliquez à nouveau pour <strong className="text-lunar">arrêter</strong></li>
            </ol>
          </div>

          <div className="bg-mystic-900/30 p-4 rounded-lg border border-mystic-700/30">
            <h4 className="text-lunar font-medium mb-2">Compatibilité</h4>
            <p className="text-mystic-400 text-sm">
              La dictée vocale fonctionne sur la plupart des navigateurs modernes
              (Chrome, Edge, Safari). Vous devrez autoriser l&apos;accès au microphone
              lors de la première utilisation.
            </p>
          </div>

          <div className="bg-gold/10 p-4 rounded-lg border border-gold/20">
            <p className="text-mystic-200 text-sm">
              <strong className="text-gold">💡 Astuce :</strong> La dictée vocale est
              aussi disponible lors de la <strong>modification</strong> d&apos;un rêve existant.
              Pratique pour ajouter des détails que vous auriez oubliés !
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Interpretation Styles */}
      <Card className="glass-card border-mystic-700/30">
        <CardHeader>
          <CardTitle className="font-display text-xl text-lunar flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-mystic-400" />
            Styles d&apos;interprétation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-mystic-300">
            L&apos;Oracle propose trois approches différentes pour analyser vos rêves :
          </p>

          <div className="space-y-3">
            <div className="bg-mystic-900/30 p-4 rounded-lg border border-mystic-700/30">
              <h4 className="text-gold font-medium mb-2">✨ Spirituel</h4>
              <p className="text-mystic-300 text-sm">
                Basé sur la symbolique ésotérique, les archétypes universels et les
                traditions mystiques. Idéal si vous êtes sensible aux dimensions
                spirituelles de vos rêves.
              </p>
            </div>

            <div className="bg-mystic-900/30 p-4 rounded-lg border border-mystic-700/30">
              <h4 className="text-gold font-medium mb-2">🧠 Psychologique</h4>
              <p className="text-mystic-300 text-sm">
                Analyse selon les principes de Jung : ombre, anima/animus, processus
                d&apos;individuation. Pour une approche plus analytique et introspective.
              </p>
            </div>

            <div className="bg-mystic-900/30 p-4 rounded-lg border border-mystic-700/30">
              <h4 className="text-gold font-medium mb-2">⚖️ Équilibré</h4>
              <p className="text-mystic-300 text-sm">
                Combinaison harmonieuse des deux approches. Recommandé pour une vision
                complète et nuancée de votre rêve.
              </p>
            </div>
          </div>

          <div className="bg-gold/10 p-4 rounded-lg border border-gold/20">
            <p className="text-mystic-200 text-sm">
              <strong className="text-gold">💡 Astuce :</strong> Après avoir reçu une
              interprétation, vous pouvez la voir sous un autre angle en cliquant sur
              les boutons de style alternatifs. Comparez les perspectives pour une
              compréhension plus riche !
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Understanding Interpretation */}
      <Card className="glass-card border-mystic-700/30">
        <CardHeader>
          <CardTitle className="font-display text-xl text-lunar flex items-center gap-2">
            <Moon className="w-5 h-5 text-mystic-400" />
            Comprendre l&apos;interprétation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-mystic-300">
            L&apos;Oracle vous fournit une analyse structurée de votre rêve :
          </p>

          <ul className="space-y-2 text-mystic-300">
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
              <span>
                <strong className="text-lunar">Symboles clés</strong> - Les éléments
                importants et leur signification profonde
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
              <span>
                <strong className="text-lunar">Thèmes émotionnels</strong> - Les
                sentiments sous-jacents identifiés
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
              <span>
                <strong className="text-lunar">Message principal</strong> - Ce que
                votre subconscient essaie de vous communiquer
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
              <span>
                <strong className="text-lunar">Questions de réflexion</strong> - Des
                pistes pour approfondir votre compréhension
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
              <span>
                <strong className="text-lunar">Conseil pratique</strong> - Une
                suggestion concrète à appliquer dans votre vie
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Editing Dreams */}
      <Card className="glass-card border-mystic-700/30">
        <CardHeader>
          <CardTitle className="font-display text-xl text-lunar flex items-center gap-2">
            <Edit className="w-5 h-5 text-mystic-400" />
            Modifier un rêve
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-mystic-300">
            Vous avez oublié des détails ? Vous pouvez modifier votre rêve à tout moment :
          </p>

          <ol className="space-y-2 text-mystic-300 list-decimal list-inside">
            <li>Ouvrez le rêve que vous souhaitez modifier</li>
            <li>
              <strong className="text-lunar">Survolez</strong> le texte de votre rêve
              avec la souris
            </li>
            <li>
              Cliquez sur le bouton <Badge variant="outline" className="border-mystic-600 text-mystic-300">Modifier</Badge> qui apparaît
            </li>
            <li>Éditez votre texte dans la zone qui s&apos;affiche</li>
            <li>
              Cliquez sur <Badge className="bg-gold/20 text-gold border-gold/30">Sauvegarder</Badge> ou{" "}
              <Badge variant="outline" className="border-mystic-600 text-mystic-300">Annuler</Badge>
            </li>
          </ol>

          <p className="text-mystic-400 text-sm italic">
            Après modification, vous pouvez demander une nouvelle interprétation qui
            prendra en compte les nouveaux détails.
          </p>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="glass-card border-gold/20">
        <CardHeader>
          <CardTitle className="font-display text-xl text-gold flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Astuces pour de meilleures interprétations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="bg-mystic-900/30 p-4 rounded-lg border border-mystic-700/30">
              <h4 className="text-lunar font-medium mb-2">📝 Notez immédiatement</h4>
              <p className="text-mystic-400 text-sm">
                Les détails s&apos;effacent vite. Gardez votre téléphone près du lit.
              </p>
            </div>

            <div className="bg-mystic-900/30 p-4 rounded-lg border border-mystic-700/30">
              <h4 className="text-lunar font-medium mb-2">🎨 Soyez précis</h4>
              <p className="text-mystic-400 text-sm">
                Couleurs, sons, textures, dialogues... Chaque détail compte.
              </p>
            </div>

            <div className="bg-mystic-900/30 p-4 rounded-lg border border-mystic-700/30">
              <h4 className="text-lunar font-medium mb-2">❤️ Incluez vos émotions</h4>
              <p className="text-mystic-400 text-sm">
                Les émotions sont souvent la clé de l&apos;interprétation.
              </p>
            </div>

            <div className="bg-mystic-900/30 p-4 rounded-lg border border-mystic-700/30">
              <h4 className="text-lunar font-medium mb-2">🔄 Comparez les styles</h4>
              <p className="text-mystic-400 text-sm">
                Chaque perspective peut révéler des aspects différents.
              </p>
            </div>

            <div className="bg-mystic-900/30 p-4 rounded-lg border border-mystic-700/30">
              <h4 className="text-lunar font-medium mb-2">🏷️ Utilisez les tags</h4>
              <p className="text-mystic-400 text-sm">
                Créez votre système pour repérer les thèmes récurrents.
              </p>
            </div>

            <div className="bg-mystic-900/30 p-4 rounded-lg border border-mystic-700/30">
              <h4 className="text-lunar font-medium mb-2">📖 Relisez vos rêves</h4>
              <p className="text-mystic-400 text-sm">
                Avec le recul, certaines interprétations prennent un nouveau sens.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-mystic-500 italic">
          DreamOracle - Explorez les mystères de votre subconscient
        </p>
      </div>
    </div>
  );
}
