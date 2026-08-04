"use client";

import { useEffect, useState } from "react";
import { Flag, Megaphone, Settings, ShieldBan } from "lucide-react";

export type SelectedStudent = {
  email: string;
  name: string;
  team: string;
  regno: string;
};

const TEAM_COLORS = [
  "#c0392b", // red
  "#1f77c9", // blue
  "#1fae6b", // green
  "#7a4fd1", // purple
  "#d18e1f", // orange
  "#17b6c4", // cyan
  "#e07fc0", // pink
  "#5a3a2a", // brown
];

function colorForTeam(team: string) {
  let hash = 0;
  for (let i = 0; i < team.length; i++) {
    hash = (hash * 31 + team.charCodeAt(i)) >>> 0;
  }
  return TEAM_COLORS[hash % TEAM_COLORS.length];
}

function shade(hex: string, percent: number) {
  const num = parseInt(hex.slice(1), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp((num >> 16) + percent);
  const g = clamp(((num >> 8) & 0x00ff) + percent);
  const b = clamp((num & 0x0000ff) + percent);
  return `rgb(${r},${g},${b})`;
}

function CrewmateAvatar({ color }: { color: string }) {
  return (
    <div className="relative h-9 w-8 shrink-0">
      <div
        className="absolute -left-1 top-[30%] h-[45%] w-2 rounded-sm"
        style={{ background: shade(color, -25) }}
      />
      <div
        className="absolute inset-0 rounded-[60%_60%_55%_55%/70%_70%_45%_45%] shadow-[inset_-3px_-3px_0_rgba(0,0,0,0.2),inset_3px_3px_0_rgba(255,255,255,0.25)]"
        style={{ background: color }}
      />
      <div className="absolute left-[36%] top-[20%] h-[38%] w-[58%] rounded-[50%_50%_40%_40%] bg-linear-to-b from-sky-200 to-sky-400 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]" />
    </div>
  );
}

type VotingResultsBoardProps = {
  students: SelectedStudent[];
  title?: string;
  countdownSeconds?: number;
};

export default function VotingResultsBoard({
  students,
  title = "Selected Members",
  countdownSeconds = 5,
}: VotingResultsBoardProps) {
  const [countdown, setCountdown] = useState(countdownSeconds);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="relative w-full max-w-2xl rounded-[22px] border-2 border-[#2f3133] bg-[#576067] p-3 pb-6 shadow-2xl sm:p-4 sm:pb-7">
      {/* Side buttons */}
      <div className="absolute -right-3 top-6 flex flex-col gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#2f3133] bg-[#4a4f5a] text-zinc-200 shadow-md">
          <Settings className="h-3.5 w-3.5" />
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#2f3133] bg-[#4a4f5a] text-zinc-200 shadow-md">
          <ShieldBan className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Screen */}
      <div className="relative flex h-[70vh] max-h-140 min-h-90 flex-col overflow-hidden rounded-[16px] bg-linear-to-b from-slate-100 to-slate-300 shadow-[inset_0_0_0_2px_rgba(0,0,0,0.08)]">
        <div className="relative flex shrink-0 items-center justify-center px-5 pb-3 pt-5">
          <h1 className="text-center text-base text-zinc-800 drop-shadow-sm font-press-start-2p sm:text-lg">
            {title}
          </h1>
          <Flag className="absolute right-5 top-5 h-5 w-5 text-red-600" />
        </div>

        <div className="results-scroll flex-1 overflow-y-auto px-5">
          <div className="grid grid-cols-1 gap-2.5 pb-3 sm:grid-cols-2">
            {students.map((student) => {
              const color = colorForTeam(student.team);
              return (
                <div
                  key={student.email}
                  className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 shadow-sm"
                >
                  <CrewmateAvatar color={color} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-bold text-zinc-800">
                      {student.name}
                    </p>
                    <p className="truncate text-[11px] font-medium text-zinc-500">
                      {student.regno}
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                    style={{ background: color }}
                  >
                    {student.team}
                  </span>
                </div>
              );
            })}

            {students.length === 0 && (
              <div className="col-span-full flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-6 text-sm text-zinc-500">
                <Megaphone className="h-4 w-4" />
                No students selected yet.
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end px-5 py-2 text-[11px] font-bold text-zinc-500">
          Proceeding in: {countdown}s
        </div>
      </div>

      {/* Home button */}
      <div className="absolute bottom-1.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-[#4a4f5a] bg-[#1c1f26]" />

      <style>{`
        .results-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
        }
        .results-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .results-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.25);
          border-radius: 999px;
        }
        .results-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
