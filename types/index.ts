export interface Dream {
  id: string;
  userId: string;
  title: string;
  content: string;
  dreamDate: Date;
  emotions: string[];
  symbols: string[];
  lucidity: number;
  interpretation: string | null;
  interpretedAt: Date | null;
  tags: string[];
  isRecurring: boolean;
  recurringId: string | null;
  mood: string | null;
  sleepQuality: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DreamFormData {
  title: string;
  content: string;
  dreamDate: Date;
  emotions: string[];
  sleepQuality: number;
  lucidity: number;
  mood: string;
  isRecurring: boolean;
  tags: string[];
}

export interface DreamInterpretation {
  symbols: {
    name: string;
    meaning: string;
  }[];
  emotionalThemes: string[];
  mainMessage: string;
  reflectionQuestions: string[];
  practicalAdvice: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  interpretationStyle: "spiritual" | "psychological" | "balanced";
  language: string;
  notificationsEnabled: boolean;
  reminderTime: string | null;
  theme: "dark" | "midnight" | "aurora";
}

export type EmotionOption = {
  value: string;
  label: string;
  emoji: string;
};

export const EMOTION_OPTIONS: EmotionOption[] = [
  { value: "joy", label: "Joie", emoji: "😊" },
  { value: "fear", label: "Peur", emoji: "😨" },
  { value: "sadness", label: "Tristesse", emoji: "😢" },
  { value: "anger", label: "Colère", emoji: "😠" },
  { value: "surprise", label: "Surprise", emoji: "😲" },
  { value: "confusion", label: "Confusion", emoji: "😵" },
  { value: "peace", label: "Paix", emoji: "😌" },
  { value: "anxiety", label: "Anxiété", emoji: "😰" },
  { value: "love", label: "Amour", emoji: "❤️" },
  { value: "nostalgia", label: "Nostalgie", emoji: "🥺" },
  { value: "wonder", label: "Émerveillement", emoji: "✨" },
  { value: "guilt", label: "Culpabilité", emoji: "😔" },
];

export const MOOD_OPTIONS = [
  { value: "positive", label: "Positif" },
  { value: "negative", label: "Négatif" },
  { value: "neutral", label: "Neutre" },
  { value: "confused", label: "Confus" },
];

export const INTERPRETATION_STYLES = [
  {
    value: "spiritual",
    label: "Spirituel",
    description: "Interprétation basée sur la symbolique ésotérique et spirituelle",
  },
  {
    value: "psychological",
    label: "Psychologique",
    description: "Analyse selon les principes de la psychanalyse jungienne",
  },
  {
    value: "balanced",
    label: "Équilibré",
    description: "Combinaison des approches spirituelle et psychologique",
  },
];
