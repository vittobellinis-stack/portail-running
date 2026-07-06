import StatusBar from "@/components/mobile/StatusBar";
import BottomNav from "@/components/mobile/BottomNav";
import { Camera, Image, Sparkles } from "lucide-react";

const photos = [
  { date: "Avril 2025", label: "Départ", type: "Face" },
  { date: "Mai 2025", label: "Bilan 1", type: "Face" },
  { date: "Juin 2025", label: "Bilan 2", type: "Face" },
];

function Card({ children, className = "" }: any) {
  return (
    <section
      className={`relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.07] p-5 shadow-[0_25px_80px_rgba(0,0,0,.45)] backdrop-blur-2xl ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      <div className="relative">{children}</div>
    </section>
  );
}

export default function PhotosPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] px-5 pb-32 pt-4 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(168,85,247,.38),transparent_35%),radial-gradient(circle_at_95%_15%,rgba(59,130,246,.24),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(236,72,153,.18),transparent_38%)]" />

      <div className="relative mx-auto max-w-md space-y-5">
        <StatusBar />

        <section>
          <p className="text-sm text-slate-400">Suivi visuel 📷</p>
          <h1 className="mt-1 text-4xl font-black">Photos</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Visualise ton évolution mois après mois.
          </p>
        </section>

        <Card className="border-violet-400/20 bg-gradient-to-br from-violet-700/80 via-indigo-900/80 to-[#080b1a]">
          <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-violet-400/30 blur-3xl" />

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Sparkles size={22} />
            </div>

            <div>
              <h2 className="font-black">Avant / Après</h2>
              <p className="text-sm text-slate-300">Comparaison rapide</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="flex h-64 items-center justify-center rounded-[26px] bg-slate-950/60 text-slate-500">
              Avant
            </div>

            <div className="flex h-64 items-center justify-center rounded-[26px] bg-slate-950/60 text-slate-500">
              Après
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <Camera className="text-pink-400" size={20} />
            <h2 className="font-black">Historique photo</h2>
          </div>

          <div className="mt-5 space-y-4">
            {photos.map((photo) => (
              <div
                key={photo.date}
                className="flex items-center gap-4 rounded-[24px] bg-slate-950/60 p-4"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 text-slate-500">
                  <Image size={24} />
                </div>

                <div className="flex-1">
                  <p className="font-black">{photo.date}</p>
                  <p className="mt-1 text-sm text-slate-400">{photo.label}</p>
                </div>

                <span className="rounded-full bg-violet-600/20 px-3 py-1 text-xs font-bold text-violet-300">
                  {photo.type}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <button className="w-full rounded-[24px] bg-violet-600 py-4 font-black shadow-lg shadow-violet-600/25">
          + Ajouter une photo
        </button>
      </div>

      <BottomNav />
    </main>
  );
}