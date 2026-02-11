/**
 * Dictionnaire de symboles par défaut pour DreamOracle
 *
 * Ces interprétations suivent l'approche de l'Oracle:
 * - Psychanalyse jungienne (archétypes, ombre, anima/animus)
 * - Symbolique universelle
 * - Sagesse ésotérique et spirituelle
 *
 * Style: Bienveillant, mystique mais accessible, jamais alarmiste
 */

export interface DefaultSymbol {
  name: string;
  meaning: string;
  category: 'nature' | 'animaux' | 'elements' | 'objets' | 'personnes' | 'lieux' | 'actions' | 'corps';
}

export const DEFAULT_SYMBOLS: DefaultSymbol[] = [
  // === ÉLÉMENTS ===
  {
    name: "eau",
    meaning: "L'eau représente les émotions, l'inconscient et le flux de la vie. Une eau calme suggère la paix intérieure, tandis qu'une eau agitée révèle des turbulences émotionnelles. C'est aussi le symbole de la purification et de la renaissance spirituelle.",
    category: "elements"
  },
  {
    name: "feu",
    meaning: "Le feu symbolise la transformation, la passion et l'énergie vitale. Il peut représenter une purification intense ou un désir ardent. Dans son aspect destructeur, il indique un changement radical nécessaire ; dans son aspect lumineux, l'illumination spirituelle.",
    category: "elements"
  },
  {
    name: "terre",
    meaning: "La terre incarne la stabilité, l'ancrage et le monde matériel. Elle représente nos racines, notre besoin de sécurité et notre connexion au concret. Marcher sur terre ferme indique une période de solidité, tandis qu'un sol instable suggère des doutes sur ses fondations.",
    category: "elements"
  },
  {
    name: "air",
    meaning: "L'air symbolise la pensée, la communication et la liberté. Le vent peut représenter le changement qui arrive, une inspiration soudaine ou le souffle de vie. Un air pur suggère la clarté mentale, tandis qu'un air pollué indique des pensées confuses.",
    category: "elements"
  },

  // === NATURE ===
  {
    name: "forêt",
    meaning: "La forêt représente l'inconscient, les parties inexplorées de soi-même. S'y aventurer symbolise un voyage intérieur vers la découverte de soi. Une forêt dense peut évoquer la confusion, tandis qu'une clairière représente un moment de lucidité et de révélation.",
    category: "nature"
  },
  {
    name: "montagne",
    meaning: "La montagne symbolise les défis à surmonter, les ambitions élevées et la quête spirituelle. Gravir une montagne représente l'effort vers l'accomplissement personnel. Le sommet incarne l'illumination et la perspective élargie sur la vie.",
    category: "nature"
  },
  {
    name: "mer",
    meaning: "La mer, immense et profonde, représente l'inconscient collectif et les émotions primordiales. Elle symbolise aussi l'infini des possibilités. Naviguer sur la mer suggère un voyage vers l'inconnu, tandis que plonger évoque l'exploration des profondeurs de l'âme.",
    category: "nature"
  },
  {
    name: "lune",
    meaning: "La lune incarne le féminin sacré, l'intuition et les cycles de la vie. Elle éclaire la nuit de l'inconscient et guide les rêveurs. Une pleine lune amplifie les émotions et favorise les révélations, tandis qu'une nouvelle lune invite aux nouveaux commencements.",
    category: "nature"
  },
  {
    name: "soleil",
    meaning: "Le soleil représente la conscience, la vitalité et l'énergie masculine. Il symbolise l'illumination, la clarté et la force vitale. Un soleil radieux annonce une période d'épanouissement, tandis qu'un soleil voilé suggère une conscience temporairement obscurcie.",
    category: "nature"
  },
  {
    name: "arbre",
    meaning: "L'arbre est l'axe du monde, reliant les racines (l'inconscient, les ancêtres) au ciel (le spirituel). Il symbolise la croissance personnelle et la sagesse. Un arbre fleuri évoque l'épanouissement, un arbre mort invite à lâcher ce qui ne sert plus.",
    category: "nature"
  },
  {
    name: "fleur",
    meaning: "Les fleurs symbolisent la beauté éphémère, l'épanouissement et l'amour. Chaque fleur porte sa signification : la rose pour l'amour, le lotus pour l'éveil spirituel. Une fleur qui s'ouvre représente une nouvelle conscience qui éclot en toi.",
    category: "nature"
  },
  {
    name: "jardin",
    meaning: "Le jardin représente l'âme cultivée, l'espace intérieur que l'on soigne. Un jardin fleuri indique un travail intérieur fructueux, tandis qu'un jardin en friche suggère des aspects de soi négligés qui demandent attention.",
    category: "nature"
  },
  {
    name: "rivière",
    meaning: "La rivière symbolise le flux de la vie et du temps qui passe. Suivre son courant représente l'acceptation du changement, tandis que remonter le courant suggère un travail sur le passé ou une résistance au changement naturel.",
    category: "nature"
  },
  {
    name: "étoile",
    meaning: "Les étoiles représentent les guides spirituels, l'espoir et la destinée. Elles illuminent l'obscurité et orientent le voyageur. Une étoile brillante suggère une guidance spirituelle, un chemin qui se révèle dans la nuit de l'incertitude.",
    category: "nature"
  },
  {
    name: "orage",
    meaning: "L'orage symbolise une libération émotionnelle intense, une purification nécessaire. Les éclairs représentent des prises de conscience soudaines, le tonnerre la voix de l'inconscient. Après l'orage vient toujours le calme et la clarté.",
    category: "nature"
  },
  {
    name: "neige",
    meaning: "La neige représente la pureté, le silence intérieur et parfois l'engourdissement émotionnel. Un paysage enneigé invite à la contemplation et au repos. La fonte des neiges symbolise le dégel émotionnel et le retour du printemps intérieur.",
    category: "nature"
  },

  // === ANIMAUX ===
  {
    name: "serpent",
    meaning: "Le serpent est un puissant symbole de transformation et de renaissance (la mue). Il représente aussi la sagesse ancestrale et l'énergie vitale (kundalini). Dans son aspect ombre, il peut évoquer des peurs inconscientes ou une trahison. C'est un messager de changement profond.",
    category: "animaux"
  },
  {
    name: "loup",
    meaning: "Le loup symbolise l'instinct, la liberté et la guidance intérieure. Animal social, il représente aussi la loyauté et la famille. Rencontrer un loup en rêve invite à écouter son instinct profond et à trouver sa meute, ceux qui partagent nos valeurs.",
    category: "animaux"
  },
  {
    name: "oiseau",
    meaning: "Les oiseaux représentent la liberté, l'élévation spirituelle et les messages de l'âme. Ils sont des messagers entre le ciel et la terre. Un oiseau en vol suggère une aspiration à la liberté, tandis qu'un oiseau en cage révèle un sentiment d'enfermement.",
    category: "animaux"
  },
  {
    name: "chat",
    meaning: "Le chat incarne l'indépendance, l'intuition féminine et le mystère. Gardien des secrets, il représente la capacité à voir dans l'obscurité de l'inconscient. Un chat amical suggère d'honorer son intuition, un chat sauvage évoque des instincts réprimés.",
    category: "animaux"
  },
  {
    name: "chien",
    meaning: "Le chien symbolise la fidélité, la protection et l'amitié inconditionnelle. Il représente souvent un guide ou un aspect loyal de soi-même. Un chien joueur invite à retrouver la joie simple, un chien protecteur suggère un besoin de sécurité.",
    category: "animaux"
  },
  {
    name: "cheval",
    meaning: "Le cheval représente la puissance vitale, la liberté et les instincts nobles. Monter un cheval suggère la maîtrise de ses pulsions, un cheval sauvage représente une énergie brute à canaliser. C'est aussi le symbole du voyage et de la progression.",
    category: "animaux"
  },
  {
    name: "poisson",
    meaning: "Les poissons symbolisent les contenus de l'inconscient, la fertilité et l'abondance spirituelle. Nageant dans les eaux profondes, ils représentent les idées et intuitions qui émergent des profondeurs. Un poisson brillant est un trésor de l'âme qui remonte à la surface.",
    category: "animaux"
  },
  {
    name: "araignée",
    meaning: "L'araignée tisse la toile du destin et représente la créativité, la patience et l'interconnexion de toutes choses. Elle invite à voir les liens subtils entre les événements. Son aspect ombre peut évoquer un sentiment d'être piégé ou manipulé.",
    category: "animaux"
  },
  {
    name: "papillon",
    meaning: "Le papillon est le symbole ultime de la métamorphose et de la renaissance. Il représente la légèreté de l'âme et la beauté qui émerge des périodes difficiles. Voir un papillon annonce une transformation positive en cours.",
    category: "animaux"
  },
  {
    name: "corbeau",
    meaning: "Le corbeau est un messager entre les mondes, gardien des mystères et de la magie. Souvent mal compris, il représente la transformation profonde et la mort symbolique nécessaire à la renaissance. Il invite à regarder au-delà des apparences.",
    category: "animaux"
  },
  {
    name: "aigle",
    meaning: "L'aigle symbolise la vision élevée, la puissance spirituelle et la connexion au divin. Voler avec un aigle représente l'élévation de la conscience au-dessus des préoccupations terrestres. Il invite à prendre du recul pour voir la situation d'ensemble.",
    category: "animaux"
  },
  {
    name: "ours",
    meaning: "L'ours représente la force intérieure, l'introspection et le cycle de repos/action. Son hibernation symbolise le besoin de se retirer pour se régénérer. Rencontrer un ours invite à puiser dans ses ressources intérieures et à respecter ses rythmes naturels.",
    category: "animaux"
  },

  // === PERSONNES & ARCHÉTYPES ===
  {
    name: "enfant",
    meaning: "L'enfant représente l'innocence, la spontanéité et le potentiel infini. C'est l'archétype du Puer/Puella - la partie de soi toujours capable d'émerveillement. Un enfant joyeux invite à retrouver cette légèreté, un enfant triste révèle une blessure intérieure à guérir.",
    category: "personnes"
  },
  {
    name: "mère",
    meaning: "La mère incarne l'archétype du féminin nourricier, la protection et l'amour inconditionnel. Elle peut représenter ta propre mère ou l'aspect maternel en toi. Une mère bienveillante suggère un besoin de réconfort, une mère absente un manque à combler.",
    category: "personnes"
  },
  {
    name: "père",
    meaning: "Le père représente l'autorité, la structure et le masculin protecteur. C'est l'archétype du guide et du mentor. Il peut symboliser ton propre père ou l'aspect paternel en toi qui établit les règles et donne direction à ta vie.",
    category: "personnes"
  },
  {
    name: "inconnu",
    meaning: "Un inconnu dans un rêve représente souvent un aspect de toi-même que tu ne reconnais pas encore. C'est une partie de ton ombre (qualités réprimées) ou de ton potentiel non manifesté. Observe ses qualités : elles t'appartiennent aussi.",
    category: "personnes"
  },
  {
    name: "vieillard",
    meaning: "Le vieillard ou la vieille femme sage est l'archétype du Sage - la sagesse intérieure, l'expérience accumulée et la guidance spirituelle. Recevoir un message d'un vieux sage est un don précieux de l'inconscient.",
    category: "personnes"
  },
  {
    name: "ombre",
    meaning: "L'ombre jungienne représente tout ce que tu as réprimé ou nié en toi. Elle contient autant de trésors que de démons. Rencontrer son ombre est une invitation à l'intégration, à accepter ces parts rejetées pour devenir plus complet.",
    category: "personnes"
  },
  {
    name: "jumeau",
    meaning: "Le jumeau ou double représente ton autre aspect, parfois opposé - ce que tu aurais pu être ou une facette cachée de ta personnalité. C'est une invitation à l'intégration des polarités en toi.",
    category: "personnes"
  },

  // === LIEUX ===
  {
    name: "maison",
    meaning: "La maison représente ton être, ta psyché dans son ensemble. Chaque pièce correspond à un aspect de toi : le grenier (spirituel, mémoires), le sous-sol (inconscient), la cuisine (transformation, nourriture émotionnelle). L'état de la maison reflète ton état intérieur.",
    category: "lieux"
  },
  {
    name: "escalier",
    meaning: "L'escalier symbolise la transition entre différents niveaux de conscience. Monter représente l'élévation spirituelle ou l'accès au conscient, descendre l'exploration de l'inconscient. Un escalier en colimaçon évoque un chemin initiatique.",
    category: "lieux"
  },
  {
    name: "porte",
    meaning: "La porte représente le passage, l'opportunité et le choix. Une porte ouverte invite à l'exploration, une porte fermée suggère un accès à gagner ou une limite à respecter. Franchir une porte symbolise un changement de conscience.",
    category: "lieux"
  },
  {
    name: "pont",
    meaning: "Le pont symbolise la transition, le passage d'un état à un autre. C'est le lien entre deux aspects de soi ou deux phases de vie. Traverser un pont représente un changement en cours, un pont effondré suggère une connexion à reconstruire.",
    category: "lieux"
  },
  {
    name: "chemin",
    meaning: "Le chemin représente le parcours de vie, la direction choisie. Un chemin clair indique une voie définie, un carrefour un choix à faire, un chemin envahi suggère des obstacles à surmonter. C'est le Tao, la voie personnelle.",
    category: "lieux"
  },
  {
    name: "cave",
    meaning: "La cave ou le sous-sol représente l'inconscient profond, les mémoires cachées et les trésors enfouis. Y descendre invite à explorer ce qui a été enterré. C'est un espace de transformation où ce qui était caché peut être révélé.",
    category: "lieux"
  },
  {
    name: "grenier",
    meaning: "Le grenier symbolise le mental supérieur, les mémoires anciennes et le spirituel. On y trouve les souvenirs oubliés et les potentiels non exploités. Explorer un grenier invite à redécouvrir des parts de soi laissées de côté.",
    category: "lieux"
  },
  {
    name: "école",
    meaning: "L'école représente l'apprentissage de vie, les leçons que l'âme doit intégrer. Retourner à l'école en rêve suggère qu'une leçon importante se présente. C'est aussi le lieu où l'on est évalué - peut-être par soi-même.",
    category: "lieux"
  },
  {
    name: "hôpital",
    meaning: "L'hôpital symbolise la guérison, la vulnérabilité et le besoin de soins. Il peut indiquer qu'une partie de toi demande attention et repos. C'est un lieu de transformation où l'on se remet d'épreuves pour renaître plus fort.",
    category: "lieux"
  },
  {
    name: "labyrinthe",
    meaning: "Le labyrinthe représente le voyage initiatique, la quête du centre (le Soi). Se perdre dans un labyrinthe symbolise la confusion temporaire, trouver le centre représente l'atteinte de la sagesse intérieure. Le chemin compte autant que la destination.",
    category: "lieux"
  },
  {
    name: "temple",
    meaning: "Le temple ou l'église représente le sacré intérieur, la connexion au divin et la quête spirituelle. C'est le sanctuaire de l'âme, l'espace de recueillement et de transformation. Y entrer invite à honorer ta dimension spirituelle.",
    category: "lieux"
  },

  // === OBJETS ===
  {
    name: "miroir",
    meaning: "Le miroir représente l'introspection, la vérité et la réflexion sur soi. Ce que tu vois dans le miroir révèle comment tu te perçois. Un miroir brisé suggère une image de soi fragmentée, un miroir clair une connaissance de soi limpide.",
    category: "objets"
  },
  {
    name: "clé",
    meaning: "La clé symbolise l'accès, la solution et le pouvoir d'ouvrir de nouvelles possibilités. Trouver une clé annonce une réponse à une question ou l'accès à quelque chose de précieux. Perdre une clé suggère un sentiment d'impuissance temporaire.",
    category: "objets"
  },
  {
    name: "épée",
    meaning: "L'épée représente le discernement, le pouvoir de trancher et la vérité. C'est l'outil qui sépare l'essentiel de l'accessoire. Une épée brillante symbolise la clarté mentale, une épée rouillée suggère un pouvoir de décision négligé.",
    category: "objets"
  },
  {
    name: "livre",
    meaning: "Le livre représente la connaissance, la sagesse et les leçons de vie. Un livre ouvert invite à l'apprentissage, un livre fermé suggère des connaissances à découvrir. Écrire dans un livre symbolise la création de ta propre histoire.",
    category: "objets"
  },
  {
    name: "voiture",
    meaning: "La voiture représente le véhicule de vie, la façon dont tu avances dans ton parcours. Conduire symbolise le contrôle que tu as sur ta direction, être passager suggère de laisser quelqu'un d'autre guider. L'état du véhicule reflète ton énergie.",
    category: "objets"
  },
  {
    name: "bateau",
    meaning: "Le bateau symbolise le voyage émotionnel et spirituel sur les eaux de l'inconscient. Naviguer en eaux calmes suggère la sérénité, affronter la tempête représente des défis émotionnels. Le bateau est ce qui te maintient à flot.",
    category: "objets"
  },
  {
    name: "avion",
    meaning: "L'avion représente l'élévation rapide, les ambitions et la vision d'ensemble. Voler en avion symbolise une prise de hauteur sur ta vie, un décollage représente le lancement d'un projet. Un atterrissage invite à revenir au concret.",
    category: "objets"
  },
  {
    name: "téléphone",
    meaning: "Le téléphone symbolise la communication, les messages et les connexions. Un appel important représente un message de l'inconscient, ne pas pouvoir appeler suggère une difficulté à communiquer quelque chose d'important.",
    category: "objets"
  },
  {
    name: "argent",
    meaning: "L'argent représente l'énergie, la valeur personnelle et les ressources. Trouver de l'argent symbolise la découverte de ressources intérieures, en perdre peut indiquer un sentiment de dévalorisation. C'est l'énergie d'échange de la vie.",
    category: "objets"
  },
  {
    name: "bijou",
    meaning: "Les bijoux représentent les trésors intérieurs, les qualités précieuses et l'essence du Soi. Découvrir un bijou symbolise la reconnaissance d'une qualité en toi. Un bijou perdu invite à rechercher ce qui a de la valeur.",
    category: "objets"
  },
  {
    name: "vêtement",
    meaning: "Les vêtements représentent le persona, l'image que tu présentes au monde. Changer de vêtements symbolise un changement d'identité sociale, être nu suggère la vulnérabilité ou l'authenticité. L'état des vêtements reflète l'image de soi.",
    category: "objets"
  },

  // === ACTIONS & SITUATIONS ===
  {
    name: "vol",
    meaning: "Voler en rêve représente la liberté, l'élévation au-dessus des contraintes et l'expansion de conscience. C'est l'une des expériences oniriques les plus positives, suggérant que tu transcendes les limitations. La hauteur atteinte reflète ton niveau d'élévation spirituelle.",
    category: "actions"
  },
  {
    name: "chute",
    meaning: "La chute symbolise la perte de contrôle, l'insécurité ou le lâcher-prise nécessaire. Elle peut indiquer une peur de l'échec ou une invitation à abandonner ce qui ne te sert plus. Souvent, elle précède une prise de conscience importante.",
    category: "actions"
  },
  {
    name: "poursuite",
    meaning: "Être poursuivi représente une fuite devant quelque chose en toi - une émotion, une vérité, un aspect de ton ombre. Ce qui te poursuit demande à être affronté et intégré. Se retourner pour faire face transforme le poursuivant.",
    category: "actions"
  },
  {
    name: "noyade",
    meaning: "Se noyer symbolise le sentiment d'être submergé par les émotions ou les circonstances. C'est une invitation à apprendre à naviguer les eaux émotionnelles plutôt qu'à les fuir. Trouver comment respirer sous l'eau représente l'adaptation.",
    category: "actions"
  },
  {
    name: "nudité",
    meaning: "La nudité représente la vulnérabilité, l'authenticité ou la peur du jugement. Être nu en public suggère une crainte d'être exposé, mais aussi le courage d'être vrai. C'est l'invitation à accepter qui tu es vraiment.",
    category: "actions"
  },
  {
    name: "examen",
    meaning: "L'examen représente l'auto-évaluation, la peur de ne pas être à la hauteur ou une période de test dans la vie. Ne pas être préparé reflète l'anxiété de performance. C'est l'inconscient qui invite à examiner ce qui doit l'être.",
    category: "actions"
  },
  {
    name: "mort",
    meaning: "La mort en rêve symbolise la fin d'un cycle, une transformation profonde - rarement une mort littérale. C'est la mort symbolique nécessaire à la renaissance : une identité, une relation ou une période de vie qui se termine pour qu'une autre commence.",
    category: "actions"
  },
  {
    name: "naissance",
    meaning: "La naissance représente un nouveau commencement, l'émergence d'une nouvelle partie de soi ou d'un projet. C'est le symbole du potentiel qui se manifeste, de la créativité qui prend forme. Une naissance difficile suggère une transition laborieuse mais fructueuse.",
    category: "actions"
  },
  {
    name: "mariage",
    meaning: "Le mariage symbolise l'union des opposés en soi, l'intégration et l'engagement. C'est le hieros gamos jungien - l'union du masculin et du féminin intérieurs. Il peut aussi représenter un engagement important dans ta vie éveillée.",
    category: "actions"
  },
  {
    name: "combat",
    meaning: "Le combat représente un conflit intérieur, une lutte entre différentes parties de soi ou avec des obstacles. Gagner un combat symbolise la victoire sur ses démons intérieurs, perdre invite à reconsidérer son approche du conflit.",
    category: "actions"
  },

  // === CORPS ===
  {
    name: "dents",
    meaning: "Les dents représentent la capacité à 's'affirmer', à mordre dans la vie. Perdre ses dents est un rêve très commun symbolisant la peur de perdre son pouvoir, son attractivité ou de vieillir. C'est aussi lié aux changements et transitions.",
    category: "corps"
  },
  {
    name: "cheveux",
    meaning: "Les cheveux symbolisent la force vitale, l'identité et les pensées. Les couper représente un changement d'identité ou de façon de penser, les perdre suggère une perte de vitalité ou de pouvoir. De longs cheveux évoquent la liberté et la force.",
    category: "corps"
  },
  {
    name: "mains",
    meaning: "Les mains représentent la capacité d'action, de création et de connexion. Des mains habiles suggèrent la maîtrise, des mains liées l'impuissance. Tendre la main symbolise l'aide offerte ou reçue, la connexion humaine.",
    category: "corps"
  },
  {
    name: "yeux",
    meaning: "Les yeux sont les fenêtres de l'âme, symbolisant la perception, la conscience et l'intuition. Des yeux brillants suggèrent la clairvoyance, des yeux fermés l'aveuglement volontaire. Le troisième oeil représente la vision intérieure.",
    category: "corps"
  },
  {
    name: "coeur",
    meaning: "Le coeur représente l'amour, les émotions profondes et le centre de l'être. Un coeur ouvert symbolise la capacité d'aimer, un coeur blessé les peines amoureuses à guérir. C'est le siège de ta vérité émotionnelle.",
    category: "corps"
  },
  {
    name: "sang",
    meaning: "Le sang symbolise la force vitale, l'essence de vie et les liens familiaux. Perdre du sang peut indiquer une perte d'énergie ou un sacrifice nécessaire. C'est aussi le symbole des émotions intenses et de la passion.",
    category: "corps"
  }
];

// Get symbols by category
export function getSymbolsByCategory(category: DefaultSymbol['category']): DefaultSymbol[] {
  return DEFAULT_SYMBOLS.filter(s => s.category === category);
}

// Search symbols
export function searchDefaultSymbols(query: string): DefaultSymbol[] {
  const lowerQuery = query.toLowerCase();
  return DEFAULT_SYMBOLS.filter(s =>
    s.name.toLowerCase().includes(lowerQuery) ||
    s.meaning.toLowerCase().includes(lowerQuery)
  );
}

// Get all category names in French
export const CATEGORY_LABELS: Record<DefaultSymbol['category'], string> = {
  nature: "Nature & Cosmos",
  animaux: "Animaux",
  elements: "Éléments",
  objets: "Objets",
  personnes: "Personnes & Archétypes",
  lieux: "Lieux & Espaces",
  actions: "Actions & Situations",
  corps: "Corps & Parties du corps"
};
