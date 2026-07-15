import type { ReactNode } from "react";

type SectionTitleProps = {
  icon: ReactNode;
  children: ReactNode;
  eyebrow?: string;
};

export default function SectionTitle({
  icon,
  children,
  eyebrow,
}: SectionTitleProps) {
  return (
    <header className="mb-6 flex items-center gap-3">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-[17px] border border-violet-400/20 bg-violet-500/10 text-violet-300 shadow-[0_0_28px_rgba(139,92,246,0.16)]">
        {icon}
      </div>

      <div>
        {eyebrow ? (
          <p className="text-[10px] font-extrabold uppercase tracking-[0.23em] text-violet-300/70">
            {eyebrow}
          </p>
        ) : null}

        <h2 className="text-lg font-extrabold tracking-[-0.035em] text-white">
          {children}
        </h2>
      </div>
    </header>
  );
}