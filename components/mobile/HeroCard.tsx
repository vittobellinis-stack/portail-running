export default function HeroCard({ client }: { client: any }) {
  const perte = client.poidsInitial - client.poidsActuel;
  const objectifPerte = client.poidsInitial - client.objectif;
  const progress =
    objectifPerte > 0 ? Math.round((perte / objectifPerte) * 100) : 0;

  return (
    <section className="relative overflow-hidden rounded-[34px] border border-violet-300/20 bg-gradient-to-br from-violet-700 via-indigo-900 to-[#090b1a] p-6 shadow-[0_25px_90px_rgba(124,58,237,.35)]">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-400/30 blur-3xl" />

      <div className="relative flex items-center gap-6">
        <div
          className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(#22c55e ${progress}%, rgba(255,255,255,.12) 0)`,
          }}
        >
          <div className="flex h-[92px] w-[92px] flex-col items-center justify-center rounded-full bg-[#050816]">
            <span className="text-3xl font-black">{progress}%</span>
            <span className="text-xs text-slate-400">objectif</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-violet-200/80">
            Depuis le début
          </p>

          <h1 className="mt-1 text-5xl font-black tracking-tight">
            -{perte.toFixed(1)} kg
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Objectif :{" "}
            <span className="font-bold text-violet-300">
              {client.objectif} kg
            </span>
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold">
            <span className="h-3 w-3 rounded-full bg-violet-400" />
            Continue 💜
          </div>
        </div>
      </div>
    </section>
  );
}