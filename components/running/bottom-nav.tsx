"use client";

import Link from "next/link";
import { BookOpen, House } from "lucide-react";
import { usePathname } from "next/navigation";

type BottomNavProps = {
  slug: string;
};

export default function BottomNav({
  slug,
}: BottomNavProps) {
  const pathname = usePathname();

  const homePath = `/${slug}`;
  const resourcesPath = `/${slug}/resources`;

  const isResourcesActive =
    pathname === resourcesPath ||
    pathname.startsWith(`${resourcesPath}/`);

  const isHomeActive = !isResourcesActive;

  return (
    <nav
      className="fixed z-50 rounded-[28px] border border-white/[0.10] bg-[#080b17]/95 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.48)] backdrop-blur-xl"
      style={{
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100vw - 32px)",
        maxWidth: "448px",
        bottom:
          "max(16px, env(safe-area-inset-bottom))",
      }}
      aria-label="Navigation principale"
    >
      <div className="grid grid-cols-2 gap-2">
        <Link
          href={homePath}
          className={[
            "flex min-w-0 items-center justify-center gap-2 rounded-[22px] px-4 py-4 text-sm font-extrabold transition-colors",
            isHomeActive
              ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-[0_12px_30px_rgba(168,85,247,0.28)]"
              : "text-slate-400 hover:bg-white/[0.04] hover:text-white",
          ].join(" ")}
          aria-current={
            isHomeActive ? "page" : undefined
          }
        >
          <House className="size-5 shrink-0" />

          <span className="truncate">
            Accueil
          </span>
        </Link>

        <Link
          href={resourcesPath}
          className={[
            "flex min-w-0 items-center justify-center gap-2 rounded-[22px] px-4 py-4 text-sm font-extrabold transition-colors",
            isResourcesActive
              ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-[0_12px_30px_rgba(168,85,247,0.28)]"
              : "text-slate-400 hover:bg-white/[0.04] hover:text-white",
          ].join(" ")}
          aria-current={
            isResourcesActive ? "page" : undefined
          }
        >
          <BookOpen className="size-5 shrink-0" />

          <span className="truncate">
            Ressources
          </span>
        </Link>
      </div>
    </nav>
  );
}