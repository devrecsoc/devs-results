"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ResultCard from "@/components/ResultCard";

type CoreMember = {
  email: string;
  name: string;
  role: string;
};

function ImposterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [member, setMember] = useState<CoreMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNote, setShowNote] = useState(false);

  useEffect(() => {
    if (!email.trim()) {
      router.replace("/");
      return;
    }

    const loadMember = async () => {
      try {
        const response = await fetch(
          `/api/core?email=${encodeURIComponent(email)}`,
        );
        if (response.status === 404) {
          router.replace(`/status?email=${encodeURIComponent(email)}`);
          return;
        }
        if (!response.ok) throw new Error("Failed to load core member");
        const data = await response.json();
        setMember(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load core member", error);
        setIsLoading(false);
      }
    };

    loadMember();
  }, [email, router]);

  useEffect(() => {
    if (isLoading || !member) return;

    const audio = new Audio("/impostor.mp3");
    audio.volume = 0.6;
    audio.play().catch((error) => {
      console.error("Audio play failed:", error);
    });
  }, [isLoading, member]);

  useEffect(() => {
    if (!isLoading && member) {
      const timer = setTimeout(() => setShowNote(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, member]);

  if (isLoading || !member) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black font-press-start-2p text-white">
        Loading members data...
      </div>
    );
  }

  return (
    <ResultCard
      title="IMPOSTER"
      titleClassName="text-4xl md:text-5xl text-red-600"
      name={member.name}
      role={member.role}
      subtitle="You belong to DEVS core"
      subtitleClassName="text-red-400"
      imageSrc="/red.webp"
      glowClassName="via-red-600/80"
      onGoBack={() => router.push("/")}
      showNote={showNote}
      onToggleNote={setShowNote}
      noteTitle="A Note For You"
      noteTitleClassName="text-red-400"
      noteBorderClassName="border-red-500/40"
      noteContent={
        <>
          <p className="text-center text-2xl mb-3">🔪🕵️🔪</p>
          <p className="text-[10px] sm:text-xs md:text-sm font-press-start-2p text-red-100 leading-loose">
            Busted, {member.name}. DEVS Tech team built an entire
            &quot;selection results&quot; page just to catch core members
            snooping their own portal for imposters among the imposters. Anyway,
            yes, you are core, yes, everyone already knew, and no, this page did
            not need three months of &quot;strategic planning meetings&quot; to
            ship. Go back to actually doing the work now.
          </p>
        </>
      }
    />
  );
}

export default function ImposterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black font-press-start-2p text-white">
          Loading...
        </div>
      }
    >
      <ImposterContent />
    </Suspense>
  );
}
