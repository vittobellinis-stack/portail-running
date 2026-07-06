"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home } from "lucide-react";

function getBasePath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);

  if (parts[0] === "client" && parts[1]) {
    return `/client/${parts[1]}`;
  }

  return "/client/medea-desclos";
}

export default function BottomNav() {
  const pathname = usePathname();
  const basePath = getBasePath(pathname);

  const items = [
    {
      label: "Accueil",
      href: basePath,
      icon: Home,
    },
    {
      label: "Ressources",
      href: `${basePath}/ressources`,
      icon: BookOpen,
    },
  ];

  return (
    <nav className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-40px)] max-w-md -translate-x-1/2 rounded-full border border-white/10 bg-slate-950/85 p-2 shadow-[0_20px_60px_rgba(0,0,0,.6)] backdrop-blur-2xl">
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            item.label === "Accueil"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
          <Link
  href={item.href}
  prefetch={true}
  className={`flex items-center justify-center gap-2 rounded-full py-4 transition-all ${
    active
      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
      : "text-slate-400"
  }`}
>
              <Icon size={22} />
              <span className="text-sm font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}