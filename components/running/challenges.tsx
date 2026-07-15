import {
  Apple,
  Ban,
  CircleGauge,
  ClipboardCheck,
  Dumbbell,
  Flame,
  Footprints,
  MoonStar,
  Repeat2,
  Scale,
  Soup,
  Target,
  Trophy,
} from "lucide-react";

import type {
  ClientChallenge,
} from "@/lib/notion/get-challenges";

import Card from "./card";

type ChallengesProps = {
  challenges: ClientChallenge[];
};

type ChallengeStyle = {
  background: string;
  iconBackground: string;
  iconColor: string;
  pointsBackground: string;
  borderColor: string;
};

function normalizeValue(
  value: string
): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getChallengeStyle(
  category: string
): ChallengeStyle {
  const normalized =
    normalizeValue(category);

  // Interdit → rouge
  if (
    normalized.includes("interdit")
  ) {
    return {
      background:
        "linear-gradient(135deg, rgba(190,24,93,0.40), rgba(110,18,56,0.58))",
      iconBackground:
        "rgba(251,113,133,0.16)",
      iconColor: "#fda4af",
      pointsBackground:
        "rgba(255,255,255,0.09)",
      borderColor:
        "rgba(251,113,133,0.16)",
    };
  }

  // Nutrition → vert
  if (
    normalized.includes("nutrition")
  ) {
    return {
      background:
        "linear-gradient(135deg, rgba(16,185,129,0.34), rgba(5,91,78,0.48))",
      iconBackground:
        "rgba(110,231,183,0.17)",
      iconColor: "#6ee7b7",
      pointsBackground:
        "rgba(255,255,255,0.10)",
      borderColor:
        "rgba(110,231,183,0.16)",
    };
  }

  // Sport → jaune
  if (
    normalized.includes("sport")
  ) {
    return {
      background:
        "linear-gradient(135deg, rgba(234,179,8,0.32), rgba(120,53,15,0.54))",
      iconBackground:
        "rgba(250,204,21,0.16)",
      iconColor: "#fde047",
      pointsBackground:
        "rgba(255,255,255,0.09)",
      borderColor:
        "rgba(250,204,21,0.16)",
    };
  }

  // Habitudes → jaune
  if (
    normalized.includes("habitude")
  ) {
    return {
      background:
        "linear-gradient(135deg, rgba(202,138,4,0.30), rgba(113,63,18,0.52))",
      iconBackground:
        "rgba(253,224,71,0.15)",
      iconColor: "#fef08a",
      pointsBackground:
        "rgba(255,255,255,0.09)",
      borderColor:
        "rgba(253,224,71,0.15)",
    };
  }

  // Bilans → blanc / gris
  if (
    normalized.includes("bilan")
  ) {
    return {
      background:
        "linear-gradient(135deg, rgba(148,163,184,0.28), rgba(71,85,105,0.54))",
      iconBackground:
        "rgba(255,255,255,0.13)",
      iconColor: "#ffffff",
      pointsBackground:
        "rgba(255,255,255,0.10)",
      borderColor:
        "rgba(255,255,255,0.14)",
    };
  }

  // Défaut → violet
  return {
    background:
      "linear-gradient(135deg, rgba(124,58,237,0.30), rgba(76,29,149,0.55))",
    iconBackground:
      "rgba(167,139,250,0.15)",
    iconColor: "#c4b5fd",
    pointsBackground:
      "rgba(255,255,255,0.09)",
    borderColor:
      "rgba(167,139,250,0.15)",
  };
}

