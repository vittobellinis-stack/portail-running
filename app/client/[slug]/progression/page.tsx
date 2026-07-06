import StatusBar from "@/components/mobile/StatusBar";
import BottomNav from "@/components/mobile/BottomNav";

export default function ProgressionPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-5 pb-32 pt-4 text-white">
      <div className="mx-auto max-w-md space-y-5">
        <StatusBar />

        <section>
          <p className="text-sm text-slate-400">Suivi complet 📈</p>
          <h1 className="mt-1 text-4xl font-black">Évolutions</h1>
          <p className="mt-2 text-sm text-slate-400">
            Tous tes progrès au même endroit.
          </p>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/[0.07] p-5">
          <h2 className="text-xl font-black">Résumé</h2>
          <p className="mt-2 text-slate-300">Excellent travail 👏</p>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-white/5 p-3">
              <p className="text-xs text-slate-400">Poids</p>
              <p className="font-black text-emerald-300">-2,6 kg</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-3">
              <p className="text-xs text-slate-400">Taille</p>
              <p className="font-black text-emerald-300">-4 cm</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-3">
              <p className="text-xs text-slate-400">M.G.</p>
              <p className="font-black text-emerald-300">-2,4 %</p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/[0.07] p-5">
          <h2 className="text-xl font-black">Poids</h2>
          <p className="mt-4 text-5xl font-black">80,3 kg</p>
          <p className="mt-3 text-emerald-300">-2,6 kg depuis avril</p>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/[0.07] p-5">
          <h2 className="text-xl font-black">Mensurations</h2>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-violet-500/10 p-4">
              <p className="text-xs text-slate-400">Taille</p>
              <p className="text-2xl font-black">82 cm</p>
            </div>

            <div className="rounded-2xl bg-sky-500/10 p-4">
              <p className="text-xs text-slate-400">Hanches</p>
              <p className="text-2xl font-black">101 cm</p>
            </div>
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}