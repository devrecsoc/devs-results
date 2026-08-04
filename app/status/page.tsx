"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import Particles from "@/components/Particles";
import TextType from "@/components/TextType";

type Participant = {
  email: string;
  name: string;
  team: string;
  regno: string;
};

function StatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNote, setShowNote] = useState(false);

  useEffect(() => {
    const loadParticipant = async () => {
      if (!email.trim()) {
        setSelectedParticipant(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/participants?email=${encodeURIComponent(email)}`,
        );
        if (response.status === 404) {
          setSelectedParticipant(null);
          return;
        }
        if (!response.ok) throw new Error("Failed to load participant");
        const data = await response.json();
        setSelectedParticipant(data);
      } catch (error) {
        console.error("Failed to load participant", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadParticipant();
  }, [email]);

  const isSelected = Boolean(selectedParticipant);

  useEffect(() => {
    const audioConsent = sessionStorage.getItem("audioConsent");
    if (audioConsent === "true") {
      const audio = new Audio(isSelected ? "/selected.mp3" : "/rejected.mp3");
      audio.volume = 0.6;
      audio.play().catch((err) => console.error("Audio play failed:", err));
    }
  }, [isSelected]);

  useEffect(() => {
    if (!isLoading && isSelected) {
      const timer = setTimeout(() => setShowNote(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isSelected]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black font-press-start-2p text-white">
        <Image src={"/loading.png"} width={200} height={200} priority alt="loading"/>
        Loading members data...
      </div>
    );
  }

  if (isSelected) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-cover bg-center bg-black font-sans w-full min-h-screen">
        <main className="flex flex-1 w-full items-center justify-center p-4">
          <div className="flex flex-col gap-6 items-center p-10 rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-1000 ease-out fill-mode-both">
            <h1 className=" text-3xl text-center font-press-start-2p font-extrabold tracking-tight text-blue-500 drop-shadow-md">
              Congratulations!
            </h1>
            <div className="flex flex-col items-center gap-4 mt-3">
              <h2 className="text-base md:text-xl text-center font-press-start-2p font-semibold tracking-tight text-white drop-shadow-md">
                {selectedParticipant?.name}
              </h2>
              {selectedParticipant?.team && (
                <span className="text-xs md:text-xl font-press-start-2p tracking-widest text-cyan-300 drop-shadow-md">
                  {selectedParticipant.team} Team
                </span>
              )}
            </div>
            <div className="relative m-6 flex items-center justify-center">
              <div
                className="
                  absolute
                  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  h-32
                  w-[1000px]
                  bg-gradient-to-r
                  from-transparent
                  via-cyan-300/80
                  to-transparent
                  blur-2xl
                  z-0
                "
              />
              <Image
                src="/red.webp"
                alt="character"
                width={200}
                height={200}
                className="relative z-10 drop-shadow-2xl"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/")}
                className="mt-4 px-6 py-2 bg-black hover:bg-zinc-800 text-white font-bold rounded-lg transition-all shadow-md active:scale-95 border-2 border-[#2f3133]"
              >
                Go Back
              </button>
              <button
                onClick={() => setShowNote(true)}
                className="mt-4 px-6 py-2 bg-black hover:bg-zinc-800 text-white font-bold rounded-lg transition-all shadow-md active:scale-95 border-2 border-[#2f3133]"
              >
                Show Note
              </button>
            </div>
          </div>
        </main>

        {showNote && (
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 p-4"
            onClick={() => setShowNote(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md max-h-[80vh] flex flex-col rounded-2xl border-2 border-amber-400/40 bg-linear-to-b from-[#151007] to-[#0b0d10] shadow-md animate-in zoom-in-95 fade-in duration-300"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b-2 border-amber-400/30">
                <h3 className="font-press-start-2p text-xs md:text-sm text-amber-400">
                  A Note For You
                </h3>
                <button
                  onClick={() => setShowNote(false)}
                  className="text-white/70 hover:text-white font-press-start-2p text-xs px-2 py-1 rounded border border-amber-400/30 hover:bg-zinc-800 transition-all"
                >
                  X
                </button>
              </div>
              <div className="overflow-y-auto px-5 py-6">
                <p className="text-center text-2xl mb-3">🎉🏆🎉</p>
                <p className="text-xs md:text-sm font-press-start-2p text-amber-100 leading-loose">
                  Congratulations
                  {selectedParticipant?.name
                    ? `, ${selectedParticipant.name}`
                    : ""}
                  ! You have been selected for{" "}
                  {selectedParticipant?.team
                    ? ` ${selectedParticipant.team}`
                    : ""}{" "}
                  Team. Your dedication, skill, and persistence stood out among
                  many strong applicants. DevS rec is excited to welcome
                  you aboard. This is just the beginning, We can&apos;t wait to
                  build, ship, and grow together. Welcome to the crew!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Not Selected View (Among Us Eject Effect)
  return (
    <div className="relative flex flex-col items-center justify-center bg-black w-full min-h-screen overflow-hidden">
      <style>{`
        @keyframes float-eject {
          0% {
            transform: translate(-150vw, 20vh) rotate(0deg);
          }
          100% {
            transform: translate(150vw, -20vh) rotate(1080deg);
          }
        }
        .animate-eject {
          animation: float-eject 12s linear forwards;
        }
      `}</style>

      {/* Particles Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <Particles
          className=""
          particleColors={["#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      {/* Floating Character */}
      <div className="absolute top-1/2 left-1/2 w-32 h-32 animate-eject z-0 pointer-events-none">
        <Image
          src="/red.webp"
          alt="Ejected Character"
          width={128}
          height={128}
          className="drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        />
      </div>

      {/* Ejection Text */}
      <div className="z-10 flex flex-col items-center gap-12 animate-in fade-in duration-[2000ms] delay-500 fill-mode-both px-4 pointer-events-none">
        <TextType
          text={["You have not been selected for DevS Rec."]}
          className="text-lg md:text-2xl text-center font-press-start-2p text-white tracking-widest leading-loose drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          typingSpeed={75}
          pauseDuration={5000}
          showCursor
          cursorCharacter="_"
          deletingSpeed={50}
          variableSpeed={false}
          cursorBlinkDuration={0.5}
          onSentenceComplete={() => {}}
        />
        <div className="flex items-center gap-4 pointer-events-auto relative z-50">
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-2 bg-black hover:bg-zinc-800 text-white font-bold rounded-lg transition-all shadow-md active:scale-95 border-2 border-[#2f3133]"
          >
            Go Back
          </button>
          <button
            onClick={() => setShowNote(true)}
            className="mt-4 px-6 py-2 bg-black hover:bg-zinc-800 text-white font-bold rounded-lg transition-all shadow-md active:scale-95 border-2 border-[#2f3133]"
          >
            Show Note
          </button>
        </div>
      </div>

      {showNote && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4"
          onClick={() => setShowNote(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md max-h-[80vh] flex flex-col rounded-2xl border-2 border-[#2f3133] bg-[#0b0d10] shadow-md animate-in zoom-in-95 fade-in duration-300"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#2f3133]">
              <h3 className="font-press-start-2p text-xs md:text-sm text-white">
                Report
              </h3>
              <button
                onClick={() => setShowNote(false)}
                className="text-white/70 hover:text-white font-press-start-2p text-xs px-2 py-1 rounded border border-[#2f3133] hover:bg-zinc-800 transition-all"
              >
                X
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-5">
              <p className="text-xs md:text-sm font-press-start-2p text-zinc-300 leading-relaxed">
                Thank you for applying to DevS Rec. After careful review, you
                have not been selected as a DevS board member. We encourage you
                to apply again in future recruitment cycles.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black font-press-start-2p text-white">
          Loading...
        </div>
      }
    >
      <StatusContent />
    </Suspense>
  );
}
