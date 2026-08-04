"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type ToastType = "success" | "error" | "info";

export type ToastState = {
  message: string;
  type: ToastType;
} | null;

const TYPE_STYLES: Record<ToastType, { border: string; icon: string }> = {
  success: { border: "border-green-400", icon: "✅" },
  error: { border: "border-red-400", icon: "⚠️" },
  info: { border: "border-blue-400", icon: "ℹ️" },
};

export function Toaster({
  toast,
  onClose,
  duration = 3000,
}: {
  toast: ToastState;
  onClose: () => void;
  duration?: number;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [toast, duration, onClose]);

  if (!mounted) return null;

  const styles = toast ? TYPE_STYLES[toast.type] : null;

  return createPortal(
    <div className="pointer-events-none fixed top-0 inset-x-0 z-[200] flex justify-center pt-6 px-4">
      {toast && styles && (
        <div
          role="alert"
          className={`pointer-events-auto flex items-center gap-3 max-w-sm w-full sm:w-auto bg-[#576067] border-2 ${styles.border} rounded-lg shadow-2xl px-4 py-3 animate-in slide-in-from-top-8 fade-in duration-300`}
        >
          <span className="text-lg">{styles.icon}</span>
          <p className="text-white font-press-start-2p text-[10px] leading-relaxed">
            {toast.message}
          </p>
        </div>
      )}
    </div>,
    document.body
  );
}