function getChallengeIcon(
  iconName: string,
  category: string
) {
  const normalizedIcon =
    normalizeValue(iconName);

  const normalizedCategory =
    normalizeValue(category);

  if (
    normalizedIcon.includes("soupe") ||
    normalizedIcon.includes("repas") ||
    normalizedIcon.includes("calorie")
  ) {
    return Soup;
  }

  if (
    normalizedIcon.includes("fast") ||
    normalizedIcon.includes("interdit") ||
    normalizedIcon.includes("ban") ||
    normalizedCategory.includes("interdit")
  ) {
    return Ban;
  }

  if (
    normalizedIcon.includes("poids") ||
    normalizedIcon.includes("balance") ||
    normalizedIcon.includes("scale")
  ) {
    return Scale;
  }

  if (
    normalizedIcon.includes("pomme") ||
    normalizedIcon.includes("nutrition") ||
    normalizedCategory.includes("nutrition")
  ) {
    return Apple;
  }

  if (
    normalizedIcon.includes("sport") ||
    normalizedIcon.includes("musculation") ||
    normalizedCategory.includes("sport")
  ) {
    return Dumbbell;
  }

  if (
    normalizedIcon.includes("running") ||
    normalizedIcon.includes("course")
  ) {
    return Footprints;
  }

  if (
    normalizedIcon.includes("sommeil") ||
    normalizedIcon.includes("recovery")
  ) {
    return MoonStar;
  }

  if (
    normalizedIcon.includes("feu") ||
    normalizedIcon.includes("flame")
  ) {
    return Flame;
  }

  if (
    normalizedIcon.includes("trophee")
  ) {
    return Trophy;
  }

  if (
    normalizedIcon.includes("gauge") ||
    normalizedIcon.includes("progress")
  ) {
    return CircleGauge;
  }

  if (
    normalizedCategory.includes("bilan")
  ) {
    return ClipboardCheck;
  }

  if (
    normalizedCategory.includes("habitude")
  ) {
    return Repeat2;
  }

  return Target;
}

function ChallengeRow({
  challenge,
}: {
  challenge: ClientChallenge;
}) {
  const style =
    getChallengeStyle(
      challenge.category
    );

  const Icon =
    getChallengeIcon(
      challenge.icon,
      challenge.category
    );

  return (
    <article
      className="grid grid-cols-[64px_minmax(0,1fr)_60px] items-center gap-4 rounded-[24px] border p-4 sm:grid-cols-[68px_minmax(0,1fr)_64px]"
      style={{
        background: style.background,
        borderColor: style.borderColor,
      }}
    >
      <div
        className="flex size-16 items-center justify-center rounded-[18px]"
        style={{
          backgroundColor:
            style.iconBackground,
          color: style.iconColor,
        }}
      >
        <Icon className="size-8" />
      </div>

      <div className="min-w-0">
        <h3 className="truncate text-base font-black tracking-[-0.03em] text-white sm:text-lg">
          {challenge.title}
        </h3>

        {challenge.description && (
          <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-300 sm:text-xs">
            {challenge.description}
          </p>
        )}

        {challenge.category && (
          <p
            className="mt-2 text-[9px] font-black uppercase tracking-[0.14em]"
            style={{
              color: style.iconColor,
            }}
          >
            {challenge.category}
          </p>
        )}
      </div>

      <div
        className="flex min-h-[62px] flex-col items-center justify-center rounded-[17px] border border-white/[0.10]"
        style={{
          backgroundColor:
            style.pointsBackground,
        }}
      >
        <span className="text-xl font-black leading-none text-white">
          +{challenge.points}
        </span>

        <span className="mt-1 text-[9px] font-medium text-slate-300">
          pts
        </span>
      </div>
    </article>
  );
}

export default function Challenges({
  challenges,
}: ChallengesProps) {
  const weeklyChallenges =
    challenges.filter(
      (challenge) =>
        challenge.period === "week"
    );

  const monthlyChallenges =
    challenges.filter(
      (challenge) =>
        challenge.period === "month"
    );

  if (challenges.length === 0) {
    return null;
  }

  return (
    <Card className="border-violet-400/15 bg-[radial-gradient(circle_at_100%_100%,rgba(124,58,237,0.12),transparent_40%),linear-gradient(145deg,#161827,#171522)] p-5 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-xl text-violet-300">
          <Target className="size-5" />
        </div>

        <h2 className="text-xl font-black tracking-[-0.04em] text-white">
          Challenges
        </h2>
      </div>

      {weeklyChallenges.length > 0 && (
        <section className="mt-7">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-violet-300">
            Objectifs de la semaine
          </p>

          <div className="mt-4 space-y-3">
            {weeklyChallenges.map(
              (challenge) => (
                <ChallengeRow
                  key={challenge.id}
                  challenge={challenge}
                />
              )
            )}
          </div>
        </section>
      )}

      {monthlyChallenges.length > 0 && (
        <section className="mt-8">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-violet-300">
            Objectif du mois
          </p>

          <div className="mt-4 space-y-3">
            {monthlyChallenges.map(
              (challenge) => (
                <ChallengeRow
                  key={challenge.id}
                  challenge={challenge}
                />
              )
            )}
          </div>
        </section>
      )}
    </Card>
  );
}