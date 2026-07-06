import BottomNav from "@/components/mobile/BottomNav";
import StatusBar from "@/components/mobile/StatusBar";
import { getClient } from "@/lib/client";

export default async function MessagesPage() {
  const client = await getClient();

  if (!client) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        Client introuvable.
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] px-5 pb-32 pt-4 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(139,92,246,.35),transparent_32%),radial-gradient(circle_at_90%_10%,rgba(59,130,246,.20),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(124,58,237,.18),transparent_35%)]" />

      <div className="relative mx-auto max-w-md space-y-5">
        <StatusBar />

        <section>
          <p className="text-sm text-slate-400">
            Conversation privée
          </p>

          <h1 className="mt-1 text-4xl font-black">
            Messages
          </h1>
        </section>

        <div className="space-y-4">

          <div className="flex justify-start">

            <div className="max-w-[80%] rounded-[26px] rounded-bl-md bg-violet-600 p-5 shadow-lg">

              <p className="text-sm leading-7">
                {client.messageCoach || "Aucun message du coach."}
              </p>

              <p className="mt-3 text-right text-xs text-violet-200">
                Coach
              </p>

            </div>

          </div>

          <div className="flex justify-end">

            <div className="max-w-[80%] rounded-[26px] rounded-br-md bg-slate-800 p-5">

              <p className="text-sm leading-7">
                Merci coach 💜
              </p>

              <p className="mt-3 text-right text-xs text-slate-400">
                Vous
              </p>

            </div>

          </div>

        </div>

        <div className="fixed bottom-28 left-1/2 w-[90%] max-w-md -translate-x-1/2">

          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/80 p-2 backdrop-blur-xl">

            <input
              className="flex-1 bg-transparent px-3 outline-none"
              placeholder="Écrire un message..."
              disabled
            />

            <button className="rounded-full bg-violet-600 px-5 py-3 font-bold">
              Envoyer
            </button>

          </div>

        </div>

      </div>

      <BottomNav />
    </main>
  );
}