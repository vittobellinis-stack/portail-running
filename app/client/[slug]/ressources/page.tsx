import StatusBar from "@/components/mobile/StatusBar";
import { getCachedResourcesCount } from "@/lib/resources";
import BottomNav from "@/components/mobile/BottomNav";
import Link from "next/link";
import {
  Apple,
  Brain,
  ChevronRight,
  Dumbbell,
  Footprints,
} from "lucide-react";

const categories = [
  {
    title: "Nutrition",
      key: "nutrition",
    description: "Repas, protéines, glucides, hydratation",
    icon: Apple,
    href: "nutrition",
  bg: "from-emerald-500/25 via-emerald-500/10 to-white/[0.04]",
iconClass: "text-emerald-300 bg-emerald-400/15 border-emerald-300/20",
textClass: "text-emerald-300",
  },
  {
    title: "Sport",
      key: "sport",
    description: "Exercices, technique, mobilité",
    icon: Dumbbell,
    href: "sport",
  bg: "from-amber-500/25 via-orange-500/10 to-white/[0.04]",
iconClass: "text-amber-300 bg-amber-400/15 border-amber-300/20",
textClass: "text-amber-300",
  },
  {
    title: "Science",
      key: "science",
    description: "Comprendre le corps simplement",
    icon: Brain,
    href: "science",
 bg: "from-cyan-900/35 via-sky-900/20 to-white/[0.04]",
iconClass: "text-cyan-300 bg-cyan-500/15 border-cyan-300/20",
textClass: "text-cyan-300",
  },
  {
    title: "Running",
     key: "running",
    description: "Course, endurance, récupération",
    icon: Footprints,
    href: "running",
bg: "from-violet-600/25 via-fuchsia-600/10 to-white/[0.04]",
iconClass: "text-violet-300 bg-violet-500/15 border-violet-300/20",
textClass: "text-violet-300",
  },
];

export default async function RessourcesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
const counts = await getCachedResourcesCount(slug);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] px-5 pb-32 pt-4 text-white">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_95%_0%,rgba(139,92,246,.38),transparent_35%),radial-gradient(circle_at_0%_60%,rgba(59,130,246,.16),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(124,58,237,.14),transparent_38%)]" />
      <div className="relative mx-auto max-w-md space-y-7">
        <StatusBar />

        <section className="pt-4">
          <p className="text-lg font-semibold text-violet-300">Ressources</p>
          <h1 className="mt-3 text-6xl font-black tracking-tight">Fiches</h1>
          <p className="mt-5 text-lg leading-7 text-slate-400">
            Retrouve toutes les fiches de ton accompagnement.
          </p>
        </section>

        <section className="space-y-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.href}
                href={`/client/${slug}/ressources/${category.href}`}
                className={`block overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br ${category.bg} p-5 shadow-[0_25px_80px_rgba(0,0,0,.35)] backdrop-blur-2xl`}
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full border ${category.iconClass}`}
                  >
                    <Icon size={42} strokeWidth={2.2} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-3xl font-black">{category.title}</h2>
                    <p className="mt-2 text-lg leading-6 text-slate-300">
                      {category.description}
                    </p>
        
                    <p className={`mt-3 text-lg font-bold ${category.textClass}`}>
  {counts[category.key] ?? 0} fiche
  {(counts[category.key] ?? 0) > 1 ? "s" : ""} disponible
  {(counts[category.key] ?? 0) > 1 ? "s" : ""}
</p>
                  </div>

                  <ChevronRight className="shrink-0 text-slate-400" size={30} />
                </div>
              </Link>
            );
          })}
        </section>
      </div>

      <BottomNav />
    </main>
  );
}