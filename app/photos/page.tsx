import BottomNav from "@/components/mobile/BottomNav";
import StatusBar from "@/components/mobile/StatusBar";
import { getClient } from "@/lib/client";

export default async function PhotosPage() {
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
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(139,92,246,0.35),transparent_32%),radial-gradient(circle_at_90%_10%,rgba(59,130,246,0.20),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(124,58,237,0.18),transparent_35%)]" />

      <div className="relative mx-auto max-w-md space-y-5">
        <StatusBar />

        <section>
          <p className="text-sm text-slate-400">Transformation physique</p>
          <h1 className="mt-1 text-4xl font-black tracking-tight">
            Mes photos
          </h1>
        </section>

        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_70px_rgba(0,0,0,.5)] backdrop-blur-2xl">
          <h2 className="text-xl font-black">📷 Dernière photo</h2>
          <p className="mt-1 text-sm text-slate-400">
            Suivi visuel de ton évolution
          </p>

          <div className="mt-5 overflow-hidden rounded-[26px] bg-slate-900">
            {client.photo ? (
              <img
                src={client.photo}
                alt="Photo de progression"
                className="h-96 w-full object-cover"
              />
            ) : (
              <div className="flex h-96 items-center justify-center text-slate-500">
                Aucune photo disponible
              </div>
            )}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="rounded-[26px] border border-white/10 bg-white/[0.06] p-4 text-center backdrop-blur-2xl">
            <div className="flex h-48 items-center justify-center rounded-2xl bg-slate-900 text-slate-500">
              Avant
            </div>
            <p className="mt-3 text-sm text-slate-400">Photo de départ</p>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-white/[0.06] p-4 text-center backdrop-blur-2xl">
            <div className="flex h-48 items-center justify-center rounded-2xl bg-slate-900 text-slate-500">
              Après
            </div>
            <p className="mt-3 text-sm text-slate-400">Dernier bilan</p>
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}