import StatusBar from "@/components/mobile/StatusBar";
import BottomNav from "@/components/mobile/BottomNav";
import { getCachedClientResources } from "@/lib/resources";
import { ChevronLeft, FileText } from "lucide-react";
import Link from "next/link";

const categoryLabels: any = {
  nutrition: "Nutrition",
  sport: "Sport",
  science: "Science",
  running: "Running",
};

export default async function ResourceCategoryPage({
  params,
  category,
}: {
  params: Promise<{ slug: string }>;
  category: string;
}) {
  const { slug } = await params;
const fiches = await getCachedClientResources(slug, category);
  const title = categoryLabels[category] ?? category;

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] px-5 pb-32 pt-4 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_95%_0%,rgba(139,92,246,.38),transparent_35%),radial-gradient(circle_at_0%_60%,rgba(59,130,246,.16),transparent_30%)]" />

      <div className="relative mx-auto max-w-md space-y-6">
        <StatusBar />

      <Link
  href={`/client/${slug}/ressources/${category}`}
  prefetch={true}
  className={`block overflow-hidden rounded-[30px] ...`}
>
          <ChevronLeft size={18} />
          Retour
        </Link>

        <section>
          <p className="text-sm font-semibold text-violet-300">Fiches</p>
          <h1 className="mt-2 text-4xl font-black">{title}</h1>
          <p className="mt-2 text-sm text-slate-400">
            Les fiches débloquées pour ton accompagnement.
          </p>
        </section>

        {fiches.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.07] p-5 text-sm text-slate-400">
            Aucune fiche disponible pour le moment.
          </div>
        ) : (
          <section className="grid grid-cols-3 gap-3">
            {fiches.map((fiche: any) => (
              <a
                key={fiche.id}
                href={fiche.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="overflow-hidden rounded-[18px] border border-white/10 bg-white/5">
                  <div className="aspect-[3/4] overflow-hidden bg-white/5">
                    {fiche.cover ? (
                      <img
                        src={fiche.cover}
                        alt={fiche.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-600 to-fuchsia-600">
                        <FileText size={30} className="text-white/90" />
                      </div>
                    )}
                  </div>

                  <div className="p-2">
                    <p className="line-clamp-2 text-xs font-bold leading-4 text-white">
                      {fiche.title}
                    </p>

                    <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-violet-300">
                      Fiche n°
                      {fiche.number
                        ? String(fiche.number).padStart(2, "0")
                        : "—"}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </section>
        )}
      </div>

      <BottomNav />
    </main>
  );
}