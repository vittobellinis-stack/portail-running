export default function Header() {
  return (
    <header className="mb-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400">Heureux de te revoir 👋</p>
        <h1 className="mt-1 text-4xl font-black tracking-tight">
          Bonjour Médéa
        </h1>
      </div>

      <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl backdrop-blur-xl">
        🔔
      </button>
    </header>
  );
}