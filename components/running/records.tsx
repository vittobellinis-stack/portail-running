import {
  CalendarDays,
  MapPin,
  Medal,
} from "lucide-react";

import type { Race } from "@/lib/notion/get-courses";

import Card from "./card";
import SectionTitle from "./section-title";

type RecordsProps = {
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

  const date = new Date(
    year,
    month - 1,
    day
  );

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function formatRecordDate(
  value: string
): string {
  const date = parseDate(value);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      month: "short",
      year: "numeric",
    }
  )
    .format(date)
    .replace(".", "");
}

function normalizeDistance(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(",", ".");
}

function getLatestPersonalRecords(
  courses: Race[]
): Race[] {
  const personalBestCourses = courses
    .filter(
      (course) =>
        course.isPersonalBest &&
        Boolean(course.distance) &&
        Boolean(course.resultTime)
    )
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );

  const recordsByDistance =
    new Map<string, Race>();

  for (const course of personalBestCourses) {
    const distanceKey = normalizeDistance(
      course.distance
    );

    if (
      !recordsByDistance.has(
        distanceKey
      )
    ) {
      recordsByDistance.set(
        distanceKey,
        course
      );
    }
  }

  return Array.from(
    recordsByDistance.values()
  );
}

export default function Records({
  courses,
}: RecordsProps) {
  const records =
    getLatestPersonalRecords(courses);

  return (
    <Card className="border-white/[0.08] p-5 sm:p-8">
      <SectionTitle
        icon={<Medal className="size-5" />}
      >
        Mes records personnels
      </SectionTitle>

      {records.length === 0 ? (
        <div className="py-10 text-center">
          <Medal className="mx-auto size-8 text-violet-300" />

          <p className="mt-4 font-bold text-white">
            Aucun record renseigné
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Tous tes records personnels apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {records.map((record) => (
            <article
              key={record.id}
              className="relative overflow-hidden rounded-[22px] border border-white/[0.08] bg-white/[0.03] p-4 sm:p-5"
            >
              <p className="text-sm font-bold text-white">
                {record.distance}
              </p>

              <p className="mt-2 text-[28px] font-black leading-none tracking-[-0.05em] text-white sm:text-[32px]">
                {record.resultTime}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-slate-500">
                {record.date && (
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <CalendarDays className="size-3.5 shrink-0 text-violet-300" />

                    {formatRecordDate(
                      record.date
                    )}
                  </span>
                )}

                {record.name && (
                  <span className="flex min-w-0 items-center gap-1.5">
                    <Medal className="size-3.5 shrink-0 text-amber-300" />

                    <span className="truncate">
                      {record.name}
                    </span>
                  </span>
                )}

                {record.location && (
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <MapPin className="size-3.5 shrink-0 text-emerald-300" />

                    {record.location}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </Card>
  );
}