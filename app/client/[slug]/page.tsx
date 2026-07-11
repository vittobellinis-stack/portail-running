import StatusBar from "@/components/mobile/StatusBar";
import BottomNav from "@/components/mobile/BottomNav";
import { getCachedClient } from "@/lib/client";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HeartHandshake } from "lucide-react";
import {
  CalendarDays,
  ClipboardList,
  Target,
  Utensils,
  Scale,
  Crosshair,
  TrendingDown,
  Footprints,
  Dumbbell,
  Apple,
  Droplets,
  Moon,
    Trophy,
  Flame,
  Timer,
  HeartPulse,
  Bike,
  WineOff,
  CookingPot,
  GlassWater,
  NotebookPen,
  SportShoe,
  Fish,
  Ban,
  Salad,
    Camera,
    ListFilter,
    Ruler,
    ArrowBigDownDash,
} from "lucide-react";

const challengeIcons = {
  footprints: Footprints,
  dumbbell: Dumbbell,
  apple: Apple,
  droplets: Droplets,
  moon: Moon,
  trophy: Trophy,
  flame: Flame,
  timer: Timer,
  heart: HeartPulse,
  bike: Bike,
  wineoff: WineOff,
  "cooking-pot": CookingPot,
  "glass-water": GlassWater,
  "notebook-pen": NotebookPen,
  "sport-shoe": SportShoe,
    fish: Fish,
    ban: Ban,
    salad: Salad,
    camera: Camera,
    "list-filter": ListFilter,
    ruler: Ruler,
    "arrow-big-down-dash": ArrowBigDownDash,
};
const colorByCategory: Record<string, string> = {
  Sport: "from-yellow-500/30 to-amber-700/20",
  Nutrition: "from-emerald-500/30 to-green-700/20",
  "Mode de vie": "from-sky-500/30 to-blue-700/20",
  Bilan: "from-slate-300/20 to-white/10",
  Interdit: "from-red-500/30 to-rose-700/20",
  Habitudes: "from-violet-500/30 to-fuchsia-700/20",
};


function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.07] p-5 shadow-[0_25px_80px_rgba(0,0,0,.45)] backdrop-blur-2xl ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      <div className="relative">{children}</div>
    </section>
  );
}

function ProgressRing({ progress }: { progress: number }) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex h-48 w-48 items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-fuchsia-500/25 blur-3xl" />

      <svg className="relative h-48 w-48 -rotate-90" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r={radius} stroke="rgba(255,255,255,0.10)" strokeWidth="14" fill="none" />
        <circle
          cx="75"
          cy="75"
          r={radius}
          stroke="url(#heroGradient)"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="45%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute text-center">
        <p className="text-5xl font-black">{progress}%</p>
        <p className="mt-1 text-xs text-slate-400">objectif atteint</p>
      </div>
    </div>
  );
}
const illustrations = {
  water: "/illustrations/water.png",
  Pas: "/illustrations/pas.png",
  walking: "/illustrations/walking.png",
  yoga: "/illustrations/yoga.png",
  running: "/illustrations/running.png",
  dumbbell: "/illustrations/dumbbell.png",
  sleep: "/illustrations/sleep.png",
  apple: "/illustrations/apple.png",
  protein: "/illustrations/protein.png",
  target: "/illustrations/target.png",
};
function getCountdown(dateString: string) {
  const today = new Date();
  const target = new Date(dateString);

  // On ignore l'heure
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diff = Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Demain";
  if (diff < 7) return `Dans ${diff} jours`;
  if (diff < 30) return `Dans ${Math.floor(diff / 7)} semaine${Math.floor(diff / 7) > 1 ? "s" : ""}`;

  return `📆 Dans ${diff} jours`;
}

function formatBilanMonth(dateString: string) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date
    .toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    })
    .replace(/^./, (c) => c.toUpperCase());
}
export default async function ClientHomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cookieStore = await cookies();
const isAuthenticated = cookieStore.get(`client-auth-${slug}`)?.value === "true";

if (!isAuthenticated) {
  redirect(`/client/${slug}/login`);
}
 const client = await getCachedClient(slug);
  if (!client) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-5 text-center text-white">
      Client introuvable.
    </main>
  );
}

