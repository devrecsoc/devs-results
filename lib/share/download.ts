export function handleDownload(blob: Blob, fileName: string) {
  try {
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  } catch (err) {
    throw new Error("Oops, something went wrong", { cause: err });
  }
}
