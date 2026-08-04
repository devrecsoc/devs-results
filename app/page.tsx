"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Particles from "@/components/Particles";

export default function Home() {
  const [email, setEmail] = useState("");
  const [showConsent, setShowConsent] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  useEffect(() => {
    const consent = sessionStorage.getItem("audioConsent");
    if (!consent) {
      setShowConsent(true);
    } else if (consent === "true") {
      audioRef.current?.play().catch(e => console.error(e));
    }
  }, []);

  const handleConsent = (allow: boolean) => {
    sessionStorage.setItem("audioConsent", allow ? "true" : "false");
    setShowConsent(false);
    if (allow) {
      audioRef.current?.play().catch(e => console.error(e));
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!email) return;

      // Simply pass the data to the status route. Validation happens there.
      router.push(`/status?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="relative flex flex-col flex-1 items-center justify-center min-h-screen bg-black font-sans overflow-hidden">
      
      {showConsent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
          <div className="bg-[#576067] p-8 rounded-2xl shadow-2xl border-4 border-[#2f3133] flex flex-col items-center gap-8 max-w-sm animate-in zoom-in-95 duration-500 mx-4">
            <h2 className="text-white font-press-start-2p text-center leading-loose text-xs md:text-sm drop-shadow-md">
              Enable Sound Effects?
            </h2>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => handleConsent(true)}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 text-white font-press-start-2p text-xs rounded-lg border-2 border-green-400 transition-colors shadow-lg active:scale-95"
              >
                YES
              </button>
              <button 
                onClick={() => handleConsent(false)}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-press-start-2p text-xs rounded-lg border-2 border-red-400 transition-colors shadow-lg active:scale-95"
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes subtle-shake {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(3px, 2px) rotate(0.5deg); }
          50% { transform: translate(-2px, -3px) rotate(-0.5deg); }
          75% { transform: translate(-4px, 2px) rotate(0.2deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-subtle-shake {
          animation: subtle-shake 4s ease-in-out infinite;
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

      {/* Overlay Background Image */}
      <Image
        src="/bg%201.png"
        alt="Background"
        fill
        priority
        sizes="100vw"
        className="object-cover z-10 pointer-events-none animate-subtle-shake scale-[1.05]"
      />

      {/* Lobby Audio */}
      <audio ref={audioRef} src="/lobby.mp3" loop preload="auto" />

      {/* Mute Button */}
      <button 
        onClick={toggleMute} 
        className="absolute bottom-6 right-6 z-50 p-4 bg-[#576067]/80 backdrop-blur-md rounded-full border-2 border-[#2f3133] pointer-events-auto shadow-xl hover:bg-zinc-600 transition-all active:scale-95 text-xl"
        title="Toggle Sound"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      {/* View Lobby Button */}
      <button
        onClick={() => router.push("/results")}
        className="absolute bottom-6 left-6 z-50 px-4 py-3 bg-[#576067]/80 backdrop-blur-md rounded-full border-2 border-[#2f3133] pointer-events-auto shadow-xl hover:bg-zinc-600 transition-all active:scale-95 text-xs font-press-start-2p text-white"
        title="View Lobby"
      >
                View Lobby
      </button>

      <main className="relative z-20 flex flex-1 w-full items-center justify-center p-4 pointer-events-none">
        <div className="flex flex-col items-center gap-4 bg-[#576067] p-8 rounded-lg shadow-lg border-4 border-[#2f3133] pointer-events-auto">
          <h1 className="text-sm text-center font-press-start-2p font-extrabold tracking-tight text-white dark:text-zinc-100 sm:text-sm drop-shadow-md">
            Enter your Email:
          </h1>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="your.email@rajalakshmi.edu.in"
            className="w-full rounded-lg border border-zinc-300 bg-black px-4 py-2 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          /> 
          <button 
            onClick={() => router.push(`/status?email=${encodeURIComponent(email)}`)}
            className="mt-4 px-6 py-2 bg-black hover:bg-zinc-800 text-white font-bold rounded-lg transition-all shadow-md active:scale-95 border-2 border-[#2f3133]"
          >
            Check
          </button>
        </div>
      </main>
    </div>
  );
}
