"use client";

import { useState } from "react";
import BottomNav from "@/components/mobile/BottomNav";
import CoachPopup from "@/components/mobile/CoachPopup";

export default function MobileShell({ coachMessage }: { coachMessage: string }) {
  const [popupOpen, setPopupOpen] = useState(true);

  return (
    <>
      <CoachPopup
        message={coachMessage}
        onOpenChange={setPopupOpen}
      />

      {!popupOpen && <BottomNav />}
    </>
  );
}