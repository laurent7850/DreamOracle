"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Activity,
  Heart,
  Brain,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  GripHorizontal,
  Lock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface BiorhythmCycle {
  name: string;
  nameEn: string;
  period: number;
  value: number;
  percentage: number;
  phase: "high" | "low" | "critical" | "rising" | "falling";
  color: string;
  description: string;
}

interface ChartDay {
  date: string;
  physical: number;
  emotional: number;
  intellectual: number;
}

interface CriticalDay {
  date: string;
  cycle: string;
  color: string;
}

interface BiorhythmData {
  cycles: BiorhythmCycle[];
  chartData: ChartDay[];
  criticalDays: CriticalDay[];
  targetDate: string;
  needsBirthDate?: boolean;
  hasAdvanced?: boolean;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

const phaseIcons: Record<string, React.ReactNode> = {
  high: <TrendingUp className="w-4 h-4" />,
  low: <TrendingDown className="w-4 h-4" />,
  critical: <AlertTriangle className="w-4 h-4" />,
  rising: <TrendingUp className="w-4 h-4" />,
  falling: <TrendingDown className="w-4 h-4" />,
};

const phaseLabels: Record<string, string> = {
  high: "Élevé",
  low: "Bas",
  critical: "Critique",
  rising: "En hausse",
  falling: "En baisse",
};

const cycleIcons: Record<string, React.ReactNode> = {
  Physique: <Activity className="w-5 h-5" />,
  Émotionnel: <Heart className="w-5 h-5" />,
  Intellectuel: <Brain className="w-5 h-5" />,
};

// SVG Chart component with interactive slider
function BiorhythmChart({
  chartData,
  selectedIndex,
  onIndexChange,
}: {
  chartData: ChartDay[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
}) {
  const width = 700;
  const height = 280;
  const padding = { top: 20, right: 15, bottom: 30, left: 35 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);

  const lines = useMemo(() => {
    const keys = ["physical", "emotional", "intellectual"] as const;
    const colors = ["#ef4444", "#3b82f6", "#22c55e"];

    return keys.map((key, ki) => {
      const points = chartData.map((d, i) => {
        const x = padding.left + (i / (chartData.length - 1)) * chartW;
        const y = padding.top + chartH / 2 - (d[key] * chartH) / 2;
        return `${x},${y}`;
      });
      return { key, color: colors[ki], points: points.join(" ") };
    });
  }, [chartData, chartW, chartH, padding.left, padding.top]);

  // Grid lines and labels
  const gridYPositions = [-1, -0.5, 0, 0.5, 1].map((v) => ({
    y: padding.top + chartH / 2 - (v * chartH) / 2,
    label: `${Math.round(v * 100)}%`,
  }));

  // X-axis labels (every 10 days for 61-day range)
  const xLabels = chartData
    .filter((_, i) => i % 10 === 0)
    .map((d, idx) => ({
      x: padding.left + ((idx * 10) / (chartData.length - 1)) * chartW,
      label: formatShortDate(d.date),
    }));

  // Selected day line X position
  const selectedX =
    selectedIndex >= 0 && selectedIndex < chartData.length
      ? padding.left + (selectedIndex / (chartData.length - 1)) * chartW
      : -1;

  // Convert client X to chart index
  const clientXToIndex = useCallback(
    (clientX: number) => {
      if (!svgRef.current) return selectedIndex;
      const rect = svgRef.current.getBoundingClientRect();
      const svgX = ((clientX - rect.left) / rect.width) * width;
      const ratio = (svgX - padding.left) / chartW;
      const idx = Math.round(ratio * (chartData.length - 1));
      return Math.max(0, Math.min(chartData.length - 1, idx));
    },
    [chartData.length, chartW, padding.left, selectedIndex, width]
  );

  // Mouse/touch handlers for dragging on the chart
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      isDragging.current = true;
      svgRef.current?.setPointerCapture(e.pointerId);
      const idx = clientXToIndex(e.clientX);
      onIndexChange(idx);
    },
    [clientXToIndex, onIndexChange]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!isDragging.current) return;
      const idx = clientXToIndex(e.clientX);
      onIndexChange(idx);
    },
    [clientXToIndex, onIndexChange]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      isDragging.current = false;
      svgRef.current?.releasePointerCapture(e.pointerId);
    },
    []
  );

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto cursor-crosshair touch-none"
      preserveAspectRatio="xMidYMid meet"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Grid */}
      {gridYPositions.map((g, i) => (
        <g key={i}>
          <line
            x1={padding.left}
            y1={g.y}
            x2={width - padding.right}
            y2={g.y}
            stroke={i === 2 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)"}
            strokeWidth={i === 2 ? 1.5 : 1}
            strokeDasharray={i === 2 ? "none" : "4,4"}
          />
          <text
            x={padding.left - 5}
            y={g.y + 4}
            textAnchor="end"
            fill="rgba(255,255,255,0.4)"
            fontSize="10"
          >
            {g.label}
          </text>
        </g>
      ))}

      {/* X labels */}
      {xLabels.map((l, i) => (
        <text
          key={i}
          x={l.x}
          y={height - 5}
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="10"
        >
          {l.label}
        </text>
      ))}

      {/* Selected day line */}
      {selectedX > 0 && (
        <>
          <line
            x1={selectedX}
            y1={padding.top}
            x2={selectedX}
            y2={height - padding.bottom}
            stroke="rgba(212,175,55,0.6)"
            strokeWidth={2}
          />
          <text
            x={selectedX}
            y={padding.top - 5}
            textAnchor="middle"
            fill="rgba(212,175,55,0.9)"
            fontSize="10"
            fontWeight="bold"
          >
            {chartData[selectedIndex]
              ? formatShortDate(chartData[selectedIndex].date)
              : ""}
          </text>
        </>
      )}

      {/* Lines */}
      {lines.map((line) => (
        <polyline
          key={line.key}
          points={line.points}
          fill="none"
          stroke={line.color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.85}
        />
      ))}

      {/* Selected day dots */}
      {selectedIndex >= 0 &&
        selectedIndex < chartData.length &&
        lines.map((line) => {
          const dayData = chartData[selectedIndex];
          const val = dayData[line.key as keyof ChartDay] as number;
          const cx = selectedX;
          const cy = padding.top + chartH / 2 - (val * chartH) / 2;
          return (
            <circle
              key={`dot-${line.key}`}
              cx={cx}
              cy={cy}
              r={5}
              fill={line.color}
              stroke="white"
              strokeWidth={2}
            />
          );
        })}
    </svg>
  );
}

