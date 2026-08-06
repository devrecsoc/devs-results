"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Member = {
  email?: string;
  name: string;
  regno?: string;
  role?: string;
};

type ApiMember = Member & { email: string; team: string };

const TEAM_NAMES: Record<string, string> = {
  tech: "TECH",
  management: "MANAGEMENT",
  pr: "PR",
  content: "CONTENT",
  design: "DESIGN",
  visuals: "VISUALS",
  video: "VIDEO",
  event: "EVENT",
};

const TEAM_SLUGS: Record<string, string> = {
  "tech team": "tech",
  management: "management",
  "pr team": "pr",
  "content team": "content",
  "design team": "design",
  "visuals team": "visuals",
  "video team": "video",
  "event team": "event",
};

// Keep avatars stable as the roster grows. Add more files here when a team
// receives more unique artwork; larger rosters reuse the available artwork.
const AVATARS_PER_TEAM = 10;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function slugForTeam(team: string) {
  const normalized = normalize(team);
  return TEAM_SLUGS[normalized] ?? normalized.replace(/\s+team$/, "").replace(/\s+/g, "-");
}

function titleForTeam(team: string, slug: string) {
  return TEAM_NAMES[slug] ?? team.replace(/\s+team$/i, "").toUpperCase();
}

export default function TeamLobby() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const requestedTeam = searchParams.get("team") ?? "Tech Team";
  const [team, setTeam] = useState(requestedTeam);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadRoster() {
      try {
        const [participantsResponse, coreResponse] = await Promise.all([
          fetch("/api/participants"),
          fetch("/api/core"),
        ]);
        const participants: ApiMember[] = participantsResponse.ok
          ? await participantsResponse.json()
          : [];
        const coreMembers: ApiMember[] = coreResponse.ok
          ? await coreResponse.json()
          : [];

        let selectedTeam = requestedTeam;
        if (email) {
          const matchingMember = [...participants, ...coreMembers].find(
            (member) => normalize(member.email) === normalize(email),
          );
          if (matchingMember?.team) selectedTeam = matchingMember.team;
        }

        const selectedSlug = slugForTeam(selectedTeam);
        const roster = [...participants, ...coreMembers]
          .filter((member) => slugForTeam(member.team) === selectedSlug)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(({ email, name, regno, role }) => ({
            email,
            name,
            regno,
            role,
          }));

        if (!cancelled) {
          setTeam(selectedTeam);
          setMembers(roster);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load team roster", error);
        if (!cancelled) setLoading(false);
      }
    }

    loadRoster();
    return () => {
      cancelled = true;
    };
  }, [email, requestedTeam]);

  const slug = useMemo(() => slugForTeam(team), [team]);
  const title = titleForTeam(team, slug);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#111b23] font-press-start-2p text-white">
      <style>{`
        @keyframes subtle-shake {
          0% { transform: scale(1.05) translate(0, 0) rotate(0deg); }
          25% { transform: scale(1.05) translate(3px, 2px) rotate(0.5deg); }
          50% { transform: scale(1.05) translate(-2px, -3px) rotate(-0.5deg); }
          75% { transform: scale(1.05) translate(-4px, 2px) rotate(0.2deg); }
          100% { transform: scale(1.05) translate(0, 0) rotate(0deg); }
        }
        .animate-subtle-shake {
          animation: subtle-shake 4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-subtle-shake {
            animation: none;
            transform: scale(1.02);
          }
        }
      `}</style>
      <Image
        src="/team-bg.webp"
        alt="Among Us style team lobby"
        fill
        priority
        sizes="100vw"
        className="z-0 object-cover object-center animate-subtle-shake"
      />
      <div className="absolute inset-0 bg-[#081017]/25" />

      <div className="relative z-10 min-h-screen px-4 py-5 sm:px-8 sm:py-8">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="absolute left-4 top-4 rounded-md border-2 border-[#15191d] bg-[#58646b]/90 px-3 py-2 text-[9px] text-white shadow-[3px_3px_0_#15191d] transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:left-8 sm:top-8"
        >
          ← BACK
        </button>

        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="relative mt-9 border-4 border-[#121518] bg-[#20272a] px-9 py-3 shadow-[6px_6px_0_rgba(0,0,0,0.65)] sm:px-16 sm:py-4">
            <span className="absolute -left-10 top-1/2 -translate-y-1/2 text-2xl text-[#cb3030] sm:-left-14 sm:text-4xl">◀</span>
            <h1 className="text-center text-lg tracking-[0.18em] text-[#f5f0d9] drop-shadow-[3px_3px_0_#111] sm:text-3xl">{title}</h1>
            <span className="absolute -right-10 top-1/2 -translate-y-1/2 text-2xl text-[#cb3030] sm:-right-14 sm:text-4xl">▶</span>
          </div>
          <p className="mt-3 bg-[#11191d]/70 px-3 py-1 text-[8px] text-[#e7e1ca] sm:text-[10px]">
            {loading ? "LOADING CREWMATES..." : `${members.length} CREWMATES READY`}
          </p>
        </div>

        <section
          aria-label={`${title} team members`}
          className="relative mx-auto mt-4 min-h-[58vh] max-w-6xl overflow-y-auto pb-20 sm:mt-0 sm:min-h-[64vh]"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-24 w-40 -translate-x-1/2 -translate-y-1/2 -rotate-2 border-4 border-[#161b1d] bg-[#48545a] shadow-[7px_7px_0_rgba(0,0,0,0.55)] sm:block">
            <div className="m-3 h-10 border-2 border-[#222a2d] bg-[#849096]" />
            <div className="mx-auto h-2 w-16 bg-[#c7d2cf]" />
          </div>

          {loading ? (
            <div className="flex min-h-[50vh] items-center justify-center text-[10px] text-[#f5f0d9]">
              LOADING CREWMATES...
            </div>
          ) : members.length === 0 ? (
            <div className="flex min-h-[50vh] items-center justify-center text-center text-[10px] text-[#f5f0d9]">
              NO CREWMATES FOUND
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 px-2 pt-4 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-8 sm:px-8 lg:grid-cols-4">
              {members.map((member, index) => (
                <article
                  key={member.email ?? `${member.name}-${index}`}
                  className="relative z-10 flex min-w-0 flex-col items-center justify-end text-center"
                >
                  <Image
                    src={`/teams/${slug}/${(index % AVATARS_PER_TEAM) + 1}.png`}
                    alt={`${member.name} avatar`}
                    width={150}
                    height={150}
                    className="h-24 w-24 object-contain drop-shadow-[5px_7px_0_rgba(0,0,0,0.5)] sm:h-32 sm:w-32"
                  />
                  <div className="-mt-0.75 max-w-full border-2 border-[#15191d] bg-[#e6e0c8] px-2 py-1 text-[8px] leading-relaxed text-[#172027] shadow-[3px_3px_0_rgba(0,0,0,0.6)] sm:text-[10px]">
                    <p className="truncate">{member.name}</p>
                    {member.role && <p className="truncate text-[7px] text-[#58636a]">{member.role}</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-3 sm:bottom-8">
          <button
            type="button"
            onClick={() => router.push("/results")}
            className="border-2 border-[#15191d] bg-[#58646b]/90 px-3 py-2 text-[8px] shadow-[3px_3px_0_#15191d] transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:text-[10px]"
          >
            ALL TEAMS
          </button>
        </div>
      </div>
    </main>
  );
}
