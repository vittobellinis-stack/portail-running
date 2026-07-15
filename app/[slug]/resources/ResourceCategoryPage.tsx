import Link from "next/link";

import {
  ChevronLeft,
  FileText,
} from "lucide-react";

import BottomNav from "@/components/running/bottom-nav";

import {
  getClientResources,
} from "@/lib/notion/resources";

type ResourceCategoryPageProps = {
  slug: string;
  category: string;
  title: string;
};

export default async function ResourceCategoryPage({
  slug,
  category,
  title,
}: ResourceCategoryPageProps) {
  const resources =
    await getClientResources(
      slug,
      category
    );

  return (
    <main className="min-h-screen bg-[#050816] pb-40 text-white">
      <div className="mx-auto w-full max-w-md px-5 py-7">
        <Link
          href={`/${slug}/resources`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300"
        >
          <ChevronLeft className="size-4" />

          Retour
        </Link>

        <section className="mt-7">
          <p className="text-base font-bold text-violet-300">
            Fiches
          </p>

          <h1 className="mt-2 text-5xl font-black tracking-[-0.05em]">
            {title}
          </h1>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            Les fiches débloquées pour ton accompagnement.
          </p>
        </section>

        {resources.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="mx-auto size-9 text-violet-300" />

            <p className="mt-4 font-bold text-white">
              Aucune fiche disponible
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Les fiches débloquées apparaîtront ici.
            </p>
          </div>
        ) : (
          <section className="mt-8 grid grid-cols-2 gap-4">
            {resources.map(
              (resource) => {
                const content = (
                  <>
                    <div className="aspect-[4/5] bg-white/[0.04]">
                      {resource.cover ? (
                        <img
                          src={
                            resource.cover
                          }
                          alt={
                            resource.title
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <FileText className="size-9 text-violet-300" />
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <h2 className="line-clamp-2 text-sm font-bold text-white">
                        {resource.title}
                      </h2>

                      {resource.number !==
                        null && (
                        <p className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-violet-300">
                          Fiche n°
                          {resource.number}
                        </p>
                      )}

                      {!resource.pdf && (
                        <p className="mt-2 text-[10px] text-slate-500">
                          PDF non disponible
                        </p>
                      )}
                    </div>
                  </>
                );

                if (!resource.pdf) {
                  return (
                    <article
                      key={
                        resource.id
                      }
                      className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.03]"
                    >
                      {content}
                    </article>
                  );
                }

                return (
                  <a
                    key={resource.id}
                    href={resource.pdf}
                    target="_blank"
                    rel="noreferrer"
                    className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.03] transition hover:border-white/[0.16]"
                  >
                    {content}
                  </a>
                );
              }
            )}
          </section>
        )}
      </div>

      <BottomNav slug={slug} />
    </main>
  );
}