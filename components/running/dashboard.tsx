import type { Athlete } from "@/lib/notion/get-athlete";
import type { Race } from "@/lib/notion/get-courses";
import type {
  WeeklyReviewSummary,
} from "@/lib/notion/get-weekly-review";

import {
  getChallengesByAthleteSlug,
} from "@/lib/notion/get-challenges";

import BottomNav from "./bottom-nav";
import Challenges from "./challenges";
import DashboardHeader from "./dashboard-header";
import HeartRate from "./heart-rate";
import Indicators from "./indicators";
import LastRace from "./last-race";
import NextRace from "./next-race";
import Paces from "./paces";
import RecentRaces from "./recent-races";
import Records from "./records";

type DashboardProps = {
  athlete: Athlete;
  courses: Race[];
 weeklyReview: WeeklyReviewSummary | null;
  lifetimeDistance: number;
};

function parseDate(
  value: string
): Date | null {
  if (!value) {
    return null;
  }

  const [datePart] =
    value.split("T");

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

function normalizeStatus(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );
}

export default async function Dashboard({
  athlete,
  courses,
  weeklyReview,
  lifetimeDistance,
}: DashboardProps) {
  const challenges =
    await getChallengesByAthleteSlug(
      athlete.slug
    );

  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  const upcomingCourses = courses
    .filter((race) => {
      const raceDate =
        parseDate(race.date);

      if (!raceDate) {
        return false;
      }

      raceDate.setHours(
        0,
        0,
        0,
        0
      );

      const status =
        normalizeStatus(
          race.status ?? ""
        );

      const isCompleted =
        status === "terminee" ||
        status === "termine";

      return (
        raceDate >= today &&
        !isCompleted
      );
    })
    .sort((a, b) => {
      const dateA =
        parseDate(a.date);

      const dateB =
        parseDate(b.date);

      return (
        (dateA?.getTime() ?? 0) -
        (dateB?.getTime() ?? 0)
      );
    });

  const completedCourses = courses
    .filter((race) => {
      const raceDate =
        parseDate(race.date);

      if (!raceDate) {
        return false;
      }

      raceDate.setHours(
        0,
        0,
        0,
        0
      );

      const status =
        normalizeStatus(
          race.status ?? ""
        );

      return (
        status === "terminee" ||
        status === "termine" ||
        raceDate < today
      );
    })
    .sort((a, b) => {
      const dateA =
        parseDate(a.date);

      const dateB =
        parseDate(b.date);

      return (
        (dateB?.getTime() ?? 0) -
        (dateA?.getTime() ?? 0)
      );
    });

  const nextRace =
    upcomingCourses[0] ?? null;

  const lastRace =
    completedCourses[0] ?? null;

  return (
    <main className="min-h-screen bg-transparent pb-40 text-foreground">
      <div className="mx-auto w-full max-w-[1080px] space-y-5 px-4 py-5 sm:px-6 lg:space-y-6 lg:py-8">
        <DashboardHeader
          athlete={athlete}
        />

        <div className="grid gap-5 lg:grid-cols-[1.03fr_0.97fr]">
          <NextRace
            race={nextRace}
          />

          <LastRace
            race={lastRace}
          />
        </div>

        <RecentRaces
          courses={courses}
        />

        <Indicators
          athlete={athlete}
          weeklyReview={
            weeklyReview
          }
          lifetimeDistance={
            lifetimeDistance
          }
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <HeartRate
            athlete={athlete}
          />

          <Paces
            athlete={athlete}
          />
        </div>

        <Records
          courses={courses}
        />
           <Challenges
          challenges={challenges}
        />
      </div>
      

      <BottomNav
        slug={athlete.slug}
      />
    </main>
  );
}