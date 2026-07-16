import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  checkClientPassword,
} from "@/lib/notion/get-client-auth";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function formatSlug(
  value: FormDataEntryValue | null
): string {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const { error } = await searchParams;

  async function login(
    formData: FormData
  ) {
    "use server";

    const slug = formatSlug(
      formData.get("slug")
    );

    const password = String(
      formData.get("password") ?? ""
    ).trim();

    const isValid =
      await checkClientPassword(
        slug,
        password
      );

    if (!isValid) {
      redirect("/login?error=1");
    }

    const cookieStore =
      await cookies();

    cookieStore.set(
      `client-auth-${slug}`,
      "true",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        path: "/",
        maxAge:
          60 * 60 * 24 * 30,
      }
    );

    redirect(`/${slug}`);
  }

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#050816] px-5 py-8 text-white">
      {/* Fond violet identique à l’ancien portail */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(124,58,237,0.32),transparent_36%),radial-gradient(circle_at_0%_55%,rgba(59,130,246,0.10),transparent_34%),linear-gradient(180deg,#07091a_0%,#040713_100%)]" />

      <form
        action={login}
        className="relative w-full max-w-[370px] rounded-[30px] border border-white/[0.13] bg-[#171a2a]/95 px-7 py-8 shadow-[0_28px_80px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:max-w-md sm:px-9 sm:py-10"
      >
        <p className="text-[15px] font-bold text-violet-300 sm:text-base">
          Coach Vitto
        </p>

        <h1 className="mt-3 text-[39px] font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-5xl">
          Espace client
        </h1>

        <p className="mt-6 text-[15px] leading-7 text-slate-400 sm:text-base">
          Connecte-toi avec ton identifiant et ton mot de passe.
        </p>

        <div className="mt-8 space-y-4">
          <input
            name="slug"
            type="text"
            placeholder="Identifiant : prenom-nom"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            className="h-[58px] w-full rounded-[17px] border border-white/[0.08] bg-[#050817] px-5 text-[16px] text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/55 focus:ring-2 focus:ring-violet-500/10 sm:h-16"
          />

          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            autoComplete="current-password"
            required
            className="h-[58px] w-full rounded-[17px] border border-white/[0.08] bg-[#050817] px-5 text-[16px] text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/55 focus:ring-2 focus:ring-violet-500/10 sm:h-16"
          />

          {error && (
            <div className="rounded-[15px] border border-rose-400/15 bg-rose-500/10 px-4 py-3">
              <p className="text-[13px] leading-5 text-rose-300">
                Identifiant ou mot de passe incorrect.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="mt-2 flex h-[58px] w-full items-center justify-center rounded-[17px] bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-5 text-[17px] font-black text-white shadow-[0_15px_32px_rgba(139,92,246,0.34)] transition active:scale-[0.99] sm:h-16 sm:text-lg"
          >
            Se connecter
          </button>
        </div>
      </form>
    </main>
  );
}