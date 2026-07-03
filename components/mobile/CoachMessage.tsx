export default function CoachMessage({
  client,
}: {
  client: any;
}) {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_70px_rgba(0,0,0,.5)] backdrop-blur-2xl">
      <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-700 text-xl font-black">
            V
          </div>

          <div>
            <h2 className="text-lg font-black">Ton coach</h2>
            <p className="text-sm text-slate-400">
              Dernière mise à jour
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] bg-slate-900/60 p-5 leading-7 text-slate-200">
          {client.messageCoach ? (
            <p className="whitespace-pre-wrap">
              {client.messageCoach}
            </p>
          ) : (
            <p className="text-slate-500">
              Aucun message du coach.
            </p>
          )}
        </div>

        <button className="mt-5 w-full rounded-2xl bg-violet-600 py-4 font-semibold transition hover:bg-violet-500">
          Contacter le coach
        </button>
      </div>
    </section>
  );
}