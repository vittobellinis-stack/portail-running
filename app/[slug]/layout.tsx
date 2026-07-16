import type { ReactNode } from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
    cookieStore.get("client-auth")?.value;

  if (
    !authenticatedSlug ||
    authenticatedSlug !== slug
  ) {
    redirect("/login");
  }

  return children;
}