"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BarChart3,
  Camera,
  MessageCircle,
  User,
} from "lucide-react";

const items = [
  {
    href: "/",
    label: "Accueil",
    icon: Home,
  },
  {
    href: "/progression",
    label: "Suivi",
    icon: BarChart3,
  },
  {
    href: "/photos",
    label: "Photos",
    icon: Camera,
  },
  {
    href: "/messages",
    label: "Messages",
    icon: MessageCircle,
  },
  {
    href: "/profil",
    label: "Profil",
    icon: User,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-5 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-[32px] border border-white/10 bg-slate-950/80 p-2 shadow-[0_20px_70px_rgba(0,0,0,.65)] backdrop-blur-3xl">
      <div className="flex justify-between">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex w-16 flex-col items-center gap-1 rounded-2xl py-2 transition-all duration-300 ${
                active
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/40"
                  : "text-slate-500 hover:bg-white/5"
              }`}
            >
              <Icon size={22} />
              <span className="text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}