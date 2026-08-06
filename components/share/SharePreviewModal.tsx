"use client";

import { useEffect, useMemo, useState } from "react";
import { Share2 } from "lucide-react";
import { handleDownload } from "@/lib/share/download";
import {
  blobToFile,
  buildLinkedInShareUrl,
  buildWhatsAppShareUrl,
  canNativeShare,
  nativeShare,
} from "@/lib/share/targets";

type SharePreviewModalProps = {
  open: boolean;
  onClose: () => void;
  imageBlob: Blob | null;
  fileName: string;
  isCapturing?: boolean;
  shareTitle?: string;
  shareText?: string;
};

export default function SharePreviewModal({
  open,
  onClose,
  imageBlob,
  fileName,
  isCapturing = false,
  shareTitle = "DEVS REC",
  shareText = "Check this out!",
}: SharePreviewModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  // Object URLs are an external resource (must be revoked on cleanup), so
  // deriving them at render time isn't an option — this has to live in an
  // effect, same as the Toaster's mount-detection effect.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!imageBlob) {
      setImageUrl(null);
      return;
    }

    const url = URL.createObjectURL(imageBlob);
    setImageUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [imageBlob]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const file = useMemo(
    () => (imageBlob ? blobToFile(imageBlob, fileName) : null),
    [imageBlob, fileName],
  );
  const supportsNativeShare = useMemo(
    () => (file ? canNativeShare(file) : false),
    [file],
  );

  if (!open) return null;

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const whatsappText = `${shareText} ${pageUrl}`.trim();

  const handleNativeShare = async () => {
    if (!file) return;
    setIsSharing(true);
    try {
      await nativeShare(file, shareTitle, shareText);
    } catch (error) {
      console.error("Native share failed", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm sm:max-w-md max-h-[85vh] flex flex-col rounded-2xl border-2 border-cyan-400/40 bg-linear-to-b from-[#151007] to-[#0b0d10] shadow-md animate-in zoom-in-95 fade-in duration-300"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b-2 border-cyan-400/40">
          <h3 className="font-press-start-2p text-[10px] sm:text-xs md:text-sm text-cyan-300">
            Share Your Moment
          </h3>
          <button
            onClick={onClose}
            className="shrink-0 text-white/70 hover:text-white font-press-start-2p text-xs px-2 py-1 rounded border border-cyan-400/30 hover:bg-zinc-800 transition-all"
          >
            X
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4 sm:px-5 sm:py-6 flex flex-col items-center gap-4">
          {isCapturing ? (
            <div className="flex h-48 w-full items-center justify-center font-press-start-2p text-[10px] text-white/70">
              CAPTURING...
            </div>
          ) : imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Captured result preview"
              className="w-full rounded-lg border-2 border-[#2f3133] object-contain"
            />
          ) : (
            <div className="flex h-48 w-full items-center justify-center font-press-start-2p text-[10px] text-red-400">
              Couldn&apos;t capture image.
            </div>
          )}

          {!isCapturing && imageUrl && (
            <div className="w-full rounded-lg border-2 border-dashed border-amber-400/50 bg-amber-400/10 px-3 py-3 text-center">
              <p className="font-press-start-2p text-[9px] sm:text-[10px] text-amber-300 leading-relaxed">
                📢 POST &amp; TAG US
              </p>
              <p className="mt-1 font-press-start-2p text-[8px] sm:text-[9px] text-amber-100/90 leading-relaxed">
                on LinkedIn &amp; Instagram — @devsrec
              </p>
            </div>
          )}

          {supportsNativeShare && (
            <button
              onClick={handleNativeShare}
              disabled={!file || isSharing}
              className="flex w-full items-center justify-center gap-2 px-3 sm:px-6 py-2 font-press-start-2p text-[10px] sm:text-xs bg-cyan-700 hover:bg-cyan-600 disabled:opacity-40 text-white font-bold rounded-lg transition-all shadow-md active:scale-95 border-2 border-[#2f3133]"
            >
              <Share2 className="h-3.5 w-3.5" />
              {isSharing ? "Opening..." : "Share"}
            </button>
          )}

          <div className="grid w-full grid-cols-3 gap-2">
            <a
              href={buildWhatsAppShareUrl(whatsappText)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 rounded-lg border-2 border-[#2f3133] bg-black px-2 py-3 text-center hover:bg-zinc-800 transition-all active:scale-95"
            >
              <span className="text-lg">💬</span>
              <span className="font-press-start-2p text-[7px] text-white">
                WhatsApp
              </span>
            </a>
            <a
              href={buildLinkedInShareUrl(pageUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 rounded-lg border-2 border-[#2f3133] bg-black px-2 py-3 text-center hover:bg-zinc-800 transition-all active:scale-95"
            >
              <span className="text-lg">💼</span>
              <span className="font-press-start-2p text-[7px] text-white">
                LinkedIn
              </span>
            </a>
            <button
              onClick={() => imageBlob && handleDownload(imageBlob, fileName)}
              disabled={!imageBlob}
              className="flex flex-col items-center gap-1 rounded-lg border-2 border-[#2f3133] bg-black px-2 py-3 text-center hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-black transition-all active:scale-95"
            >
              <span className="text-lg">📸</span>
              <span className="font-press-start-2p text-[7px] text-white">
                Instagram
              </span>
            </button>
          </div>
          {!supportsNativeShare && (
            <p className="text-center font-press-start-2p text-[7px] text-white/50 leading-relaxed">
              WhatsApp/LinkedIn open a share link here. Instagram has no web
              share, download the image, then post it from the app.
            </p>
          )}

          <button
            onClick={() => imageBlob && handleDownload(imageBlob, fileName)}
            disabled={!imageBlob}
            className="w-full px-3 sm:px-6 py-2 font-press-start-2p text-[10px] sm:text-xs bg-black hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-black text-white font-bold rounded-lg transition-all shadow-md active:scale-95 border-2 border-[#2f3133]"
          >
            Download Image
          </button>
        </div>
      </div>
    </div>
  );
}
