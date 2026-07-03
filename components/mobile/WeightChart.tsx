"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function WeightChart({
  bilans,
}: {
  bilans: any[];
}) {
  const data =
    bilans?.length > 0
      ? bilans.map((bilan) => ({
          date: new Date(bilan.date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
          }),
          poids: bilan.poids,
        }))
      : [
          { date: "18/05", poids: 83 },
          { date: "01/06", poids: 82 },
          { date: "15/06", poids: 81 },
          { date: "27/06", poids: 80 },
        ];

  const first = data[0]?.poids ?? 0;
  const last = data[data.length - 1]?.poids ?? 0;
  const perte = first - last;

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_70px_rgba(0,0,0,.5)] backdrop-blur-2xl">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-black">📈 Évolution du poids</h2>
          <p className="mt-1 text-sm text-slate-400">
            Données issues de tes bilans
          </p>
        </div>

        <div className="rounded-2xl border border-violet-400/20 bg-violet-500/20 px-4 py-2 text-sm font-black text-violet-300">
          -{perte.toFixed(1)} kg
        </div>
      </div>

      <div className="relative h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="poidsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.55} />
                <stop offset="60%" stopColor="#8b5cf6" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#1e293b" strokeDasharray="5 5" />
            <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: "14px",
                color: "white",
              }}
            />

            <Area
              type="monotone"
              dataKey="poids"
              stroke="#a855f7"
              strokeWidth={4}
              fill="url(#poidsGradient)"
              dot={{ r: 6, fill: "#a855f7", stroke: "white", strokeWidth: 3 }}
              activeDot={{ r: 8, fill: "#a855f7", stroke: "white", strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}