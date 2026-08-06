// Platform share helpers.
//
// There is no single "share an image to Instagram/LinkedIn/WhatsApp" web
// API — each platform is different:
//   - The OS share sheet (Web Share API Level 2, `navigator.share` with
//     `files`) is the only mechanism that actually attaches a real image
//     file. Supported on Android Chrome and iOS Safari 15+, not on most
//     desktop browsers.
//   - WhatsApp's web intent (`wa.me`) is text/link only — no way to attach
//     an image via URL.
//   - LinkedIn's share-offsite intent is also link only — it scrapes Open
//     Graph tags from the shared URL, it does not accept a direct upload.
//   - Instagram has no public web share API at all. The only path from a
//     website is: download the image, open Instagram, attach manually.

export function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, { type: blob.type || "image/png" });
}

export function canNativeShare(file: File): boolean {
  if (
    typeof navigator === "undefined" ||
    !navigator.share ||
    !navigator.canShare
  ) {
    return false;
  }
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

/**
 * Opens the OS share sheet with the image attached. Resolves to `false` if
 * the user dismissed the sheet (not an error); rethrows anything else.
 */
export async function nativeShare(
  file: File,
  title: string,
  text: string,
): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) return false;
  try {
    await navigator.share({ files: [file], title, text });
    return true;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return false;
    throw err;
  }
}

export function buildWhatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function buildLinkedInShareUrl(url: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}
