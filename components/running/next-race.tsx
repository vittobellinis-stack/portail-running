import {
  CalendarDays,
  Clock3,
  Flag,
  MapPin,
  Route,
  Target,
} from "lucide-react";

import type { Race } from "@/lib/notion/get-courses";

import Card from "./card";
import SectionTitle from "./section-title";

type NextRaceProps = {
  race: Race | null;
};

const DAY_MS = 86_400_000;

function parseDate(value: string): Date | null {
  if (!value) {
    return null;
  }

  const [datePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);

  if (
    !year ||
    !month ||
    !day ||
    [year, month, day].some(Number.isNaN)
  ) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function todayAtMidnight(): Date {
  const today = new Date();

  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
}

function formatDate(value: string): string {
  const date = parseDate(value);

  if (!date) {
    return "Date non renseignée";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getDaysRemaining(
  raceDateValue: string
): number {
  const raceDate = parseDate(raceDateValue);

  if (!raceDate) {
    return 0;
  }

  return Math.max(
    0,
    Math.ceil(
      (raceDate.getTime() -
        todayAtMidnight().getTime()) /
        DAY_MS
    )
  );
}

function getPreparationProgress(
  preparationStartValue: string,
  raceDateValue: string
): number {
  const startDate = parseDate(
    preparationStartValue
  );

  const raceDate = parseDate(
    raceDateValue
  );

  const today = todayAtMidnight();

  if (!startDate || !raceDate) {
    return 0;
  }

  const totalDuration =
    raceDate.getTime() - startDate.getTime();

  if (totalDuration <= 0) {
    return 0;
  }

  if (today <= startDate) {
    return 0;
  }

  if (today >= raceDate) {
    return 100;
  }

  const elapsedDuration =
    today.getTime() - startDate.getTime();

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (elapsedDuration / totalDuration) *
          100
      )
    )
  );
}

function ProgressBar({
  progress,
}: {
  progress: number;
}) {
  const safeProgress = Math.min(
    100,
    Math.max(0, progress)
  );

  return (
    <div className="mt-8">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-300">
            Avancement de la préparation
          </p>

          <p className="mt-1 text-xs text-slate-500">
En route vers l'objectif...          </p>
        </div>

        <span className="shrink-0 text-4xl font-black tracking-[-0.06em] text-violet-300">
          {safeProgress}%
        </span>
      </div>

      <div
        className="mt-5 h-3 overflow-hidden rounded-full bg-white/10"
        style={{
          WebkitMaskImage:
            "-webkit-radial-gradient(white, black)",
          maskImage:
            "radial-gradient(white, black)",
        }}
      >
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${safeProgress}%`,
            minWidth:
              safeProgress > 0 ? "8px" : "0px",
            backgroundColor: "#8b5cf6",
            backgroundImage:
              "linear-gradient(90deg, #22d3ee 0%, #6366f1 55%, #d946ef 100%)",
            boxShadow:
              "0 0 18px rgba(139,92,246,0.35)",
            WebkitTransform:
              "translateZ(0)",
            transform:
              "translateZ(0)",
          }}
        />
      </div>

      <div className="mt-3 flex justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
          Début
        </span>

        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
          Jour J
        </span>
      </div>
    </div>
  );
}

export default function NextRace({
  race,
}: NextRaceProps) {
  if (!race) {
    return (
      <Card>
       <div className="flex items-center gap-4">
  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
    <Flag className="size-6" />
  </div>

  <h2 className="text-xl font-black tracking-[-0.04em] text-white">
    Prochaine course
  </h2>
</div>

        <div className="py-10 text-center">
          <Flag className="mx-auto size-8 text-violet-300" />

          <p className="mt-4 font-bold text-white">
            Aucune course programmée
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Ta prochaine course apparaîtra ici.
          </p>
        </div>
      </Card>
    );
  }

  const daysRemaining =
    getDaysRemaining(race.date);

  const progress =
    getPreparationProgress(
      race.preparationStartDate,
      race.date
    );

  return (
    <Card className="border-violet-400/20 bg-[radial-gradient(circle_at_85%_5%,rgba(124,58,237,0.16),transparent_30%),linear-gradient(145deg,#12152a_0%,#080d1b_70%,#050814_100%)] p-5 sm:p-8">
      <SectionTitle
        icon={<Target className="size-5" />}
      >
        Prochaine course
      </SectionTitle>

      <h2 className="text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
        {race.name}
      </h2>

     <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
  <span className="flex items-center gap-2">
    <CalendarDays className="size-4 text-violet-300" />
    {formatDate(race.date)}
  </span>

  {race.distance && (
    <span className="flex items-center gap-2">
      <Route className="size-4 text-cyan-300" />
      {race.distance}
    </span>
  )}

  {race.location && (
    <span className="flex items-center gap-2">
      <MapPin className="size-4 text-emerald-300" />
      {race.location}
    </span>
  )}
</div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Target className="size-4 shrink-0 text-violet-400" />

            <span className="text-sm text-slate-400">
              Objectif
            </span>
          </div>

          <span className="shrink-0 text-base font-black text-white">
            {race.targetTime || "À définir"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Clock3 className="size-4 shrink-0 text-cyan-400" />

            <span className="text-sm text-slate-400">
              Départ dans
            </span>
          </div>

          <span className="shrink-0 text-base font-black text-white">
            J-{daysRemaining}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <CalendarDays className="size-4 shrink-0 text-emerald-400" />

            <span className="text-sm text-slate-400">
              Début préparation
            </span>
          </div>

          <span className="max-w-[48%] text-right text-sm font-bold leading-5 text-white">
            {race.preparationStartDate
              ? formatDate(
                  race.preparationStartDate
                )
              : "Non renseignée"}
          </span>
        </div>
      </div>

      <ProgressBar progress={progress} />
    </Card>
  );
}