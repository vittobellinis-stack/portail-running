import BottomNav from "@/components/mobile/BottomNav";
import StatusBar from "@/components/mobile/StatusBar";
import WeightChart from "@/components/mobile/WeightChart";
import MeasurementsChart from "@/components/mobile/MeasurementsChart";
import { getClient } from "@/lib/client";

export default async function ProgressionPage() {
  const client = await getClient();

  if (!client) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        Client introuvable.
      </main>
    );
  }

  const perte = client.poidsInitial - client.poidsActuel;

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] px-5 pb-32 pt-4 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(139,92,246,0.35),transparent_32%),radial-gradient(circle_at_90%_10%,rgba(59,130,246,0.20),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(124,58,237,0.18),transparent_35%)]" />

      <div className="relative mx-auto max-w-md space-y-5">
        <StatusBar />

        <section>
          <p className="text-sm text-slate-400">Suivi de progression</p>
          <h1 className="mt-1 text-4xl font-black tracking-tight">
            Tes résultats
          </h1>
        </section>

        <section className="rounded-[30px] border border-violet-500/20 bg-gradient-to-br from-violet-700 via-indigo-900 to-[#090b1a] p-6 shadow-[0_25px_90px_rgba(124,58,237,.35)]">
          <p className="text-sm text-violet-200">Depuis le début</p>

          <h1 className="mt-2 text-6xl font-black">
            -{perte.toFixed(1)} kg
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            {client.poidsInitial} kg → {client.poidsActuel} kg
          </p>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
              style={{ width: "32%" }}
            />
          </div>
        </section>

        <WeightChart bilans={client.bilans} />
        <MeasurementsChart bilans={client.bilans} />
      </div>

      <BottomNav />
    </main>
  );
}