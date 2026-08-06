import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Particles from "@/components/Particles";
import VotingResultsBoard from "@/components/VotingResultsBoard";
import { getParticipants, getCoreMembers } from "@/lib/participants";

export const metadata: Metadata = {
  title: "Selected Members | DEVS",
  description: "Results",
};

export default async function ResultsPage() {
  const [participants, coreMembers] = await Promise.all([
    getParticipants(),
    getCoreMembers(),
  ]);
  // Strip email before this reaches the client — the board only needs
  // name/regno/team/role, and email is PII we shouldn't ship to every visitor.
  const students = participants.map((p) => ({
    name: p.name,
    team: p.team,
    regno: p.regno,
    role: p.role,
  }));
  const coreLeads = coreMembers.map((m) => ({
    name: m.name,
    regno: m.regno,
    team: m.team,
    role: m.role,
  }));

  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-black p-4">
      <div className="absolute inset-0 z-0 h-full w-full pointer-events-auto">
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

      <Link
        href="/"
        className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#2f3133] bg-[#576067]/80 text-white backdrop-blur-md shadow-xl transition-all hover:bg-zinc-600 active:scale-95"
        title="Back to home"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <main className="relative z-10 flex w-full items-center justify-center">
        <VotingResultsBoard students={students} coreLeads={coreLeads} />
      </main>
    </div>
  );
}
