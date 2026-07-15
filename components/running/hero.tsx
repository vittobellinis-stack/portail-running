import { Footprints } from "lucide-react";

import type { Athlete } from "@/lib/notion/get-athlete";

import Card from "./card";

type HeroProps = {
  athlete: Athlete;
};

export default function Hero({ athlete }: HeroProps) {
  const firstName =
    athlete.name.trim().split(" ")[0] || athlete.name;

  return (
    <Card className="min-h-[220px] p-6 sm:p-8">
      <div className="pointer-events-none absolute right-0 top-0 h-full w-2/3 bg-[radial-gradient(circle_at_75%_45%,rgba(139,92,246,0.2),transparent_58%)]" />

      <div className="pointer-events-none absolute bottom-0 right-10 h-24 w-64 bg-[linear-gradient(90deg,transparent,rgba(139,92,246,0.12),transparent)] blur-2xl" />

      <div className="relative z-10 flex min-h-[155px] items-center">
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-[20px] border border-violet-400/25 bg-gradient-to-br from-violet-500/25 to-fuchsia-500/10 text-violet-200 shadow-[0_16px_38px_rgba(124,58,237,0.2)]">
            <Footprints className="size-7" />
          </div>

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-violet-300">
              Coaching running
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-[-0.065em] text-white sm:text-5xl">
              Bonjour{" "}
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-400 bg-clip-text text-transparent">
                {firstName}
              </span>
            </h1>

            <p className="mt-3 text-base font-semibold text-slate-300">
              Ton espace personnel de performance
            </p>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
              Retrouve tes objectifs, tes zones, tes records et les
              informations essentielles définies par ton coach.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}