export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.07] p-5 shadow-[0_25px_80px_rgba(0,0,0,.45)] backdrop-blur-2xl ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      <div className="relative">{children}</div>
    </section>
  );
}