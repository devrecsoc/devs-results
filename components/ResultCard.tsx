"use client";

import Image from "next/image";
import React, { ReactNode } from "react";
import { Share2 } from "lucide-react";

type ResultCardProps = {
  ref?: React.Ref<HTMLDivElement>;
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
  onShare?: () => void;
  isSharing?: boolean;
  showNote: boolean;
  onToggleNote: (show: boolean) => void;
  noteTitle: string;
  noteTitleClassName?: string;
  noteBorderClassName?: string;
  noteContent: ReactNode;
};

export default function ResultCard({
  ref,
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
  onShare,
  isSharing = false,
  showNote,
  onToggleNote,
  noteTitle,
  noteTitleClassName,
  noteBorderClassName,
  noteContent,
}: ResultCardProps) {
  const glowColor = glowClassName?.includes("red")
    ? "rgba(220, 38, 38, 0.8)"
    : "rgba(103, 232, 249, 0.8)";

  return (
    <div
      ref={ref}
      className="flex flex-col flex-1 items-center justify-center bg-cover bg-center bg-black font-sans w-full min-h-screen overflow-x-hidden"
    >
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
                <span className="text-white">DEVS&apos;26</span> - {team}
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
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 z-0 h-32 w-[90vw] max-w-[1000px] -translate-x-1/2 -translate-y-1/2"
              style={{
                background: `radial-gradient(ellipse at center, ${glowColor} 0%, ${glowColor.replace("0.8", "0.35")} 32%, transparent 72%)`,
              }}
            />
            <Image
              src={imageSrc}
              alt="character"
              width={200}
              height={200}
              className="relative z-10"
            />
          </div>
          <div
            data-capture-ignore="true"
            className="mt-4 flex flex-col flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
              <button
                onClick={onGoBack}
                className="px-3 sm:px-6 py-2 text-sm sm:text-base bg-black hover:bg-zinc-800 text-white font-bold rounded-lg transition-all shadow-md active:scale-95 border-2 border-[#2f3133]"
              >
                Go Back
              </button>
              {onNext && (
                <button
                  onClick={onNext}
                  className="px-3 sm:px-6 py-2 text-sm sm:text-base bg-black hover:bg-zinc-800 text-white font-bold rounded-lg transition-all shadow-md active:scale-95 border-2 border-[#2f3133]"
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

            <div>
              {onShare && (
                <button
                  onClick={onShare}
                  disabled={isSharing}
                  className="flex items-center gap-2 px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 disabled:hover:bg-cyan-700 text-white font-bold rounded-lg transition-all shadow-lg active:scale-95 border-2 border-[#2f3133]"
                >
                  <Share2 className="h-5 w-5 sm:h-6 sm:w-6" />
                  {isSharing ? "Capturing..." : "Share"}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {showNote && (
        <div
          data-capture-ignore="true"
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
