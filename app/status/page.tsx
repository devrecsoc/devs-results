"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import Particles from "@/components/Particles";
import TextType from "@/components/TextType";

type Participant = {
  email: string;
  name: string;
};

function StatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        const response = await fetch("/api/participants");
        if (!response.ok) throw new Error("Failed to load participants");
        const data = await response.json();
        setParticipants(data.participants || []);
      } catch (error) {
        console.error("Failed to load participants", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadParticipants();
  }, []);

  const normalizedEmail = email.trim().toLowerCase();
  const selectedParticipant = participants.find((participant) => participant.email === normalizedEmail);
  const isSelected = Boolean(selectedParticipant);

  useEffect(() => {
    const audioConsent = sessionStorage.getItem("audioConsent");
    if (audioConsent === "true") {
      const audio = new Audio(isSelected ? "/selected.mp3" : "/rejected.mp3");
      audio.volume = 0.6;
      audio.play().catch((err) => console.error("Audio play failed:", err));
    }
  }, [isSelected]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black font-press-start-2p text-white">
        Loading participant data...
      </div>
    );
  }

  if (isSelected) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-cover bg-center bg-black font-sans w-full min-h-screen">
        <main className="flex flex-1 w-full items-center justify-center p-4">
          <div className="flex flex-col items-center p-10 rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-1000 ease-out fill-mode-both">
            <h1 className=" text-2xl text-center font-press-start-2p font-extrabold tracking-tight text-blue-500 drop-shadow-md">
              Congratulations!
            </h1>
            <h2 className="text-sm text-center font-monospace font-thin tracking-tight text-white drop-shadow-md mt-2">
              {selectedParticipant?.name || "You are selected for the next Round"}
            </h2>
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
                "/>
              <Image
                src="/red.webp"
                alt="character"
                width={200}
                height={200}
                className="relative z-10 drop-shadow-2xl"
              />
            </div>
            <button 
              onClick={() => router.push("/")}
              className="mt-4 px-6 py-2 bg-black hover:bg-zinc-800 text-white font-bold rounded-lg transition-all shadow-md active:scale-95 border-2 border-[#2f3133]"
            >
              Go Back
            </button>
          </div>
        </main>
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
            text={["You are not selected for the next round."]}
            className="text-lg md:text-2xl text-center font-press-start-2p text-white tracking-widest leading-loose drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            typingSpeed={75}
            pauseDuration={5000}
            showCursor
            cursorCharacter="_"
            deletingSpeed={50}
            variableSpeedEnabled={false}
            variableSpeed={false}
            variableSpeedMin={60}
            variableSpeedMax={120}
            cursorBlinkDuration={0.5}
            onSentenceComplete={() => {}}
        />
        <button 
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-2 bg-black hover:bg-zinc-800 text-white font-bold rounded-lg transition-all shadow-md active:scale-95 border-2 border-[#2f3133] pointer-events-auto relative z-50"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-black font-press-start-2p text-white">Loading...</div>}>
      <StatusContent />
    </Suspense>
  );
}
