import {
  Activity,
  Footprints,
  Gauge,
  Globe2,
  SmilePlus,
} from "lucide-react";

import type { Athlete } from "@/lib/notion/get-athlete";
import type { WeeklyReview } from "@/lib/notion/get-weekly-review";

import Card from "./card";
import SectionTitle from "./section-title";

type IndicatorsProps = {
  athlete: Athlete;
  weeklyReview: WeeklyReview | null;
  lifetimeDistance: number;
};

function formatNumber(
  value: number | null | undefined,
  maximumFractionDigits = 1
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "—";
  }

  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits,
  }).format(value);
}

function getFormSubtitle(
  formState: string
): string {
  const normalized = formState
    .trim()
    .toLowerCase();

  if (!normalized) {
    return "Dernier bilan hebdomadaire";
  }

  if (
    normalized.includes("fatigu") ||
    normalized.includes("difficile")
  ) {
    return "Récupération à surveiller";
  }

  if (
    normalized.includes("moyen") ||
    normalized.includes("correct")
  ) {
    return "Forme à stabiliser";
  }

  if (
    normalized.includes("bonne") ||
    normalized.includes("très bonne") ||
    normalized.includes("excellente")
  ) {
    return "Bonne dynamique";
  }

  return "Dernier bilan hebdomadaire";
}

export default function Indicators({
  athlete,
  weeklyReview,
  lifetimeDistance,
}: IndicatorsProps) {
  const formState =
    weeklyReview?.formState?.trim() ||
    "Non renseigné";

  const weeklyVolume =
    weeklyReview?.weeklyVolume ?? null;

  const indicators = [
    {
      label: "VMA",
      value: formatNumber(athlete.vma),
      unit: "km/h",
      subtitle: "Vitesse maximale aérobie",
      icon: Gauge,
      color: "#c4b5fd",
      iconBackground:
        "rgba(139, 92, 246, 0.13)",
      glow: "rgba(139, 92, 246, 0.16)",
    },
    {
      label: "État de forme",
      value: formState,
      unit: "",
      subtitle: getFormSubtitle(formState),
      icon: SmilePlus,
      color: "#67e8f9",
      iconBackground:
        "rgba(34, 211, 238, 0.11)",
      glow: "rgba(34, 211, 238, 0.14)",
    },
    {
      label: "Volume hebdo",
      value: formatNumber(
        weeklyVolume,
        1
      ),
      unit: "km",
      subtitle: "Semaine dernière",
      icon: Footprints,
      color: "#6ee7b7",
      iconBackground:
        "rgba(16, 185, 129, 0.11)",
      glow: "rgba(16, 185, 129, 0.14)",
    },
    {
      label: "Distance totale",
     value: formatNumber(
  lifetimeDistance,
  0
),
      unit: "km",
      subtitle: "Kilométrage à vie",
      icon: Globe2,
      color: "#f9a8d4",
      iconBackground:
        "rgba(236, 72, 153, 0.11)",
      glow: "rgba(236, 72, 153, 0.14)",
    },
  ];

  return (
    <Card className="border-white/[0.08] p-5 sm:p-8">
      <SectionTitle
        icon={<Activity className="size-5" />}
      >
        Mes indicateurs
      </SectionTitle>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {indicators.map((indicator) => {
          const Icon = indicator.icon;

          return (
            <article
              key={indicator.label}
              className="group relative min-w-0 overflow-hidden rounded-[24px] border border-white/[0.075] bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.2)] transition duration-300 sm:p-5 lg:hover:-translate-y-1 lg:hover:border-white/[0.14]"
            >
              <div
                className="pointer-events-none absolute -right-9 -top-9 size-28 rounded-full blur-3xl"
                style={{
                  backgroundColor:
                    indicator.glow,
                }}
              />

              <div className="relative">
                <div
                  className="flex size-10 items-center justify-center rounded-2xl border border-white/[0.07]"
                  style={{
                    color: indicator.color,
                    backgroundColor:
                      indicator.iconBackground,
                  }}
                >
                  <Icon className="size-5" />
                </div>

                <p className="mt-5 min-h-8 text-[9px] font-extrabold uppercase leading-4 tracking-[0.14em] text-slate-500 sm:text-[10px]">
                  {indicator.label}
                </p>

<div className="mt-2">
<span className="block text-[28px] font-black leading-none tracking-[-0.045em] text-white sm:text-[30px]">
  {indicator.value}
</span>

  {indicator.unit && (
<span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
  {indicator.unit}
</span>
  )}
</div>

                <p className="mt-3 min-h-8 text-[10px] leading-4 text-slate-500 sm:text-[11px]">
                  {indicator.subtitle}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </Card>
  );
}