"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Share2 } from "lucide-react";
import SharePreviewModal from "@/components/share/SharePreviewModal";
import { captureElement } from "@/lib/share/capture";

type Member = {
  email?: string;
  name: string;
  regno?: string;
  role?: string;
  isCore: boolean;
};

type ApiMember = Member & { team: string };

const TEAM_NAMES: Record<string, string> = {
  management: "MANAGEMENT",
  tech: "TECH TEAM",
  pr: "PR TEAM",
  content: "CONTENT TEAM",
  design: "DESIGN TEAM",
  visuals: "VISUALS TEAM",
  video: "VIDEO TEAM",
  event: "EVENT TEAM",
};

// Cycling order for the ◀ / ▶ title navigation.
const TEAM_ORDER = [
  "management",
  "tech",
  "pr",
  "event",
  "design",
  "visuals",
  "video",
  "content",
];

// Only the tech folder has crewmate artwork today. Reuse it for every team
// until dedicated art exists.
const AVATAR_ART_SLUG = "tech";

// Keep avatars stable as the roster grows. Add more files here when a team
// receives more unique artwork; larger rosters reuse the available artwork.
const AVATARS_PER_TEAM = 10;

const TEAM_SLUGS: Record<string, string> = {
  management: "management",
  "tech team": "tech",
  "pr team": "pr",
  "content team": "content",
  "design team": "design",
  "visuals team": "visuals",
  "video team": "video",
  "event team": "event",
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function avatarIndexFor(member: Member) {
  const key = member.email ?? member.name;
  if (member.regno === "241501014") {
    return 7;
  }
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return (Math.abs(hash) % AVATARS_PER_TEAM) + 1;
}

function slugForTeam(team: string) {
  const normalized = normalize(team);
  return (
    TEAM_SLUGS[normalized] ??
    normalized.replace(/\s+team$/, "").replace(/\s+/g, "-")
  );
}

export default function TeamLobby() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const requestedTeam = searchParams.get("team") ?? "Tech Team";
  const [allMembers, setAllMembers] = useState<ApiMember[]>([]);
  const [slug, setSlug] = useState(() => slugForTeam(requestedTeam));
  const [loading, setLoading] = useState(true);
  const captureRef = useRef<HTMLElement>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareBlob, setShareBlob] = useState<Blob | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleShare = async () => {
    if (!captureRef.current) return;
    setShareOpen(true);
    setIsCapturing(true);
    try {
      const blob = await captureElement(captureRef.current);
      setShareBlob(blob);
    } catch (error) {
      console.error("Failed to capture screenshot", error);
      setShareBlob(null);
    } finally {
      setIsCapturing(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function loadRoster() {
      try {
        // Rosters are fetched without an email — the API strips email in
        // this listing mode, so no other member's email ever reaches the
        // client here.
        const [participantsResponse, coreResponse] = await Promise.all([
          fetch("/api/participants"),
          fetch("/api/core"),
        ]);
        const participantsRaw: ApiMember[] = participantsResponse.ok
          ? await participantsResponse.json()
          : [];
        const coreMembersRaw: ApiMember[] = coreResponse.ok
          ? await coreResponse.json()
          : [];
        const participants = participantsRaw.map((member) => ({
          ...member,
          isCore: false,
        }));
        const coreMembers = coreMembersRaw.map((member) => ({
          ...member,
          isCore: true,
        }));
        const merged = [...participants, ...coreMembers];

        let selectedSlug = slugForTeam(requestedTeam);
        if (email) {
          // Targeted single-record lookup by the visitor's own email —
          // returns their own record (email included), never anyone else's.
          const [ownParticipant, ownCore] = await Promise.all([
            fetch(`/api/participants?email=${encodeURIComponent(email)}`),
            fetch(`/api/core?email=${encodeURIComponent(email)}`),
          ]);
          const matchingMember = ownCore.ok
            ? await ownCore.json()
            : ownParticipant.ok
              ? await ownParticipant.json()
              : null;
          if (matchingMember?.team)
            selectedSlug = slugForTeam(matchingMember.team);
        }

        if (!cancelled) {
          setAllMembers(merged);
          setSlug(selectedSlug);
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

  const members = useMemo(
    () =>
      allMembers
        .filter((member) => slugForTeam(member.team) === slug)
        .sort(
          (a, b) =>
            Number(b.isCore) - Number(a.isCore) || a.name.localeCompare(b.name),
        )
        .map(({ email, name, regno, role, isCore }) => ({
          email,
          name,
          regno,
          role,
          isCore,
        })),
    [allMembers, slug],
  );
  const title = TEAM_NAMES[slug] ?? slug.toUpperCase();

  function goToTeam(direction: 1 | -1) {
    const currentIndex = TEAM_ORDER.indexOf(slug);
    const nextIndex =
      (currentIndex + direction + TEAM_ORDER.length) % TEAM_ORDER.length;
    setSlug(TEAM_ORDER[nextIndex]);
  }

  return (
    <>
      <main
        ref={captureRef}
        className="relative min-h-screen overflow-hidden bg-[#111b23] font-press-start-2p text-white"
      >
        <Image
          src="/lobby.webp"
          alt="Among Us style team lobby"
          fill
          priority
          sizes="100vw"
          className="z-0 object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#081017]/25" />

        <div className="relative z-10 min-h-screen px-4 py-5 sm:px-8 sm:py-8">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="absolute left-4 top-4 rounded-md border-2 border-[#15191d] bg-[#58646b]/90 px-3 py-2 text-[9px] text-white shadow-[3px_3px_0_#15191d] transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:left-8 sm:top-8"
            >
              ← BACK
            </button>

            <button
              type="button"
              onClick={() => router.push("/results")}
              className="border-2 border-[#15191d] bg-[#58646b]/90 px-3 py-2 text-[8px] shadow-[3px_3px_0_#15191d] transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:text-[10px]"
            >
              ALL TEAMS
            </button>
          </div>

          <div className="mx-auto flex max-w-5xl flex-col items-center">
            <div className="relative mt-9 border-4 border-[#121518] bg-[#20272a] px-9 py-3 shadow-[6px_6px_0_rgba(0,0,0,0.65)] sm:px-16 sm:py-4">
              <button
                type="button"
                onClick={() => goToTeam(-1)}
                aria-label="Previous team"
                className="absolute -left-10 top-1/2 -translate-y-1/2 text-2xl text-[#cb3030] transition-transform hover:scale-125 active:scale-95 sm:-left-14 sm:text-4xl"
              >
                ◀
              </button>
              <h1 className="text-center text-lg tracking-[0.18em] text-[#f5f0d9] drop-shadow-[3px_3px_0_#111] sm:text-3xl">
                {title}
              </h1>
              <button
                type="button"
                onClick={() => goToTeam(1)}
                aria-label="Next team"
                className="absolute -right-10 top-1/2 -translate-y-1/2 text-2xl text-[#cb3030] transition-transform hover:scale-125 active:scale-95 sm:-right-14 sm:text-4xl"
              >
                ▶
              </button>
            </div>
            <p className="mt-3 bg-[#11191d]/70 px-3 py-1 text-[8px] text-[#e7e1ca] sm:text-[10px]">
              {loading
                ? "LOADING CREWMATES..."
                : `${members.length} CREWMATES READY`}
            </p>
          </div>

          <section
            aria-label={`${title} team members`}
            className="relative mx-auto mt-4 flex min-h-[58dvh] max-w-6xl flex-col justify-end overflow-y-auto pb-20 sm:mt-0 sm:min-h-[64dvh]"
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-24 w-40 -translate-x-1/2 -translate-y-1/2 -rotate-2 border-4 border-[#161b1d] bg-[#48545a] shadow-[7px_7px_0_rgba(0,0,0,0.55)] sm:block">
              <div className="m-3 h-10 border-2 border-[#222a2d] bg-[#849096]" />
              <div className="mx-auto h-2 w-16 bg-[#c7d2cf]" />
            </div>

            {loading ? (
              <div className="flex min-h-[50dvh] items-center justify-center text-[10px] text-[#f5f0d9]">
                LOADING CREWMATES...
              </div>
            ) : members.length === 0 ? (
              <div className="flex min-h-[50dvh] items-center justify-center text-center text-[10px] text-[#f5f0d9]">
                NO CREWMATES FOUND
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 px-2 pt-4 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-8 sm:px-8 lg:grid-cols-4">
                {members.map((member, index) => (
                  <article
                    key={member.email ?? `${member.name}-${index}`}
                    className="relative z-10 flex min-w-0 flex-col items-center justify-end text-center"
                  >
                    {member.isCore && (
                      <span className="mb-1 whitespace-nowrap rounded-sm border-2 border-[#7a0f0f] bg-[#c51111] px-1.5 py-0.5 text-[6px] tracking-wide text-white shadow-[2px_2px_0_rgba(0,0,0,0.6)] sm:text-[7px]">
                        DEVS CORE
                      </span>
                    )}
                    <Image
                      src={`/teams/${AVATAR_ART_SLUG}/${avatarIndexFor(member)}.png`}
                      alt={`${member.name} avatar`}
                      width={150}
                      height={150}
                      loading="eager"
                      className="h-24 w-24 object-contain drop-shadow-[5px_7px_0_rgba(0,0,0,0.5)] sm:h-32 sm:w-32"
                    />
                    <div className="-mt-0.75 max-w-full border-2 border-[#15191d] bg-[#e6e0c8] px-2 py-1 text-[8px] leading-relaxed text-[#172027] shadow-[3px_3px_0_rgba(0,0,0,0.6)] sm:text-[10px]">
                      <p className="truncate">{member.name}</p>
                      {member.role && (
                        <p className="truncate text-[7px] text-[#58636a]">
                          {member.role}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <button
        type="button"
        onClick={handleShare}
        disabled={isCapturing}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-md border-2 border-[#15191d] bg-cyan-700/90 px-5 py-3 text-xs text-white shadow-[3px_3px_0_#15191d] transition-transform hover:-translate-y-0.5 hover:bg-cyan-600/90 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 sm:bottom-6 sm:right-6 sm:px-6 sm:py-4 sm:text-sm font-press-start-2p"
      >
        <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
        {isCapturing ? "CAPTURING..." : "SHARE"}
      </button>
      <SharePreviewModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        imageBlob={shareBlob}
        isCapturing={isCapturing}
        shareTitle="DEVS REC"
        shareText={`Check out the ${title} lobby at DEVS REC!`}
        fileName={`devs-team-${slug}.png`}
      />
    </>
  );
}
