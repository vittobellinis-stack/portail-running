import { CheckCircle2 } from "lucide-react";

const goals = [
  { title: "Atteindre 79 kg", progress: 75 },
  { title: "3 séances / semaine", progress: 100 },
  { title: "10 000 pas / jour", progress: 60 },
  { title: "Boire 2L d'eau", progress: 85 },
];

export default function GoalsCard() {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_70px_rgba(0,0,0,.5)] backdrop-blur-2xl">
      <h2 className="text-xl font-black">🎯 Objectifs du mois</h2>
      <p className="mt-1 text-sm text-slate-400">Continue sur cette lancée</p>

      <div className="mt-6 space-y-5">
        {goals.map((goal) => (
          <div key={goal.title}>
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 size={18} className="text-violet-400" />
                {goal.title}
              </span>
              <span className="text-sm text-slate-400">{goal.progress}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}