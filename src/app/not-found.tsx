import Link from "next/link";
import { Heart } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-[#fce7f3] border-[3px] border-black rounded-2xl flex items-center justify-center shadow-brutal mb-6 rotate-6">
        <Heart className="w-8 h-8 text-black" strokeWidth={2.5} />
      </div>
      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-3">404</h1>
      <p className="text-lg font-bold text-gray-500 mb-2">This invite doesn&apos;t exist.</p>
      <p className="text-sm text-gray-400 mb-8">Maybe the link expired, or the date already happened. 💌</p>
      <Link
        href="/"
        className="px-6 py-3 bg-black text-white font-black uppercase text-sm rounded-xl border-[3px] border-black shadow-brutal hover:-translate-y-0.5 transition-transform"
      >
        Plan a New Date
      </Link>
    </div>
  );
}