const sessions = client.sessions ?? [];
const bilans = client.bilans.map((bilan: any, index: number) => {
  const previous = client.bilans[index + 1];

  const evolutionValue = previous ? bilan.poids - previous.poids : 0;

  return {
    date: bilan.date,
    poids: `${bilan.poids} kg`,
    taille: `${bilan.taille} cm`,
    hanches: `${bilan.hanches} cm`,
    evolution:
      evolutionValue > 0
        ? `+${evolutionValue.toFixed(1)} kg`
        : `${evolutionValue.toFixed(1)} kg`,
    status: evolutionValue <= 0 ? "better" : "worse",
  };
});


  if (!client) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] px-5 text-center text-white">
        Client introuvable.
      </main>
    );
  }

  const perte = client.poidsInitial - client.poidsActuel;
  const objectifTotal = client.poidsInitial - client.objectifPoids;
const progressRaw =
  objectifTotal > 0 ? Math.round((perte / objectifTotal) * 100) : 0;

const progress = Math.max(0, Math.min(progressRaw, 100));
  const reste = client.poidsActuel - client.objectifPoids;

const colorByCategory: Record<string, string> = {
  Sport: "from-yellow-500/30 to-amber-700/20",
  Nutrition: "from-emerald-500/30 to-green-700/20",
  "Mode de vie": "from-sky-500/30 to-blue-700/20",
  Bilan: "from-slate-300/20 to-white/10",
  Interdit: "from-red-500/30 to-rose-700/20",
  Habitudes: "from-violet-500/30 to-fuchsia-700/20",
  
};
const iconColorByCategory: Record<string, string> = {
  Sport: "text-yellow-300",
  Nutrition: "text-emerald-300",
  "Mode de vie": "text-sky-300",
  Bilan: "text-white",
  Interdit: "text-red-300",
  Habitudes: "text-violet-300",
};

const challenges = (client.challenges ?? []).map((challenge: any) => ({
  icon: challenge.icon ?? "target",
  title: challenge.title,
  description: challenge.description,
  points: challenge.points ?? 0,
  periode: challenge.periode,
  categorie: challenge.categorie,
  color:
    colorByCategory[challenge.categorie] ??
    "from-slate-500/30 to-slate-700/20",
}));

const weeklyChallenges = challenges.filter(
  (challenge) => challenge.periode === "Semaine"
);

const monthlyChallenges = challenges.filter(
  (challenge) => challenge.periode === "Mois"
);
  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] px-5 pb-32 pt-4 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(168,85,247,.38),transparent_35%),radial-gradient(circle_at_95%_15%,rgba(59,130,246,.24),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(236,72,153,.18),transparent_38%)]" />

      <div className="relative mx-auto max-w-md space-y-5">
        <StatusBar />

     <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6">
  {/* Halo lumineux */}
  <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-violet-500/20 blur-3xl" />
  <div className="absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-sky-500/10 blur-3xl" />

  <div className="relative">
    <div className="h-px w-16 bg-gradient-to-r from-violet-500 to-transparent" />

   <div className="mt-6 flex items-center gap-3">
  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 border border-violet-400/20">
   <HeartHandshake className="h-7 w-7 text-violet-300" strokeWidth={2.2} />
  </div>

  <h1 className="text-4xl font-black tracking-tight text-white">
    Bonjour{" "}
    <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-white bg-clip-text text-transparent">
      {client.nom.split(" ")[0]}
    </span>
  </h1>
</div>

    <p className="mt-3 text-lg font-medium text-slate-300">
      Ton espace de coaching personnalisé
    </p>

    <p className="mt-2 max-w-md text-sm leading-7 text-slate-400">
      Chaque petite victoire te rapproche de ton objectif. Continue à avancer,
      un pas après l'autre.
    </p>

    <div className="mt-6 h-px w-full bg-gradient-to-r from-violet-500/40 via-white/10 to-transparent" />
  </div>