// Birth date setup form
function BirthDateForm({ onSaved }: { onSaved: () => void }) {
  const [birthDate, setBirthDate] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!birthDate) return;
    setSaving(true);
    try {
      const res = await fetch("/api/biorhythm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate }),
      });
      if (res.ok) {
        onSaved();
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-3 sm:px-4 md:px-0">
      <Card className="glass-card border-mystic-700/30 overflow-hidden">
        <div className="bg-gradient-to-br from-purple-600/20 via-mystic-800/50 to-blue-900/30 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Activity className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="font-display text-2xl text-lunar mb-2">
            Biorythme
          </h1>
          <p className="text-mystic-300 mb-6 text-sm">
            Pour calculer vos biorythmes, nous avons besoin de votre date de naissance.
          </p>

          <div className="space-y-4">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full bg-mystic-900/50 border border-mystic-700/50 rounded-lg px-4 py-3 text-lunar text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <Button
              onClick={handleSave}
              disabled={!birthDate || saving}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Calendar className="w-4 h-4 mr-2" />
              )}
              Calculer mes biorythmes
            </Button>
          </div>

          <p className="text-mystic-500 text-xs mt-4">
            Cette information est privée et ne sera jamais partagée.
          </p>
        </div>
      </Card>
    </div>
  );
}

