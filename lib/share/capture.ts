import { toBlob } from "html-to-image";

const IMAGE_LOAD_TIMEOUT_MS = 8000;

function waitForImage(img: HTMLImageElement): Promise<void> {
  if (img.complete && img.naturalWidth > 0) return Promise.resolve();

  return new Promise((resolve) => {
    const done = () => {
      img.removeEventListener("load", done);
      img.removeEventListener("error", done);
      clearTimeout(timer);
      resolve();
    };
    // A stuck/broken image shouldn't hang the whole capture — give up on
    // it after a timeout and capture whatever state it's in.
    const timer = setTimeout(done, IMAGE_LOAD_TIMEOUT_MS);
    img.addEventListener("load", done);
    img.addEventListener("error", done);
  });
}

// html-to-image serializes whatever DOM state exists right now. Lazily
// loaded <img>s that haven't been scrolled into view yet, or the pixel
// webfont still swapping in, would otherwise get captured mid-load —
// waiting for both here is what makes the screenshot match what's on
// screen instead of a half-loaded snapshot.
async function waitForElementReady(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(images.map(waitForImage));

  if (typeof document !== "undefined" && document.fonts?.ready) {
    await document.fonts.ready;
  }
}

export async function captureElement(element: HTMLElement): Promise<Blob | null> {
  if (!element) throw new Error("No element present");

  try {
    await waitForElementReady(element);

    const blob = await toBlob(element, {
      cacheBust: true,
      quality: 1,
      // Keep transparent assets transparent in the exported PNG instead of
      // letting the renderer fill their canvas with black.
      backgroundColor: "transparent",
      pixelRatio:
        typeof window !== "undefined" ? Math.max(window.devicePixelRatio, 1) : 1,
      // The live card animates in, but the exported image should represent its
      // settled state and must not rasterize an intermediate transform/filter.
      style: {
        animation: "none",
        transition: "none",
        transform: "none",
        opacity: "1",
      },
    });

    return blob;
  } catch (err) {
    throw new Error("Oops, something went wrong!", { cause: err });
  }
}