</section>

        <Card className="border-violet-400/20 bg-gradient-to-br from-violet-700/90 via-indigo-900/90 to-[#080b1a]">
          <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-violet-400/30 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-pink-500/20 blur-3xl" />

          <div className="flex flex-col items-center text-center">
            <ProgressRing progress={progress} />

            <h2 className="mt-5 text-2xl font-black">
              Tu es à {progress}% de ton objectif
            </h2>

            <p className="mt-2 text-sm text-slate-300">
              Plus que <span className="font-black text-emerald-300">{reste.toFixed(1)} kg</span> avant d'y arriver ! 
            </p>

            <div className="mt-6 grid w-full grid-cols-3 gap-3">
           <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
  <div className="flex items-center gap-2 text-slate-400">
    <Scale size={15} className="text-violet-300" />
    <p className="text-[10px]">Actuel</p>
  </div>

  <p className="mt-2 text-xl font-black">
    {client.poidsActuel} <span className="text-sm font-medium text-slate-400">kg</span>
  </p>
</div>

             <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
  <div className="flex items-center gap-2 text-slate-400">
    <Crosshair size={15} className="text-pink-300" />
    <p className="text-[10px]">Objectif</p>
  </div>

  <p className="mt-2 text-xl font-black">
    {client.objectifPoids} <span className="text-sm font-medium text-slate-400">kg</span>
  </p>
</div>

       <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3">
  <div className="flex items-center gap-2 text-slate-400">
    <TrendingDown size={15} className="text-emerald-300" />
    <p className="text-[10px]">Perdu</p>
  </div>

  <p className="mt-2 text-xl font-black text-emerald-300">
    -{perte.toFixed(1)} <span className="text-sm font-medium text-emerald-200">kg</span>
  </p>
</div>
            </div>
          </div>
                  </Card>


<Card className="border-violet-400/20 bg-gradient-to-br from-white/[0.08] to-violet-950/20">
  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />

  <div className="relative flex items-center gap-4">
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-violet-400/40 blur-xl" />
      <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-violet-300 shadow-[0_0_28px_rgba(168,85,247,.55)]">
        <img
          src="/images/Vitto.png"
          alt="Coach Vitto"
          className="h-full w-full object-cover"
        />
      </div>
    </div>

    <div>
      <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-300">
        Coach Vitto
      </p>
      <p className="text-sm text-slate-400">Focus de la semaine</p>
    </div>
  </div>

  <div className="relative mt-6 rounded-[28px] border border-white/10 bg-slate-950/50 p-5 shadow-inner">
   <p className="text-justify text-[15px] leading-8 text-slate-200">
  {client.messageCoach || "Bravo, continue comme ça 💜"}
</p>

    <div className="mt-5 flex justify-end">
      <span className="rounded-full bg-violet-500/15 px-4 py-2 text-xs font-black text-violet-300">
        — Vitto
      </span>
    </div>
  </div>
</Card>

        <Card>
          <div className="flex items-center gap-2">
            <Target className="text-violet-400" size={20} />
            <h2 className="font-black">Challenges</h2>
          </div>

          <div className="mt-5 space-y-4">
          <h3 className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-violet-300">
  Objectifs de la semaine
</h3>

