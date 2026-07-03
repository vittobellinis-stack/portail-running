import { CalendarCheck, Scale, Weight } from "lucide-react";

export default function StatsCards({
  client,
}: {
  client: any;
}) {
  const cards = [
    {
      title: "Poids initial",
      value: `${client.poidsInitial} kg`,
      subtitle: "Départ",
      icon: Weight,
      color: "text-emerald-400",
      border: "border-emerald-400/30",
    },
    {
      title: "Dernière pesée",
      value: `${client.poidsActuel} kg`,
      subtitle: client.dernierePesee || "Aucune",
      icon: Scale,
      color: "text-sky-400",
      border: "border-sky-400/30",
    },
    {
      title: "Prochaine séance",
      value: client.prochaineSeance || "-",
      subtitle: "Rendez-vous",
      icon: CalendarCheck,
      color: "text-violet-400",
      border: "border-violet-400/30",
    },
  ];

  return (
    <section className="grid grid-cols-3 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`rounded-[28px] border ${card.border} bg-white/[0.06] p-4 text-center shadow-[0_0_35px_rgba(0,0,0,.25)] backdrop-blur-2xl transition-all duration-300 hover:scale-[1.03]`}
          >
            <div
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-[20px] bg-white/10 ${card.color}`}
            >
              <Icon size={22} />
            </div>

            <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              {card.title}
            </p>

            <h3 className="mt-2 text-lg font-black leading-none text-white">
              {card.value}
            </h3>

            <p className="mt-2 text-[11px] text-slate-500">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </section>
  );
}