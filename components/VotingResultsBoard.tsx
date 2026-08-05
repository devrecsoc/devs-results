"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Flag, Megaphone } from "lucide-react";

export type SelectedStudent = {
  email: string;
  name: string;
  team: string;
  regno: string;
  role?: string;
};

export type CoreLead = {
  email: string;
  name: string;
  regno: string;
  team: string;
  role: string;
};

const CORE_AVATAR_COLOR = "#dc2626";

const TEAMS = [
  { name: "Management", color: "#c0392b" },
  { name: "Tech Team", color: "#1f77c9" },
  { name: "PR Team", color: "#e07fc0" },
  { name: "Content Team", color: "#1fae6b" },
  { name: "Design Team", color: "#d18e1f" },
  { name: "Visuals Team", color: "#7a4fd1" },
  { name: "Video Team", color: "#17b6c4" },
  { name: "Event Team", color: "#de006f" },
];

const DEFAULT_TEAM_COLOR = "#5a3a2a";

function normalizeTeam(team: string) {
  return team.trim().toLowerCase();
}

function colorForTeam(team: string) {
  const match = TEAMS.find(
    (t) => normalizeTeam(t.name) === normalizeTeam(team),
  );
  return match?.color ?? DEFAULT_TEAM_COLOR;
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
  coreLeads?: CoreLead[];
  title?: string;
  countdownSeconds?: number;
};

export default function VotingResultsBoard({
  students,
  coreLeads = [],
  title = "Team Lobby",
  countdownSeconds = 5,
}: VotingResultsBoardProps) {
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const teamStudents = selectedTeam
    ? students.filter(
        (s) => normalizeTeam(s.team) === normalizeTeam(selectedTeam),
      )
    : [];

  const teamLeads = selectedTeam
    ? coreLeads.filter(
        (l) => normalizeTeam(l.team) === normalizeTeam(selectedTeam),
      )
    : [];

  return (
    <div className="relative mx-auto w-full max-w-xs sm:max-w-5xl rounded-[38px] border-4 border-[#121212] bg-[#0000cfbe] p-3 shadow-2xl">
      {/* Side buttons (portrait: sides, landscape: top/bottom edge) */}
      <div className="absolute -right-1.25 top-24 flex flex-col gap-3 sm:hidden">
        <div className="h-10 w-1 rounded-full bg-[#b90069]" />
        <div className="h-14 w-1 rounded-full bg-[#b90069]" />
      </div>
      <div className="absolute -left-1.25 top-28 h-16 w-1 rounded-full bg-[#b90069] sm:hidden" />

      <div className="absolute -bottom-1.25 left-24 hidden gap-3 sm:flex">
        <div className="h-1 w-10 rounded-full bg-[#b90069]" />
        <div className="h-1 w-14 rounded-full bg-[#b90069]" />
      </div>
      <div className="absolute -top-1.25 left-28 hidden h-1 w-16 rounded-full bg-[#b90069] sm:block" />

      {/* Notch (portrait: top center, landscape: left edge) */}
      <div className="absolute left-1/2 top-3 z-10 h-4 w-24 -translate-x-1/2 rounded-full bg-[#121212] sm:hidden" />
      <div className="absolute left-3 top-1/2 z-10 hidden h-24 w-4 -translate-y-1/2 rounded-full bg-[#121212] sm:block" />

      {/* Screen */}
      <div className="relative px-2 flex h-[75vh] max-h-165 min-h-120 sm:h-[80vh] sm:max-h-120 sm:min-h-90 flex-col overflow-hidden rounded-[28px] bg-[#333333]">
        <div className="relative flex shrink-0 items-center justify-center px-5 pb-3 pt-5">
          {selectedTeam && (
            <button
              onClick={() => setSelectedTeam(null)}
              className="absolute left-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800/10 text-zinc-800 hover:bg-zinc-800/20"
              title="Back to teams"
            >
              <ArrowLeft className="h-6 w-6" color="white" />
            </button>
          )}
          <h1 className="text-center text-base text-white drop-shadow-sm font-press-start-2p sm:text-lg">
            {selectedTeam ?? title}
          </h1>
          <Flag className="absolute right-5 top-5 h-5 w-5 text-red-600" />
        </div>

        <div className="results-scroll flex-1 overflow-y-auto px-5 mt-2">
          {!selectedTeam ? (
            <div className="grid grid-cols-1 gap-4 pb-3 sm:grid-cols-2 lg:grid-cols-3">
              {TEAMS.map((team) => {
                const count =
                  students.filter(
                    (s) => normalizeTeam(s.team) === normalizeTeam(team.name),
                  ).length +
                  coreLeads.filter(
                    (l) => normalizeTeam(l.team) === normalizeTeam(team.name),
                  ).length;
                return (
                  <button
                    key={team.name}
                    onClick={() => setSelectedTeam(team.name)}
                    className="flex items-center gap-3 rounded-sm bg-white py-3 pl-3 pr-5 shadow-sm transition-transform hover:scale-[1.03] active:scale-95"
                  >
                    <div className="scale-125">
                      <CrewmateAvatar color={team.color} />
                    </div>
                    <span className="min-w-0 flex-1 truncate text-left text-base font-extrabold leading-snug text-black">
                      {team.name}
                    </span>
                    <span className="shrink-0 text-sm font-bold text-zinc-700">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 pb-3 sm:grid-cols-2">
              {teamLeads.map((lead) => (
                <div
                  key={lead.email}
                  className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 shadow-sm ring-2 ring-red-600"
                >
                  <CrewmateAvatar color={CORE_AVATAR_COLOR} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-base font-extrabold text-black">
                      {lead.name}
                    </p>
                    <p className="truncate text-xs font-semibold text-zinc-700">
                      {lead.regno}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white bg-red-600">
                    {lead.role}
                  </span>
                </div>
              ))}

              {teamStudents.map((student) => {
                const color = colorForTeam(student.team);
                return (
                  <div
                    key={student.email}
                    className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 shadow-sm"
                  >
                    <CrewmateAvatar color={color} />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-base font-extrabold text-black">
                        {student.name}
                      </p>
                      <p className="truncate text-xs font-semibold text-zinc-700">
                        {student.regno}
                      </p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{ background: color }}
                    >
                      {student.team}
                    </span>
                    <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white bg-amber-800">
                      {student.role}
                    </span>
                  </div>
                );
              })}

              {teamStudents.length === 0 && teamLeads.length === 0 && (
                <div className="col-span-full flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-6 text-sm text-zinc-500">
                  <Megaphone className="h-4 w-4" />
                  No students selected yet.
                </div>
              )}
            </div>
          )}
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
