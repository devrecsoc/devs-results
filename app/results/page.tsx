import type { Metadata } from "next";
import Particles from "@/components/Particles";
import VotingResultsBoard from "@/components/VotingResultsBoard";
import { getParticipants } from "@/lib/participants";

export const metadata: Metadata = {
  title: "Selected Members | DEVS",
  description: "Results",
};

export default async function ResultsPage() {
  const students = await getParticipants();

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

      <main className="relative z-10 flex w-full items-center justify-center">
        <VotingResultsBoard students={students} />
      </main>
    </div>
  );
}
