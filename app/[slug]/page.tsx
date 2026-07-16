import { notFound } from "next/navigation";

import Dashboard from "@/components/running/dashboard";
import {
  getAthleteBySlug,
} from "@/lib/notion/get-athlete";
import {
  getCoursesByAthleteId,
} from "@/lib/notion/get-courses";
import {
  getWeeklyReviewSummaryByAthleteId,
} from "@/lib/notion/get-weekly-review";

export const dynamic = "force-dynamic";

type AthletePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AthletePage({
  params,
}: AthletePageProps) {
  const { slug } = await params;

  const athlete =
    await getAthleteBySlug(slug);

  if (!athlete) {
    notFound();
  }

  const [
    courses,
    weeklyReview,
  ] = await Promise.all([
    getCoursesByAthleteId(
      athlete.id
    ),
    getWeeklyReviewSummaryByAthleteId(
      athlete.id
    ),
  ]);

  return (
    <Dashboard
      athlete={athlete}
      courses={courses}
      weeklyReview={weeklyReview}
      lifetimeDistance={
        athlete.lifetimeDistance ?? 0
      }
    />
  );
}