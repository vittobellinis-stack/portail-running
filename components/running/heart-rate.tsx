import { HeartPulse } from "lucide-react";

import type { Athlete } from "@/lib/notion/get-athlete";

import Card from "./card";
import SectionTitle from "./section-title";

type HeartRateProps = {
  athlete: Athlete;
};

type Zone = {
  name: string;
  description: string;
  value: string;
  color: string;
  progress: number;
};

function cleanZoneValue(value: string): string {
  if (!value || value === "Non renseigné") {
    return "Non renseigné";
  }

  return value
    .replace(/^[🟦🟩🟨🟧🟥]\s*/u, "")
    .trim();
}

export default function HeartRate({
  athlete,
}: HeartRateProps) {
  const zones: Zone[] = [
    {
      name: "Zone 1",
      description: "Récupération",
      value: cleanZoneValue(athlete.zone1),
      color: "#3b82f6",
      progress: 50,
    },
    {
      name: "Zone 2",
      description: "Endurance fondamentale",
      value: cleanZoneValue(athlete.zone2),
      color: "#22c55e",
      progress: 65,
    },
    {
      name: "Zone 3",
      description: "Tempo",
      value: cleanZoneValue(athlete.zone3),
      color: "#eab308",
      progress: 75,
    },
    {
      name: "Zone 4",
      description: "Seuil",
      value: cleanZoneValue(athlete.zone4),
      color: "#f97316",
      progress: 85,
    },
    {
      name: "Zone 5",
      description: "VO₂max / Anaérobie",
      value: cleanZoneValue(athlete.zone5),
      color: "#ef4444",
      progress: 100,
    },
  ];

  return (
    <Card className="border-white/[0.08] p-5 sm:p-8">
      <SectionTitle
        icon={<HeartPulse className="size-5" />}
      >
        Mes zones cardiaques
      </SectionTitle>

      <div className="divide-y divide-white/[0.08]">
        {zones.map((zone) => (
          <div
            key={zone.name}
            className="py-4 first:pt-0 last:pb-0"
          >
            <div className="flex items-start gap-3">
              <span
                className="mt-1.5 size-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: zone.color,
                }}
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white">
                  {zone.name}
                </p>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  {zone.description}
                </p>
              </div>

              <p className="shrink-0 text-right text-sm font-bold text-slate-200">
                {zone.value}
              </p>
            </div>

            <div
              className="mt-3 overflow-hidden rounded-full"
              style={{
                width: "100%",
                height: "6px",
                minHeight: "6px",
                backgroundColor:
                  "rgba(255,255,255,0.08)",
                WebkitTransform: "translateZ(0)",
                transform: "translateZ(0)",
              }}
            >
              <div
                className="rounded-full"
                style={{
                  width: `${zone.progress}%`,
                  height: "100%",
                  minHeight: "6px",
                  backgroundColor: zone.color,
                  WebkitTransform: "translateZ(0)",
                  transform: "translateZ(0)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}