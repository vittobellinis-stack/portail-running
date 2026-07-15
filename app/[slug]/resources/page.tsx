import Link from "next/link";

import {
  Apple,
  Brain,
  Dumbbell,
  Footprints,
  Gem,
  MoonStar,
} from "lucide-react";

import BottomNav from "@/components/running/bottom-nav";

import {
  getResourcesCount,
} from "@/lib/notion/resources";

const categories = [
  {
    title: "Nutrition",
    key: "nutrition",
    icon: Apple,
    href: "nutrition",
    bg: "from-emerald-500/25 via-emerald-500/10 to-white/[0.04]",
    iconClass:
      "border-emerald-300/20 bg-emerald-400/15 text-emerald-300",
    textClass: "text-emerald-300",
  },
  {
    title: "Sport",
    key: "sport",
    icon: Dumbbell,
    href: "sport",
    bg: "from-amber-500/25 via-orange-500/10 to-white/[0.04]",
    iconClass:
      "border-amber-300/20 bg-amber-400/15 text-amber-300",
    textClass: "text-amber-300",
  },
  {
    title: "Science",
    key: "science",
    icon: Brain,
    href: "science",
    bg: "from-cyan-900/35 via-sky-900/20 to-white/[0.04]",
    iconClass:
      "border-cyan-300/20 bg-cyan-500/15 text-cyan-300",
    textClass: "text-cyan-300",
  },
  {
    title: "Running",
    key: "running",
    icon: Footprints,
    href: "running",
    bg: "from-violet-600/25 via-fuchsia-600/10 to-white/[0.04]",
    iconClass:
      "border-violet-300/20 bg-violet-500/15 text-violet-300",
    textClass: "text-violet-300",
  },
  {
    title: "Recovery",
    key: "recovery",
    icon: MoonStar,
    href: "recovery",
    bg: "from-lime-500/25 via-emerald-500/15 to-yellow-500/10",
    iconClass:
      "border-lime-300/20 bg-lime-400/15 text-lime-300",
    textClass: "text-lime-300",
  },
  {
    title: "Mindset",
    key: "mindset",
    icon: Gem,
    href: "mindset",
    bg: "from-red-500/25 via-rose-500/15 to-pink-500/10",
    iconClass:
      "border-red-300/20 bg-red-400/15 text-red-300",
    textClass: "text-red-300",
  },
] as const;

type ResourcesPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ResourcesPage({
  params,
}: ResourcesPageProps) {
  const { slug } = await params;

  const counts =
    await getResourcesCount(slug);

  return (
    <main className="relative min-h-screen bg-[#050816] px-5 pb-36 pt-6 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_95%_0%,rgba(139,92,246,.38),transparent_35%),radial-gradient(circle_at_0%_60%,rgba(59,130,246,.16),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(124,58,237,.14),transparent_38%)]" />

      <div className="relative mx-auto max-w-md space-y-7">
        <section className="pt-4">
          <p className="text-lg font-semibold text-violet-300">
            Ressources
          </p>

          <h1 className="mt-3 text-6xl font-black tracking-tight">
            Fiches
          </h1>

          <p className="mt-5 text-lg leading-7 text-slate-400">
            Retrouve toutes les fiches de ton accompagnement.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-4">
          {categories.map(
            (category) => {
              const Icon =
                category.icon;

              const count =
                counts[
                  category.key
                ];

              return (
                <Link
                  key={category.key}
                  href={`/${slug}/resources/${category.href}`}
                  className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${category.bg} p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20`}
                >
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border ${category.iconClass}`}
                  >
                    <Icon size={30} />
                  </div>

                  <h2 className="mt-4 text-center text-xl font-black">
                    {category.title}
                  </h2>

                  <p
                    className={`mt-2 text-center text-sm font-bold ${category.textClass}`}
                  >
                    {count}{" "}
                    {count === 1
                      ? "fiche"
                      : "fiches"}
                  </p>
                </Link>
              );
            }
          )}
        </section>
      </div>

      <BottomNav slug={slug} />
    </main>
  );
}