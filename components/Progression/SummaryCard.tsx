import Card from "@/components/ui/Card";
import { TrendingDown } from "lucide-react";

export default function SummaryCard() {
  return (
    <Card className="border-emerald-400/20 bg-emerald-500/5">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-300">
            Résumé des progrès
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Excellent travail 👏
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            Continue sur cette lancée, les résultats sont très encourageants.
          </p>
        </div>

        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl" />

          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/15">
            <TrendingDown className="text-emerald-300" size={24} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white/5 p-4 text-center">
          <p className="text-xs text-slate-400">Poids</p>
          <p className="mt-1 text-xl font-black text-emerald-300">
            -2,6 kg
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 p-4 text-center">
          <p className="text-xs text-slate-400">Taille</p>
          <p className="mt-1 text-xl font-black text-emerald-300">
            -4 cm
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 p-4 text-center">
          <p className="text-xs text-slate-400">M.G.</p>
          <p className="mt-1 text-xl font-black text-emerald-300">
            -2,4 %
          </p>
        </div>
      </div>
    </Card>
  );
}