// Compute cycle info from chart data for a given index (client-side)
function computeCyclesFromChart(chartData: ChartDay[], index: number): BiorhythmCycle[] {
  if (!chartData[index]) return [];
  const day = chartData[index];
  const nextDay = chartData[index + 1] || chartData[index];

  const cycles = [
    { nameEn: "physical", name: "Physique", period: 23, color: "#ef4444", value: day.physical, nextValue: nextDay.physical },
    { nameEn: "emotional", name: "Émotionnel", period: 28, color: "#3b82f6", value: day.emotional, nextValue: nextDay.emotional },
    { nameEn: "intellectual", name: "Intellectuel", period: 33, color: "#22c55e", value: day.intellectual, nextValue: nextDay.intellectual },
  ];

  const descriptions: Record<string, Record<string, string>> = {
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

  return cycles.map((c) => {
    let phase: BiorhythmCycle["phase"];
    if (Math.abs(c.value) < 0.05) phase = "critical";
    else if (c.value > 0.7) phase = "high";
    else if (c.value < -0.7) phase = "low";
    else phase = c.nextValue > c.value ? "rising" : "falling";

    return {
      name: c.name,
      nameEn: c.nameEn,
      period: c.period,
      value: c.value,
      percentage: Math.round(c.value * 100),
      phase,
      color: c.color,
      description: descriptions[c.name]?.[phase] || "",
    };
  });
}

export default function BiorhythmPage() {
  const [data, setData] = useState<BiorhythmData | null>(null);
  const [loading, setLoading] = useState(true);
  // selectedIndex: index into chartData (0..60), center=30 is "today"
  const [selectedIndex, setSelectedIndex] = useState(30);

  const fetchData = async () => {
    setLoading(true);
    try {
      const dateStr = new Date().toISOString().split("T")[0];
      const res = await fetch(`/api/biorhythm?date=${dateStr}`);
      const json = await res.json();
      setData(json);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute current cycles from chart data based on slider
  const currentCycles = useMemo(() => {
    if (!data?.chartData) return data?.cycles || [];
    return computeCyclesFromChart(data.chartData, selectedIndex);
  }, [data, selectedIndex]);

  // Current selected date
  const selectedDate = useMemo(() => {
    if (!data?.chartData?.[selectedIndex]) return new Date();
    return new Date(data.chartData[selectedIndex].date);
  }, [data, selectedIndex]);

  // Days offset from today
  const daysOffset = selectedIndex - 30;

  const isToday = daysOffset === 0;

  const goToToday = () => setSelectedIndex(30);

  if (loading && !data) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-mystic-400" />
      </div>
    );
  }

  if (data?.needsBirthDate) {
    return <BirthDateForm onSaved={() => fetchData()} />;
  }

  if (!data?.chartData) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
        <p className="text-mystic-400">Erreur de chargement</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-0 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-600/30">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl text-lunar">Biorythme</h1>
            <p className="text-xs sm:text-sm text-mystic-400 capitalize">
              {formatDate(selectedDate)}
              {!isToday && (
                <span className="ml-1.5 text-gold/70">
                  ({daysOffset > 0 ? "+" : ""}{daysOffset}j)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Date navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
            disabled={selectedIndex <= 0}
            className="text-mystic-400 hover:text-lunar w-8 h-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant={isToday ? "default" : "outline"}
            size="sm"
            onClick={goToToday}
            className={
              isToday
                ? "bg-purple-600/30 text-purple-300 border-purple-500/30 text-xs"
                : "border-mystic-700/50 text-mystic-300 text-xs"
            }
          >
            Aujourd&apos;hui
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedIndex(Math.min(data.chartData.length - 1, selectedIndex + 1))}
            disabled={selectedIndex >= data.chartData.length - 1}
            className="text-mystic-400 hover:text-lunar w-8 h-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Cycle cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {currentCycles.map((cycle) => (
          <Card
            key={cycle.nameEn}
            className="glass-card border-mystic-700/30 overflow-hidden"
          >
            <CardContent className="p-4">
              {/* Cycle header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span style={{ color: cycle.color }}>
                    {cycleIcons[cycle.name]}
                  </span>
                  <span className="text-sm font-medium text-lunar">
                    {cycle.name}
                  </span>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                  style={{
                    backgroundColor: `${cycle.color}20`,
                    color: cycle.color,
                  }}
                >
                  {phaseIcons[cycle.phase]}
                  {phaseLabels[cycle.phase]}
                </span>
              </div>

              {/* Percentage bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: cycle.color }}
                  >
                    {cycle.percentage > 0 ? "+" : ""}
                    {cycle.percentage}%
                  </span>
                  <span className="text-xs text-mystic-500">
                    cycle de {cycle.period}j
                  </span>
                </div>
                <div className="h-2 rounded-full bg-mystic-800/50 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.abs(cycle.percentage)}%`,
                      backgroundColor: cycle.color,
                      opacity: cycle.percentage >= 0 ? 0.8 : 0.4,
                      marginLeft:
                        cycle.percentage < 0
                          ? `${100 - Math.abs(cycle.percentage)}%`
                          : 0,
                    }}
                  />
                </div>
              </div>

              {/* Description - only for advanced tier */}
              {data?.hasAdvanced ? (
                <p className="text-xs text-mystic-400 leading-relaxed">
                  {cycle.description}
                </p>
              ) : (
                <p className="text-xs text-mystic-600 leading-relaxed italic">
                  <Lock className="w-3 h-3 inline mr-1" />
                  Conseil détaillé réservé aux abonnés
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="glass-card border-mystic-700/30">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="font-display text-base sm:text-lg text-lunar flex items-center gap-2">
            <Minus className="w-4 h-4 text-mystic-400" />
            Courbes sur 60 jours
          </CardTitle>
          {/* Legend */}
          <div className="flex gap-4 mt-2">
            {[
              { label: "Physique", color: "#ef4444" },
              { label: "Émotionnel", color: "#3b82f6" },
              { label: "Intellectuel", color: "#22c55e" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-1 rounded-full"
                  style={{ backgroundColor: l.color }}
                />
                <span className="text-xs text-mystic-400">{l.label}</span>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-4 pb-4 space-y-3">
          {loading ? (
            <div className="h-[200px] flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-mystic-400" />
            </div>
          ) : (
            <BiorhythmChart
              chartData={data.chartData}
              selectedIndex={selectedIndex}
              onIndexChange={setSelectedIndex}
            />
          )}

          {/* Date slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-mystic-500">
              <span>{data.chartData[0] ? formatShortDate(data.chartData[0].date) : ""}</span>
              <div className="flex items-center gap-1 text-mystic-400">
                <GripHorizontal className="w-3 h-3" />
                <span className="text-[10px]">Glissez pour naviguer</span>
              </div>
              <span>{data.chartData[data.chartData.length - 1] ? formatShortDate(data.chartData[data.chartData.length - 1].date) : ""}</span>
            </div>
            <input
              type="range"
              min={0}
              max={data.chartData.length - 1}
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-mystic-800/50
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:shadow-gold/30 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/20
                [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-gold [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white/20
                [&::-moz-range-thumb]:shadow-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Critical days - advanced only */}
      {data?.hasAdvanced ? (
        data.criticalDays.length > 0 && (
          <Card className="glass-card border-mystic-700/30">
            <CardHeader className="px-4 pt-4 pb-2">
              <CardTitle className="font-display text-base sm:text-lg text-lunar flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Jours critiques à venir
              </CardTitle>
              <p className="text-xs text-mystic-500">
                Les jours critiques sont des moments de transition où le cycle passe par zéro.
                Soyez particulièrement vigilant.
              </p>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.criticalDays.slice(0, 10).map((cd, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-mystic-800/30"
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: cd.color }}
                    />
                    <span className="text-xs text-mystic-300 capitalize">
                      {formatShortDate(cd.date)}
                    </span>
                    <span className="text-xs text-mystic-500">-</span>
                    <span className="text-xs" style={{ color: cd.color }}>
                      {cd.cycle}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <Card className="glass-card border-purple-500/20 overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-full bg-purple-500/15 shrink-0">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-lunar mb-1">
                  Biorythme détaillé
                </h3>
                <p className="text-xs text-mystic-400 mb-3">
                  Débloquez les conseils personnalisés, les jours critiques et l&apos;analyse
                  approfondie de vos cycles avec un abonnement Explorateur ou Oracle+.
                </p>
                <Link href="/pricing">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs"
                  >
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    Voir les abonnements
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <div className="text-center pb-6">
        <p className="text-xs text-mystic-600">
          Les biorythmes sont basés sur des cycles sinusoïdaux de 23, 28 et 33
          jours calculés depuis votre naissance. Utilisez-les comme outil de
          réflexion personnelle.
        </p>
      </div>
    </div>
  );
}
