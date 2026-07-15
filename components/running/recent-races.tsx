import { Flag, MapPin } from "lucide-react";

import type { Race } from "@/lib/notion/get-courses";

import Card from "./card";
import SectionTitle from "./section-title";

type RecentRacesProps = {
  courses: Race[];
};

function parseDate(value: string): Date | null {
  if (!value) {
    return null;
  }

  const [datePart] = value.split("T");
  const [year, month, day] = datePart
    .split("-")
    .map(Number);

  if (
    !year ||
    !month ||
    !day ||
    [year, month, day].some(Number.isNaN)
  ) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function normalizeStatus(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getLastFiveCompletedRaces(
  courses: Race[]
): Race[] {
  return courses
    .filter((race) => {
      const status = normalizeStatus(
        race.status ?? ""
      );

      return (
        status === "terminee" ||
        status === "termine"
      );
    })
    .filter(
      (race) => parseDate(race.date) !== null
    )
    .sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);

      return (
        (dateB?.getTime() ?? 0) -
        (dateA?.getTime() ?? 0)
      );
    })
    .slice(0, 5);
}

export default function RecentRaces({
  courses,
}: RecentRacesProps) {
  const recentRaces =
    getLastFiveCompletedRaces(courses);

  return (
    <Card className="border-white/[0.08] p-5 sm:p-8">
      <SectionTitle
        icon={<Flag className="size-5" />}
      >
        Dernières courses
      </SectionTitle>

      {recentRaces.length === 0 ? (
        <div className="py-10 text-center">
          <Flag className="mx-auto size-8 text-violet-300" />

          <p className="mt-4 font-bold text-white">
            Aucune course terminée
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Tes cinq dernières courses apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.08]">
          {recentRaces.map((race) => (
            <div
              key={race.id}
              className="py-4 first:pt-0 last:pb-0"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(0, 1fr) 74px 62px 42px",
                alignItems: "center",
                columnGap: "6px",
                width: "100%",
              }}
            >
              {/* Nom de la course + distance */}
              <div
                className="min-w-0"
                style={{
                  overflow: "hidden",
                }}
              >
                <p className="truncate text-[11px] font-bold leading-5 text-white">
                  {race.name}
                </p>

                {race.distance && (
                  <p className="mt-0.5 truncate text-[9px] text-slate-500">
                    {race.distance}
                  </p>
                )}
              </div>

              {/* Lieu */}
              <div
                className="min-w-0"
                style={{
                  overflow: "hidden",
                }}
              >
                <div className="flex min-w-0 items-center gap-1">
                  <MapPin className="size-3 shrink-0 text-emerald-300" />

                  <span className="truncate text-[9px] text-slate-400">
                    {race.location || "—"}
                  </span>
                </div>
              </div>

              {/* Temps */}
              <p className="whitespace-nowrap text-right text-[11px] font-black text-white">
                {race.resultTime || "—"}
              </p>

              {/* RP */}
              <div
                style={{
                  width: "42px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {race.isPersonalBest ? (
                  <span
                    className="flex h-6 min-w-[38px] items-center justify-center rounded-full px-2 text-[8px] font-black uppercase tracking-[0.08em] text-white"
                    style={{
                      backgroundColor: "#ef4444",
                    }}
                  >
                    RP
                  </span>
                ) : (
                  <span
                    style={{
                      display: "block",
                      width: "38px",
                      height: "24px",
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}