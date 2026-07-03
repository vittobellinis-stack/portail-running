"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function MeasurementsChart({
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
          taille: bilan.taille,
          hanche: bilan.hanche,
        }))
      : [
          { date: "18/05", taille: 98, hanche: 108 },
          { date: "01/06", taille: 96, hanche: 106 },
          { date: "15/06", taille: 94, hanche: 104 },
          { date: "27/06", taille: 92, hanche: 102 },
        ];

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_70px_rgba(0,0,0,.5)] backdrop-blur-2xl">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-pink-500/10 blur-3xl" />

      <h2 className="text-xl font-black">📏 Tour de taille & Hanches</h2>
      <p className="mt-1 text-sm text-slate-400">
        Données issues de tes bilans
      </p>

      <div className="mt-4 flex gap-5 text-sm">
        <div className="flex items-center gap-2 text-violet-300">
          <span className="h-3 w-3 rounded-full bg-violet-500" />
          Taille
        </div>

        <div className="flex items-center gap-2 text-pink-300">
          <span className="h-3 w-3 rounded-full bg-pink-500" />
          Hanches
        </div>
      </div>

      <div className="relative mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
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

            <Line
              type="monotone"
              dataKey="taille"
              stroke="#a855f7"
              strokeWidth={4}
              dot={{ r: 6, fill: "#a855f7", stroke: "white", strokeWidth: 3 }}
            />

            <Line
              type="monotone"
              dataKey="hanche"
              stroke="#fb7185"
              strokeWidth={4}
              dot={{ r: 6, fill: "#fb7185", stroke: "white", strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}