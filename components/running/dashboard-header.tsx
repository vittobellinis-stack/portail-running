import { HeartHandshake } from "lucide-react";

import type { Athlete } from "@/lib/notion/get-athlete";

type DashboardHeaderProps = {
  athlete: Athlete;
};

function getFirstName(name: string): string {
  const firstName = name.trim().split(/\s+/)[0];

  return firstName || "Athlète";
}

export default function DashboardHeader({
  athlete,
}: DashboardHeaderProps) {
  const firstName = getFirstName(athlete.name);

  return (
    <header className="relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#0c1120] px-5 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:px-7 sm:py-8">
      {/* Légères touches de couleur */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(124,58,237,0.20),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(14,165,233,0.08),transparent_34%)]" />

      <div className="relative">
        {/* Petit trait décoratif supérieur */}
        <div className="h-px w-16 bg-gradient-to-r from-violet-400/90 to-transparent" />

        <div className="mt-6 flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/25 bg-violet-500/15 text-violet-300">
            <HeartHandshake className="size-6" />
          </div>

          <h1 className="min-w-0 text-[28px] font-black leading-none tracking-[-0.055em] text-white sm:text-[36px]">
            Bonjour{" "}
            <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              {firstName}
            </span>
          </h1>
        </div>

        <p className="mt-5 text-[15px] font-bold text-slate-200 sm:text-base">
          Ton espace de coaching personnalisé
        </p>

        <p className="mt-3 max-w-xl text-[13px] leading-6 text-slate-400 sm:text-sm">
Le progrès se construit kilomètre après kilomètre.
          Continue à avancer, un pas après l’autre.
        </p>

        {/* Petit trait décoratif inférieur */}
        <div className="mt-7 h-px w-24 bg-gradient-to-r from-violet-500/70 to-transparent" />
      </div>
    </header>
  );
}