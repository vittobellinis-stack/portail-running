"use client";

import Card from "@/components/ui/Card";
import ChartTooltip from "@/components/ui/ChartTooltip";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Ruler } from "lucide-react";

const measurementsData = [
  { date: "Avr", taille: 86, hanches: 105 },
  { date: "Mai", taille: 84, hanches: 103 },
  { date: "Juin", taille: 82, hanches: 101 },
];

export default function MeasurementsCard() {
  return (
    <Card>
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
          <Ruler size={22} />
        </div>

        <div>
          <h2 className="text-lg font-black">Mensurations</h2>
          <p className="text-sm text-slate-400">Taille & hanches</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-violet-400/10 bg-violet-500/10 p-4">
          <p className="text-xs text-slate-400">Taille</p>
          <p className="mt-1 text-2xl font-black">82 cm</p>
        </div>

        <div className="rounded-2xl border border-sky-400/10 bg-sky-500/10 p-4">
          <p className="text-xs text-slate-400">Hanches</p>
          <p className="mt-1 text-2xl font-black">101 cm</p>
        </div>
      </div>

      <div className="mt-5 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={measurementsData}
            margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="rgba(148,163,184,.12)"
              strokeDasharray="6 6"
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />

            <Tooltip
              content={<ChartTooltip />}
              cursor={{
                stroke: "rgba(168,85,247,.25)",
                strokeWidth: 2,
              }}
            />

            <Line
              type="monotone"
              dataKey="taille"
              name="Taille"
              stroke="#a855f7"
              strokeWidth={5}
              dot={{
                r: 6,
                fill: "#050816",
                stroke: "#a855f7",
                strokeWidth: 4,
              }}
              activeDot={{
                r: 8,
                fill: "#a855f7",
                stroke: "white",
                strokeWidth: 3,
              }}
            />

            <Line
              type="monotone"
              dataKey="hanches"
              name="Hanches"
              stroke="#38bdf8"
              strokeWidth={5}
              dot={{
                r: 6,
                fill: "#050816",
                stroke: "#38bdf8",
                strokeWidth: 4,
              }}
              activeDot={{
                r: 8,
                fill: "#38bdf8",
                stroke: "white",
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center gap-5 text-sm">
        <div className="flex items-center gap-2 text-violet-300">
          <span className="h-3 w-3 rounded-full bg-violet-500" />
          Taille
        </div>

        <div className="flex items-center gap-2 text-sky-300">
          <span className="h-3 w-3 rounded-full bg-sky-400" />
          Hanches
        </div>
      </div>
    </Card>
  );
}