export default function LastPhoto({
  client,
}: {
  client: any;
}) {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_70px_rgba(0,0,0,.5)] backdrop-blur-2xl">
      <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black">
            📷 Dernière photo
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Évolution physique
          </p>
        </div>

        <div className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-bold text-slate-300">
          Dernier bilan
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[26px] bg-slate-900">
        {client.photo ? (
          <img
            src={client.photo}
            alt="Photo de progression"
            className="h-72 w-full object-cover transition duration-700 hover:scale-105"
          />
        ) : (
          <div className="flex h-72 items-center justify-center text-slate-500">
            Aucune photo disponible
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="font-bold text-lg">
            {client.nom}
          </p>

          <p className="text-sm text-slate-400">
            Photo de progression
          </p>
        </div>

        <button className="rounded-2xl bg-violet-600 px-5 py-3 font-semibold transition hover:bg-violet-500">
          Agrandir
        </button>
      </div>
    </section>
  );
}