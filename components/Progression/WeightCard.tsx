"use client";

export default function WeightCardClean() {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.07] p-5 text-white">
      <h2 className="text-lg font-black">Poids</h2>

      <div className="mt-6">
        <span className="text-5xl font-black">80,3</span>
        <span className="ml-2 text-xl text-slate-400">kg</span>
      </div>

      <p className="mt-3 text-sm text-emerald-300">
        -2,6 kg depuis avril
      </p>
    </div>
  );
}