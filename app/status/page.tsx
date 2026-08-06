"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import Particles from "@/components/Particles";
import TextType from "@/components/TextType";
import ResultCard from "@/components/ResultCard";

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
        const coreResponse = await fetch(
          `/api/core?email=${encodeURIComponent(email)}`,
        );
        if (coreResponse.ok) {
          router.replace(`/imposter?email=${encodeURIComponent(email)}`);
          return;
        }

        const response = await fetch(
          `/api/participants?email=${encodeURIComponent(email)}`,
        );
        if (response.status === 404) {
          setSelectedParticipant(null);
          setIsLoading(false);
          return;
        }
        if (!response.ok) throw new Error("Failed to load participant");
        const data = await response.json();
        setSelectedParticipant(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load participant", error);
        setIsLoading(false);
      }
    };

    loadParticipant();
  }, [email, router]);

  const isSelected = Boolean(selectedParticipant);

  useEffect(() => {
    if (isLoading) return;

    const audio = new Audio(isSelected ? "/selected.mp3" : "/rejected.mp3");
    audio.volume = 0.6;
    audio.play().catch((error) => {
      console.error("Audio play failed:", error);
    });
  }, [isLoading, isSelected]);

  useEffect(() => {
    if (!isLoading && isSelected) {
      const timer = setTimeout(() => setShowNote(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isSelected]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black font-press-start-2p text-white">
        <Image
          src={"/loading-opt.webp"}
          width={200}
          height={200}
          priority
          alt="loading"
        />
        Loading members data...
      </div>
    );
  }

  if (isSelected) {
    return (
      <ResultCard
        title="Congratulations!"
        name={selectedParticipant?.name}
        subtitle={selectedParticipant?.team}
        imageSrc="/red.webp"
        onGoBack={() => router.push("/")}
        onNext={() =>
          router.push(
            `/team?email=${encodeURIComponent(selectedParticipant?.email ?? email)}`,
          )
        }
        showNote={showNote}
        onToggleNote={setShowNote}
        noteTitle="A Note For You"
        noteContent={
          <>
            <p className="text-center text-2xl mb-3">🎉🏆🎉</p>
            <p className="text-[10px] sm:text-xs md:text-sm font-press-start-2p text-amber-100 leading-loose">
              Congratulations
              {selectedParticipant?.name ? `, ${selectedParticipant.name}` : ""}
              ! You have been selected as a{" "}
              {selectedParticipant?.team ? ` ${selectedParticipant.team} ` : ""}
              Member at DEVS REC.Your dedication, skill and potential stood out
              throughout the selection process. We&apos;re excited to have you
              on the team and can&apos;t wait to create, collaborate, and grow
              together. Welcome aboard!
            </p>
          </>
        }
      />
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
          text={["You have not been selected for DEVS REC."]}
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
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pointer-events-auto relative z-50">
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 sm:px-6 py-2 bg-black hover:bg-zinc-800 text-white font-bold rounded-lg transition-all shadow-md active:scale-95 border-2 border-[#2f3133]"
          >
            Go Back
          </button>
          <button
            onClick={() => setShowNote(true)}
            className="mt-4 px-4 sm:px-6 py-2 bg-black hover:bg-zinc-800 text-white font-bold rounded-lg transition-all shadow-md active:scale-95 border-2 border-[#2f3133]"
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
            className="relative w-full max-w-sm sm:max-w-md max-h-[85vh] flex flex-col rounded-2xl border-2 border-[#2f3133] bg-[#0b0d10] shadow-md animate-in zoom-in-95 fade-in duration-300"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b-2 border-[#2f3133]">
              <h3 className="font-press-start-2p text-[10px] sm:text-xs md:text-sm text-white">
                Report
              </h3>
              <button
                onClick={() => setShowNote(false)}
                className="shrink-0 text-white/70 hover:text-white font-press-start-2p text-xs px-2 py-1 rounded border border-[#2f3133] hover:bg-zinc-800 transition-all"
              >
                X
              </button>
            </div>
            <div className="overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
              <p className="text-[10px] sm:text-xs md:text-sm font-press-start-2p text-zinc-300 leading-relaxed">
                Thank you for applying to DEVS REC. After careful review of your
                application, we regret to inform you that you have not been
                selected for the Board Member position. We sincerely appreciate
                your interest and hope to see you to participate in our upcoming
                events!
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
