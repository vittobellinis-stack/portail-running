export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold">👋 Bonjour Médéa</h1>
          <p className="text-slate-500">
            Bienvenue dans ton espace de coaching.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Poids actuel</p>
          <h2 className="mt-2 text-5xl font-bold">83 kg</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="text-sm text-slate-500">Objectif</p>
            <p className="mt-2 text-2xl font-bold">72 kg</p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="text-sm text-slate-500">Perte</p>
            <p className="mt-2 text-2xl font-bold text-green-600">
              -3 kg
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="mb-3 font-semibold">Progression</p>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-2/3 rounded-full bg-green-500"></div>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            68 % de ton objectif atteint 💪
          </p>
        </div>
      </div>
    </main>
  );
}