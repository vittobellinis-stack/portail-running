import {
  CalendarDays,
  Clock3,
  MapPin,
  Medal,
  Route,
  Trophy,
  Zap,
} from "lucide-react";

import type { Race } from "@/lib/notion/get-courses";

import Card from "./card";

type LastRaceProps = {
  race: Race | null;
};

function parseDate(
  value: string
): Date | null {
  if (!value) {
    return null;
  }

  const [datePart] = value.split("T");

  const [year, month, day] =
    datePart
      .split("-")
      .map(Number);

  if (
    !year ||
    !month ||
    !day ||
    [year, month, day].some(
      Number.isNaN
    )
  ) {
    return null;
  }

  const date = new Date(
    year,
    month - 1,
    day
  );

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;
}

function formatDate(
  value: string
): string {
  const date = parseDate(value);

  if (!date) {
    return "Date non renseignée";
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(date);
}

function formatNumber(
  value: number
): string {
  return new Intl.NumberFormat(
    "fr-FR"
  ).format(value);
}

function formatRanking(
  ranking: number | null,
  participants: number | null
): string {
  if (ranking === null) {
    return "—";
  }

  if (participants !== null) {
    return `${formatNumber(
      ranking
    )} / ${formatNumber(
      participants
    )}`;
  }

  return `${formatNumber(ranking)}e`;
}

function getTopPercentageValue(
  ranking: number | null,
  participants: number | null
): number | null {
  if (
    ranking === null ||
    participants === null ||
    participants <= 0 ||
    ranking <= 0
  ) {
    return null;
  }

  return Math.min(
    100,
    (ranking / participants) * 100
  );
}

function formatTopPercentage(
  percentage: number
): string {
  const formatted =
    new Intl.NumberFormat(
      "fr-FR",
      {
        maximumFractionDigits: 1,
      }
    ).format(percentage);

  return `Top ${formatted} %`;
}

function getTopPercentageColor(
  percentage: number
): string {
  if (percentage <= 20) {
    return "#22c55e";
  }

  if (percentage <= 50) {
    return "#38bdf8";
  }

  if (percentage <= 75) {
    return "#facc15";
  }

  return "#fb923c";
}

type RankingRowProps = {
  label: string;
  ranking: number | null;
  participants: number | null;
  iconColor: string;
};

function RankingRow({
  label,
  ranking,
  participants,
  iconColor,
}: RankingRowProps) {
  const topPercentage =
    getTopPercentageValue(
      ranking,
      participants
    );

  const topPercentageLabel =
    topPercentage !== null
      ? formatTopPercentage(
          topPercentage
        )
      : null;

  const topPercentageColor =
    topPercentage !== null
      ? getTopPercentageColor(
          topPercentage
        )
      : "#64748b";

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Medal
          className="size-5 shrink-0"
          style={{
            color: iconColor,
          }}
        />

        <span className="truncate text-sm text-slate-400">
          {label}
        </span>
      </div>

      <div className="flex shrink-0 flex-col items-end">
        <span className="text-lg font-black leading-none text-white">
          {formatRanking(
            ranking,
            participants
          )}
        </span>

        {topPercentageLabel && (
          <span
            className="mt-1 text-[10px] font-black leading-none sm:text-[11px]"
            style={{
              color:
                topPercentageColor,
            }}
          >
            {topPercentageLabel}
          </span>
        )}
      </div>
    </div>
  );
}

export default function LastRace({
  race,
}: LastRaceProps) {
  if (!race) {
    return (
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
            <Trophy className="size-6" />
          </div>

          <h2 className="text-xl font-black tracking-[-0.04em] text-white">
            Dernière course
          </h2>
        </div>

        <div className="py-10 text-center">
          <Trophy className="mx-auto size-8 text-violet-300" />

          <p className="mt-4 font-bold text-white">
            Aucune course réalisée
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Tes résultats apparaîtront ici après ta première course.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-violet-400/15 bg-[radial-gradient(circle_at_90%_10%,rgba(139,92,246,0.12),transparent_30%),linear-gradient(145deg,#141426_0%,#0a0e1b_70%,#070a14_100%)] p-5 sm:p-8">
      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300 shadow-[0_0_24px_rgba(139,92,246,0.12)]">
            <Trophy className="size-6" />
          </div>

          <h2 className="text-xl font-black tracking-[-0.04em] text-white sm:text-2xl">
            Dernière course
          </h2>
        </div>

        <div className="mt-8 flex items-start justify-between gap-4">
          <h3 className="min-w-0 text-[32px] font-black leading-[1.05] tracking-[-0.06em] text-white sm:text-4xl">
            {race.name}
          </h3>

          {race.isPersonalBest && (
            <span
              className="shrink-0 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white"
              style={{
                background:
                  "linear-gradient(90deg, #ef4444 0%, #e54848 100%)",
                boxShadow:
                  "0 0 10px rgba(239,68,68,0.18)",
              }}
            >
              NEW RECORD
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-400">
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

        <div className="mt-8 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock3 className="size-5 shrink-0 text-violet-400" />

              <span className="text-sm text-slate-400">
                Temps
              </span>
            </div>

            <span className="text-lg font-black text-white">
              {race.resultTime || "—"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="size-5 shrink-0 text-fuchsia-400" />

              <span className="text-sm text-slate-400">
                Allure moyenne
              </span>
            </div>

            <span className="text-lg font-black text-white">
              {race.averagePace || "—"}
            </span>
          </div>

          <RankingRow
            label="Classement général"
            ranking={race.ranking}
            participants={
              race.participants
            }
            iconColor="#34d399"
          />

          <RankingRow
            label="Classement sexe"
            ranking={race.sexRanking}
            participants={
              race.sexParticipants
            }
            iconColor="#38bdf8"
          />

          <RankingRow
            label="Classement catégorie"
            ranking={
              race.categoryRanking
            }
            participants={
              race.categoryParticipants
            }
            iconColor="#fbbf24"
          />
        </div>
      </div>
    </Card>
  );
}