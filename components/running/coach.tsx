import { MessageCircle } from "lucide-react";

import type { Athlete } from "@/lib/notion/get-athlete";

import Card from "./card";
import SectionTitle from "./section-title";

type CoachProps = {
  athlete: Athlete;
};

export default function Coach({ athlete }: CoachProps) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/15 to-card">
      <SectionTitle
        icon={<MessageCircle className="size-5" />}
      >
        Le mot du coach
      </SectionTitle>

      <p className="leading-7 text-slate-200">
        {athlete.conseilCoach ||
          "Ton coach n’a pas encore ajouté de conseil cette semaine."}
      </p>
    </Card>
  );
}