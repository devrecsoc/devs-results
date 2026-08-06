"use client";

import { Suspense } from "react";
import TeamLobby from "@/components/TeamLobby";

export default function TeamPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#111b23] font-press-start-2p text-xs text-white">
          Loading lobby...
        </div>
      }
    >
      <TeamLobby />
    </Suspense>
  );
}
