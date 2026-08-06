"use client";

import Image from "next/image";
import { ReactNode } from "react";

type ResultCardProps = {
  title: string;
  titleClassName?: string;
  name?: string;
  role?: string;
  team?: string;
  subtitle?: string;
  subtitleClassName?: string;
  imageSrc: string;
  glowClassName?: string;
  onGoBack: () => void;
  onNext?: () => void;
  showNote: boolean;
  onToggleNote: (show: boolean) => void;
  noteTitle: string;
  noteTitleClassName?: string;
  noteBorderClassName?: string;
  noteContent: ReactNode;
};

export default function ResultCard({
  title,
  titleClassName,
  name,
  role,
  team,
  subtitle,
  subtitleClassName,
  imageSrc,
  glowClassName,
  onGoBack,
  onNext,
  showNote,
  onToggleNote,
  noteTitle,
  noteTitleClassName,
  noteBorderClassName,
  noteContent,
}: ResultCardProps) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-cover bg-center bg-black font-sans w-full min-h-screen overflow-x-hidden">
      <main className="flex flex-1 w-full items-center justify-center p-4">
        <div className="flex flex-col gap-2 items-center px-6 py-8 sm:p-10 rounded-2xl shadow-2xl max-w-full w-full animate-in fade-in zoom-in-95 duration-1000 ease-out fill-mode-both">
          <h1
            className={`w-full max-w-full sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl overflow-hidden whitespace-nowrap text-center font-press-start-2p font-extrabold tracking-tight drop-shadow-md ${
              titleClassName ?? "text-blue-500"
            }`}
          >
            {title}
          </h1>
          <div className="flex flex-col items-center gap-2 mt-3">
            {name && (
              <h2 className="w-full text-yellow-300 flex flex-col gap-2 overflow-x-hidden sm:text-base text-md text-center font-press-start-2p font-semibold tracking-tight drop-shadow-md">
                {name}{" "}
                <span className="text-green-300">{role && `${role}`}</span>
              </h2>
            )}
            {team && (
              <span className="text-[10px] sm:text-sm md:text-xl w-full wrap-break-word text-center font-press-start-2p tracking-widest text-cyan-300 drop-shadow-md">
                <span className="text-white">DEVS'26</span> - {team}
              </span>
            )}
            {subtitle && (
              <span
                className={`text-[10px] sm:text-sm md:text-xl w-full wrap-break-word text-center font-press-start-2p tracking-widest drop-shadow-md ${
                  subtitleClassName ?? "text-cyan-300"
                }`}
              >
                {subtitle}
              </span>
            )}
          </div>
          <div className="relative m-6 flex items-center justify-center">
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-[90vw] max-w-[1000px] bg-gradient-to-r from-transparent to-transparent blur-2xl z-0 ${
                glowClassName ?? "via-cyan-300/80"
              }`}
            />
            <Image
              src={imageSrc}
              alt="character"
              width={200}
              height={200}
              className="relative z-10 drop-shadow-2xl"
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onGoBack}
              className="px-3 sm:px-6 py-2 text-sm sm:text-base bg-black hover:bg-zinc-800 text-white font-bold rounded-lg transition-all shadow-md active:scale-95 border-2 border-[#2f3133]"
            >
              Go Back
            </button>
            {onNext && (
              <button
                onClick={onNext}
                className="px-3 sm:px-6 py-2 text-sm sm:text-base bg-[#58646b] hover:bg-zinc-600 text-white font-bold rounded-lg transition-all shadow-md active:scale-95 border-2 border-[#2f3133]"
              >
                Next →
              </button>
            )}
            <button
              onClick={() => onToggleNote(true)}
              className="px-3 sm:px-6 py-2 text-sm sm:text-base bg-black hover:bg-zinc-800 text-white font-bold rounded-lg transition-all shadow-md active:scale-95 border-2 border-[#2f3133]"
            >
              Show Note
            </button>
          </div>
        </div>
      </main>

      {showNote && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 p-4"
          onClick={() => onToggleNote(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-sm sm:max-w-md max-h-[85vh] flex flex-col rounded-2xl border-2 bg-linear-to-b from-[#151007] to-[#0b0d10] shadow-md animate-in zoom-in-95 fade-in duration-300 ${
              noteBorderClassName ?? "border-amber-400/40"
            }`}
          >
            <div
              className={`flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b-2 ${
                noteBorderClassName ?? "border-amber-400/40"
              }`}
            >
              <h3
                className={`font-press-start-2p text-[10px] sm:text-xs md:text-sm ${
                  noteTitleClassName ?? "text-amber-400"
                }`}
              >
                {noteTitle}
              </h3>
              <button
                onClick={() => onToggleNote(false)}
                className="shrink-0 text-white/70 hover:text-white font-press-start-2p text-xs px-2 py-1 rounded border border-amber-400/30 hover:bg-zinc-800 transition-all"
              >
                X
              </button>
            </div>
            <div className="overflow-y-auto px-4 py-4 sm:px-5 sm:py-6">
              {noteContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
