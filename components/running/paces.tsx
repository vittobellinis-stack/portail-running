import {
  Gauge,
  TimerReset,
} from "lucide-react";

import type { Athlete } from "@/lib/notion/get-athlete";

import Card from "./card";
import SectionTitle from "./section-title";

type PacesProps = {
  athlete: Athlete;
};

type PaceItem = {
  label: string;
  value: string;
  color: string;
};

function cleanPaceValue(
  value: string
): string {
  const cleaned = value?.trim();

  return cleaned || "Non renseigné";
}

export default function Paces({
  athlete,
}: PacesProps) {
  const paces: PaceItem[] = [
    {
      label: "Recovery",
      value: cleanPaceValue(
        athlete.recovery
      ),
      color: "#87ffbd",
    },
    {
      label: "Endurance fondamentale",
      value: cleanPaceValue(
        athlete.enduranceFondamentale
      ),
      color: "#22c55e",
    },
    {
      label: "Steady",
      value: cleanPaceValue(
        athlete.steady
      ),
      color: "#efff08",
    },
    {
      label: "Pace Marathon",
      value: cleanPaceValue(
        athlete.paceMarathon
      ),
      color: "#1fcbff",
    },
    {
      label: "Pace Semi",
      value: cleanPaceValue(
        athlete.paceSemi
      ),
      color: "#7522fa",
    },
    {
      label: "Seuil",
      value: cleanPaceValue(
        athlete.seuil
      ),
      color: "#ff7b00",
    },
    {
      label: "Pace 10 km",
      value: cleanPaceValue(
        athlete.pace10km
      ),
      color: "#ec4899",
    },
    {
      label: "Interval",
      value: cleanPaceValue(
        athlete.interval
      ),
      color: "#ef4444",
    },
    {
      label: "Répétition",
      value: cleanPaceValue(
        athlete.repetition
      ),
      color: "#dc2626",
    },
  ];

  return (
    <Card className="border-white/[0.08] p-5 sm:p-8">
      <SectionTitle
        icon={
          <TimerReset className="size-5" />
        }
      >
        Mes allures
      </SectionTitle>

      <div className="divide-y divide-white/[0.08]">
        {paces.map((pace) => (
          <div
            key={pace.label}
            className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
          >
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{
                backgroundColor: pace.color,
              }}
            />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">
                {pace.label}
              </p>
            </div>

            <p className="shrink-0 text-right text-sm font-bold text-slate-200">
              {pace.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 border-t border-white/[0.08] pt-4 text-[11px] text-slate-500">
        <Gauge className="size-4 shrink-0 text-violet-300" />

        <span>
          Allures calculées à partir de ton profil actuel.
        </span>
      </div>
    </Card>
  );
}