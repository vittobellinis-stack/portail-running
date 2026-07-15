import { notFound } from "next/navigation";

import Dashboard from "@/components/running/dashboard";
import { getAthleteBySlug } from "@/lib/notion/get-athlete";
import { getCoursesByAthleteId } from "@/lib/notion/get-courses";
import { getWeeklyReviewSummaryByAthleteId } from "@/lib/notion/get-weekly-review";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({
  params,
}: PageProps) {
  const { slug } = await params;

  const athlete = await getAthleteBySlug(slug);

  if (!athlete) {
    notFound();
  }

  const [courses, weeklyReviewSummary] =
    await Promise.all([
      getCoursesByAthleteId(athlete.id),

      getWeeklyReviewSummaryByAthleteId(
        athlete.id
      ),
    ]);

  return (
    <Dashboard
      athlete={athlete}
      courses={courses}
      weeklyReview={
        weeklyReviewSummary.latestReview
      }
      lifetimeDistance={
        weeklyReviewSummary.lifetimeDistance
      }
    />
  );
}