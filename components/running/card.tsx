import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <section
      className={[
        "relative overflow-hidden rounded-[30px]",
        "border border-white/[0.09]",
        "bg-[linear-gradient(145deg,rgba(20,24,39,0.97),rgba(8,11,21,0.98))]",
        "p-5 shadow-[0_28px_80px_rgba(0,0,0,0.42)]",
        "backdrop-blur-2xl sm:p-6",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="pointer-events-none absolute -right-14 -top-14 size-40 rounded-full bg-violet-500/[0.08] blur-3xl" />

      <div className="relative z-10">{children}</div>
    </section>
  );
}