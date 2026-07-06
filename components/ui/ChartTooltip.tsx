export default function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm shadow-2xl backdrop-blur-xl">
      <p className="font-black text-white">{label}</p>

      {payload.map((item: any) => (
        <p key={item.dataKey} style={{ color: item.color }}>
          {item.name || item.dataKey} : {item.value}
        </p>
      ))}
    </div>
  );
}