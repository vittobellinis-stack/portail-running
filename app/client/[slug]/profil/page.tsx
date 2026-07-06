import BottomNav from "@/components/mobile/BottomNav";
import StatusBar from "@/components/mobile/StatusBar";
import { getClient } from "@/lib/client";
import { CreditCard, Scale, Target, User } from "lucide-react";

export default async function ProfilPage() {
  const client = await getClient();

  if (!client) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        Client introuvable.
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] px-5 pb-32 pt-4 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(139,92,246,.35),transparent_32%),radial-gradient(circle_at_90%_10%,rgba(59,130,246,.20),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(124,58,237,.18),transparent_35%)]" />

      <div className="relative mx-auto max-w-md space-y-5">
        <StatusBar />

        <section className="text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-800 text-4xl font-black shadow-[0_0_50px_rgba(139,92,246,.35)]">
            {client.nom?.[0] ?? "M"}
          </div>

          <h1 className="mt-4 text-4xl font-black">{client.nom}</h1>
          <p className="mt-1 text-slate-400">Membre Premium</p>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="rounded-[26px] border border-white/10 bg-white/[0.06] p-5">
            <Scale className="text-sky-400" />
            <p className="mt-4 text-sm text-slate-400">Poids actuel</p>
            <h2 className="mt-1 text-2xl font-black">{client.poidsActuel} kg</h2>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-white/[0.06] p-5">
            <Target className="text-violet-400" />
            <p className="mt-4 text-sm text-slate-400">Objectif</p>
            <h2 className="mt-1 text-2xl font-black">{client.objectif} kg</h2>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-white/[0.06] p-5">
            <CreditCard className="text-yellow-400" />
            <p className="mt-4 text-sm text-slate-400">À régler</p>
            <h2 className="mt-1 text-2xl font-black">{client.resteARegler} €</h2>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-white/[0.06] p-5">
            <User className="text-emerald-400" />
            <p className="mt-4 text-sm text-slate-400">Statut</p>
            <h2 className="mt-1 text-2xl font-black">Actif</h2>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-white/[0.06] p-5">
          <h2 className="text-xl font-black">Informations</h2>

          <div className="mt-5 space-y-4 text-sm">
            <p className="flex justify-between">
              <span className="text-slate-400">Poids initial</span>
              <span className="font-semibold">{client.poidsInitial} kg</span>
            </p>

            <p className="flex justify-between">
              <span className="text-slate-400">Poids actuel</span>
              <span className="font-semibold">{client.poidsActuel} kg</span>
            </p>

            <p className="flex justify-between">
              <span className="text-slate-400">Prochaine séance</span>
              <span className="font-semibold">{client.prochaineSeance}</span>
            </p>
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}