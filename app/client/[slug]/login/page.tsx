import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getClient } from "@/lib/client";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";

    const slug = String(formData.get("slug") || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const password = String(formData.get("password") || "").trim();

    const client = await getClient(slug);

    if (!client || client.password !== password) {
      redirect("/?error=1");
    }

    const cookieStore = await cookies();

    cookieStore.set(`client-auth-${slug}`, "true", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: `/client/${slug}`,
      maxAge: 60 * 60 * 24 * 30,
    });

    redirect(`/client/${slug}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_95%_0%,rgba(139,92,246,.38),transparent_35%),radial-gradient(circle_at_0%_60%,rgba(59,130,246,.16),transparent_30%)]" />

      <form
        action={login}
        className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-white/[0.07] p-8 shadow-[0_25px_80px_rgba(0,0,0,.45)] backdrop-blur-2xl"
      >
        <p className="text-sm font-semibold text-violet-300">Coach Vitto</p>

        <h1 className="mt-2 text-4xl font-black">Espace client</h1>

        <p className="mt-4 leading-7 text-slate-400">
          Connecte-toi avec ton identifiant et ton mot de passe.
        </p>

        <div className="mt-8 space-y-4">
          <input
            name="slug"
            type="text"
            placeholder="Identifiant"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-5 py-4 text-white outline-none placeholder:text-slate-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-5 py-4 text-white outline-none placeholder:text-slate-500"
          />

          {error && (
            <p className="text-sm text-rose-300">
              Identifiant ou mot de passe incorrect.
            </p>
          )}

          <button className="w-full rounded-2xl bg-violet-600 py-4 font-black shadow-lg shadow-violet-600/25">
            Se connecter
          </button>
        </div>
      </form>
    </main>
  );
}