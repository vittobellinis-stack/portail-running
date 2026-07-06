"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function CoachPopup({
  message,
  onOpenChange,
}: {
  message: string;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(true);

  const close = () => {
    setOpen(false);
    onOpenChange?.(false);
  };

  const openPopup = () => {
    setOpen(true);
    onOpenChange?.(true);
  };

  if (!message) return null;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={openPopup}
          className="fixed bottom-28 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-[0_0_35px_rgba(168,85,247,.55)]"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/70 px-5 py-10 backdrop-blur-xl">
          <div className="relative mb-20 w-full max-w-sm rounded-[34px] border border-white/10 bg-[#0b1022] p-6 text-white shadow-[0_30px_120px_rgba(0,0,0,.8)]">
            <button
              type="button"
              onClick={close}
              className="absolute right-5 top-5 z-10 rounded-full bg-white/10 p-2 text-slate-300"
            >
              <X size={18} />
            </button>

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 font-black">
              V
            </div>

            <p className="mt-5 text-sm font-semibold text-violet-300">
              Message du coach
            </p>

            <h2 className="mt-2 text-2xl font-black">Petit mot pour toi</h2>

            <p className="mt-4 text-sm leading-7 text-slate-300">{message}</p>

            <button
              type="button"
              onClick={close}
              onTouchEnd={close}
              className="relative z-20 mt-6 w-full touch-manipulation rounded-[20px] bg-violet-600 py-4 font-black shadow-lg shadow-violet-600/25 active:scale-[0.98]"
            >
              J’ai compris
            </button>
          </div>
        </div>
      )}
    </>
  );
}