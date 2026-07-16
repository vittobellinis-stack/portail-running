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

  console.log("[AUTH] Slug demandé :", slug);
  console.log("[AUTH] Cookie reçu :", authenticatedSlug);

  return (
    <>
      <div className="fixed left-2 top-2 z-[9999] rounded bg-black px-2 py-1 text-xs text-white">
        URL : {slug} — Cookie : {authenticatedSlug || "absent"}
      </div>

      {children}
    </>
  );
}