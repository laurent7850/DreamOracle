/**
 * Biorhythm calculator
 *
 * Three primary cycles:
 * - Physical: 23 days (energy, stamina, strength)
 * - Emotional: 28 days (mood, sensitivity, creativity)
 * - Intellectual: 33 days (focus, memory, reasoning)
 *
 * Formula: sin(2π × d / period) where d = days since birth
 * Result: -1 to +1
 */

export interface BiorhythmCycle {
  name: string;
  nameEn: string;
  period: number;
  value: number;       // -1 to 1
  percentage: number;  // -100 to 100
  phase: "high" | "low" | "critical" | "rising" | "falling";
  color: string;
  description: string;
}

export interface BiorhythmDay {
  date: Date;
  physical: number;
  emotional: number;
  intellectual: number;
}

const CYCLES = {
  physical: { period: 23, name: "Physique", nameEn: "physical", color: "#ef4444" },
  emotional: { period: 28, name: "Émotionnel", nameEn: "emotional", color: "#3b82f6" },
  intellectual: { period: 33, name: "Intellectuel", nameEn: "intellectual", color: "#22c55e" },
} as const;

/**
 * Calculate the number of days between two dates (ignoring time)
 */
function daysBetween(date1: Date, date2: Date): number {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  const diffMs = d2.getTime() - d1.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Calculate a single biorhythm value
 */
function calcCycleValue(daysSinceBirth: number, period: number): number {
  return Math.sin((2 * Math.PI * daysSinceBirth) / period);
}

/**
 * Determine the phase of a cycle
 */
function getPhase(value: number, period: number, daysSinceBirth: number): BiorhythmCycle["phase"] {
  // Critical: near zero crossing (within threshold)
  if (Math.abs(value) < 0.05) return "critical";

  // Calculate derivative to know direction
  const nextValue = Math.sin((2 * Math.PI * (daysSinceBirth + 1)) / period);
  const isRising = nextValue > value;

  if (value > 0.7) return "high";
  if (value < -0.7) return "low";
  return isRising ? "rising" : "falling";
}

/**
 * Get description for a phase
 */
function getPhaseDescription(cycleName: string, phase: BiorhythmCycle["phase"]): string {
  const descriptions: Record<string, Record<BiorhythmCycle["phase"], string>> = {
    Physique: {
      high: "Excellente vitalité et endurance. Moment idéal pour l'exercice intense.",
      low: "Énergie basse. Privilégiez le repos et la récupération.",
      critical: "Jour critique physique. Soyez prudent avec les efforts intenses.",
      rising: "Énergie montante. Votre corps reprend des forces.",
      falling: "Énergie déclinante. Ralentissez progressivement.",
    },
    Émotionnel: {
      high: "Harmonie émotionnelle. Créativité et empathie au sommet.",
      low: "Sensibilité accrue. Prenez soin de votre bien-être intérieur.",
      critical: "Jour critique émotionnel. Les émotions peuvent être instables.",
      rising: "Humeur en amélioration. Ouverture aux relations sociales.",
      falling: "Repli émotionnel progressif. Accordez-vous du temps calme.",
    },
    Intellectuel: {
      high: "Clarté mentale maximale. Parfait pour les décisions importantes.",
      low: "Concentration réduite. Évitez les tâches complexes si possible.",
      critical: "Jour critique intellectuel. Risque d'erreurs de jugement.",
      rising: "Acuité mentale croissante. Bon moment pour apprendre.",
      falling: "Capacités analytiques en baisse. Misez sur la routine.",
    },
  };
  return descriptions[cycleName]?.[phase] || "";
}

/**
 * Calculate complete biorhythm for a given date
 */
export function calculateBiorhythm(birthDate: Date, targetDate: Date): BiorhythmCycle[] {
  const days = daysBetween(birthDate, targetDate);

  return Object.entries(CYCLES).map(([, cycle]) => {
    const value = calcCycleValue(days, cycle.period);
    const phase = getPhase(value, cycle.period, days);

    return {
      name: cycle.name,
      nameEn: cycle.nameEn,
      period: cycle.period,
      value: Math.round(value * 1000) / 1000,
      percentage: Math.round(value * 100),
      phase,
      color: cycle.color,
      description: getPhaseDescription(cycle.name, phase),
    };
  });
}

/**
 * Calculate biorhythm values for a date range (for chart)
 */
export function calculateBiorhythmRange(
  birthDate: Date,
  startDate: Date,
  endDate: Date
): BiorhythmDay[] {
  const result: BiorhythmDay[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const days = daysBetween(birthDate, current);
    result.push({
      date: new Date(current),
      physical: Math.round(calcCycleValue(days, CYCLES.physical.period) * 1000) / 1000,
      emotional: Math.round(calcCycleValue(days, CYCLES.emotional.period) * 1000) / 1000,
      intellectual: Math.round(calcCycleValue(days, CYCLES.intellectual.period) * 1000) / 1000,
    });
    current.setDate(current.getDate() + 1);
  }

  return result;
}

/**
 * Find the next critical days (zero crossings) for each cycle
 */
export function findCriticalDays(
  birthDate: Date,
  fromDate: Date,
  daysAhead: number = 30
): { date: Date; cycle: string; color: string }[] {
  const criticals: { date: Date; cycle: string; color: string }[] = [];

  for (let d = 0; d < daysAhead; d++) {
    const date = new Date(fromDate);
    date.setDate(date.getDate() + d);
    const days = daysBetween(birthDate, date);

    for (const [, cycle] of Object.entries(CYCLES)) {
      const value = calcCycleValue(days, cycle.period);
      if (Math.abs(value) < 0.1) {
        criticals.push({ date: new Date(date), cycle: cycle.name, color: cycle.color });
      }
    }
  }

  return criticals;
}
