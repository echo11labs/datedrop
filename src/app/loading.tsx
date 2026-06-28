export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-[3px] border-black rounded-full border-t-transparent animate-spin" />
        <p className="font-black text-sm uppercase tracking-widest text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
