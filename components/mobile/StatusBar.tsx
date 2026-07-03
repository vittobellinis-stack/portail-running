export default function StatusBar() {
  return (
    <div className="flex items-center justify-between text-sm font-semibold text-white/80">
      <span>09:41</span>
      <div className="flex items-center gap-2">
        <span>📶</span>
        <span>5G</span>
        <span>🔋</span>
      </div>
    </div>
  );
}