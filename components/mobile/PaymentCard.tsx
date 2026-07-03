import { Calendar, CreditCard } from "lucide-react";

export default function PaymentCard({
  client,
}: {
  client: any;
}) {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-violet-700 via-indigo-900 to-[#090b1a] p-5 shadow-[0_20px_70px_rgba(0,0,0,.5)]">

      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

      <div className="relative">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <CreditCard size={22} />
          </div>

          <div>

            <h2 className="text-xl font-black">
              Paiement
            </h2>

            <p className="text-sm text-slate-300">
              Coaching Premium
            </p>

          </div>

        </div>

        <div className="mt-8">

          <p className="text-sm text-slate-300">
            Reste à régler
          </p>

          <h1 className="mt-2 text-5xl font-black">
            {client.resteARegler} €
          </h1>

        </div>

        <div className="mt-8 flex items-center justify-between">

          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Calendar size={16} />
            Prochaine échéance
          </div>

          <span className="font-semibold">
            À définir
          </span>

        </div>

        <button className="mt-8 w-full rounded-2xl bg-white/10 py-4 font-bold backdrop-blur-xl transition hover:bg-white/20">
          Voir le détail
        </button>

      </div>

    </section>
  );
}