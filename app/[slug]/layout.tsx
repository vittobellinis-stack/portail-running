import type { ReactNode } from "react";

import { cookies } from "next/headers";

type SlugLayoutProps = {
  children: ReactNode;
  params: Promise<{
    slug: string;
  }>;
};

export default async function SlugLayout({
  children,
  params,
}: SlugLayoutProps) {
  const { slug } = await params;

  const cookieStore = await cookies();

  const authenticatedSlug =
    cookieStore.get("client-auth")?.value ?? "";

  console.log("[AUTH] Slug URL :", slug);
  console.log("[AUTH] Cookie :", authenticatedSlug);

  if (authenticatedSlug !== slug) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        <h1 className="text-2xl font-bold">
          Diagnostic connexion
        </h1>

        <p className="mt-5">
          Slug de l’URL :
          <strong className="ml-2 text-violet-300">
            {slug || "VIDE"}
          </strong>
        </p>

        <p className="mt-3">
          Cookie reçu :
          <strong className="ml-2 text-rose-300">
            {authenticatedSlug || "AUCUN COOKIE"}
          </strong>
        </p>
      </main>
    );
  }

  return children;
}