{weeklyChallenges.map((challenge) => {
            

              return (
                <div key={challenge.title} className={`relative overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br ${challenge.color} p-4`}>

                  <div className="relative flex items-center gap-4">
{
  (() => {
    const Icon =
      challengeIcons[
        challenge.icon as keyof typeof challengeIcons
      ] ?? Target;

    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10">
<Icon
  size={34}
  className={
    iconColorByCategory[challenge.categorie] ?? "text-violet-300"
  }
  strokeWidth={2.3}
/>
      </div>
    );
  })()
}


                    <div className="flex-1">
                      <p className="font-black">{challenge.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-300">{challenge.description}</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-center">
                      <p className="text-xl font-black text-white">+{challenge.points}</p>
                      <p className="text-[10px] text-slate-300">pts</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {monthlyChallenges.length > 0 && (
  <>
    <h3 className="mb-4 mt-8 text-xs font-black uppercase tracking-[0.22em] text-violet-300">
      Objectif du mois
    </h3>

    {monthlyChallenges.map((challenge) => {
      return (
        <div
          key={challenge.title}
          className={`relative overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br ${challenge.color} p-4`}
        >
          <div className="relative flex items-center gap-4">
            {(() => {
              const Icon =
                challengeIcons[
                  challenge.icon as keyof typeof challengeIcons
                ] ?? Target;

              return (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <Icon
  size={34}
  className="text-white"
  strokeWidth={2.3}
/>
                </div>
              );
            })()}

            <div className="flex-1">
              <p className="font-black">{challenge.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">
                {challenge.description}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-center">
              <p className="text-xl font-black text-white">+{challenge.points}</p>
              <p className="text-[10px] text-slate-300">pts</p>
            </div>
          </div>
        </div>
      );
    })}
  </>
)}
          </div>
        </Card>

   <Card>
  <div className="flex items-center gap-2">
    <CalendarDays className="text-violet-400" size={20} />
    <h2 className="font-black">Prochaines séances</h2>
  </div>

  <div className="mt-5 space-y-4">
    {(client.sessions ?? []).map((session: any, index: number) => {
      const date = new Date(session.date);

      return (
        <div
          key={`${session.title}-${session.date}`}
          className={`relative overflow-hidden rounded-[26px] border p-4 ${
            index === 0
              ? "border-violet-400/30 bg-gradient-to-br from-violet-600/35 to-fuchsia-600/15"
              : "border-white/10 bg-slate-950/60"
          }`}
        >
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-violet-500/20 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                {date.toLocaleDateString("fr-FR", { weekday: "long" })}
              </p>

              <p className="mt-2 text-2xl font-black">
                {date.toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                })}
              </p>

   <div
  className={`mt-3 flex items-center gap-2 text-xs font-semibold ${
    index === 0 ? "text-emerald-300" : "text-slate-400"
  }`}
>
  <Timer
    size={14}
    className={index === 0 ? "text-emerald-300" : "text-slate-500"}
  />
  <span>{getCountdown(session.date)}</span>
</div>
            </div>

            <div className="text-right">
              {index === 0 && (
                <div className="mb-3 rounded-full bg-violet-500 px-3 py-1 text-[10px] font-black">
                  Prochaine
                </div>
              )}

              <p className="text-xl font-black text-violet-200">
              {session.heure}
              </p>
                        </div>
          </div>
        </div>
      );
    })}
  </div>
</Card>

        <Card>
          <div className="flex items-center gap-2">
            <ClipboardList className="text-sky-400" size={20} />
            <h2 className="font-black">Derniers bilans mensuels</h2>
          </div>

          <div className="mt-5 space-y-4">
            {bilans.map((bilan) => {
  const isBetter = bilan.status === "better";

  return (
    <div
      key={bilan.date}
      className="rounded-[26px] border border-white/10 bg-gradient-to-br from-[#17192a] to-[#0b0f1f] p-4"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
         

          <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-white">
            {formatBilanMonth(bilan.date)}
          </p>
        </div>

                    <div className={`relative h-3 w-3 rounded-full ${isBetter ? "bg-emerald-400" : "bg-rose-400"}`}>
                      <span className={`absolute inset-0 rounded-full ${isBetter ? "bg-emerald-400/40 shadow-[0_0_12px_rgba(52,211,153,.8)]" : "bg-rose-400/40 shadow-[0_0_12px_rgba(251,113,133,.8)]"}`} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl bg-white/5 p-3">
                      <p className="text-[10px] text-slate-400">Poids</p>
                      <p className="mt-1 text-sm font-black">{bilan.poids}</p>
                    </div>

                    <div className="rounded-2xl bg-white/5 p-3">
                      <p className="text-[10px] text-slate-400">Taille</p>
                      <p className="mt-1 text-sm font-black">{bilan.taille}</p>
                    </div>

                    <div className="rounded-2xl bg-white/5 p-3">
                      <p className="text-[10px] text-slate-400">Hanches</p>
                      <p className="mt-1 text-sm font-black">{bilan.hanches}</p>
                    </div>
                  </div>

                  <div className={`mt-4 rounded-2xl border-l-4 bg-slate-950/50 p-3 text-center ${isBetter ? "border-emerald-400 text-emerald-300" : "border-rose-400 text-rose-300"}`}>
                    <p className="font-black">
                      {bilan.evolution}
                      <span className="ml-2 font-normal text-slate-400">depuis le dernier bilan</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <a
  href="https://tally.so/r/RGgAjK"
  target="_blank"
  rel="noopener noreferrer"
  className="mt-4 flex w-full items-center justify-center rounded-[20px] bg-violet-600 py-4 font-black shadow-lg shadow-violet-600/25 transition-all duration-300 hover:bg-violet-500 hover:shadow-violet-500/40"
>
   Remplir mon bilan
</a>
        </Card>

     
      </div>

      <BottomNav />
    </main>
  );
}