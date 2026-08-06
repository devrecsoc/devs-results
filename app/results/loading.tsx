import Image from "next/image";

export default function ResultsLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-press-start-2p text-white">
      <Image src="/loading-opt.webp" width={200} height={200} priority alt="loading" />
      Loading results...
    </div>
  );
}
