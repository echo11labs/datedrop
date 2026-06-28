"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Calendar as CalendarIcon,
  Clock,
  Coffee,
  Utensils,
  Heart,
  PartyPopper,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  IceCream,
  Sandwich,
  Salad,
  Pizza,
  Cake,
  Beef,
  Film,
  TreePine,
  Target,
  Bike,
  Music,
  Sparkles,
  Star,
  Camera,
  Send,
  Download,
  Share2,
  X,
  PenLine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BrutalTimePicker } from "@/components/ui/brutal-time-picker";
import html2canvas from "html2canvas";
import { copyToClipboard } from "@/lib/utils";

/* ─────────────────────────────────────
   CONSTANTS & DATA
───────────────────────────────────── */
const FOODS = [
  {
    id: "italian",
    label: "Italian",
    bg: "bg-[#fef9c3]",
    icon: Pizza,
    desc: "Great for a first date",
  },
  {
    id: "japanese",
    label: "Japanese",
    bg: "bg-[#e0f2fe]",
    icon: Utensils,
    desc: "Elegant & adventurous",
  },
  {
    id: "steak",
    label: "Steakhouse",
    bg: "bg-[#fce7f3]",
    icon: Beef,
    desc: "Classic & impressive",
  },
  {
    id: "mexican",
    label: "Mexican",
    bg: "bg-[#ffedd5]",
    icon: Sandwich,
    desc: "Relaxed & fun",
  },
  {
    id: "salad",
    label: "Healthy Bowls",
    bg: "bg-[#dcfce7]",
    icon: Salad,
    desc: "Light & energetic",
  },
  {
    id: "dessert",
    label: "Dessert",
    bg: "bg-[#f3e8ff]",
    icon: Cake,
    desc: "Sweet & playful",
  },
  {
    id: "coffee",
    label: "Coffee & Chill",
    bg: "bg-white",
    icon: Coffee,
    desc: "Low-key & cozy",
  },
  {
    id: "icecream",
    label: "Ice Cream",
    bg: "bg-[#e0f2fe]",
    icon: IceCream,
    desc: "Fun & nostalgic",
  },
];

const VIBES = [
  {
    id: "movie",
    label: "Movie Night",
    bg: "bg-[#fce7f3]",
    icon: Film,
    desc: "Cozy side-by-side",
  },
  {
    id: "park",
    label: "Park Walk",
    bg: "bg-[#dcfce7]",
    icon: TreePine,
    desc: "Relaxed & romantic",
  },
  {
    id: "bowling",
    label: "Bowling",
    bg: "bg-[#e0f2fe]",
    icon: Target,
    desc: "Playful competition",
  },
  {
    id: "concert",
    label: "Live Music",
    bg: "bg-[#f3e8ff]",
    icon: Music,
    desc: "Shared experience",
  },
  {
    id: "cycling",
    label: "Bike Ride",
    bg: "bg-[#fef9c3]",
    icon: Bike,
    desc: "Active & fun",
  },
  {
    id: "picnic",
    label: "Picnic",
    bg: "bg-[#ffedd5]",
    icon: Sparkles,
    desc: "Dreamy & intimate",
  },
  {
    id: "stargazing",
    label: "Stargazing",
    bg: "bg-white",
    icon: Star,
    desc: "Magical & memorable",
  },
  {
    id: "photos",
    label: "Photo Walk",
    bg: "bg-[#fce7f3]",
    icon: Camera,
    desc: "Creative & playful",
  },
];

const TIMES = [
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
];

/* ─────────────────────────────────────
   HELPERS
───────────────────────────────────── */
function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getNextWeekDays() {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const d = addDays(today, i);
    return {
      dateObj: d,
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      dateNum: d.getDate(),
      fullVal: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      isToday: i === 0,
    };
  });
}

function getCalendarUrl(
  date: string,
  time: string,
  food: string,
  vibe: string,
  senderName: string,
) {
  try {
    const dt = new Date(
      `${date}T${(() => {
        const [t, period] = time.split(" ");
        const [h, m] = t.split(":");
        let hour = parseInt(h);
        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;
        return `${String(hour).padStart(2, "0")}:${m}:00`;
      })()}`,
    );
    const end = new Date(dt.getTime() + 3 * 60 * 60 * 1000);
    const fmt = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const title = encodeURIComponent(
      `Date with ${senderName} — ${food || vibe || "Special Date"}`,
    );
    const details = encodeURIComponent(
      `${food ? `Dinner: ${food}` : ""}${food && vibe ? "\n" : ""}${vibe ? `Activity: ${vibe}` : ""}\n\nPlanned with DateDrop ❤️`,
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(dt)}/${fmt(end)}&details=${details}`;
  } catch {
    return null;
  }
}

type InvitePayload = {
  s?: string;
  r?: string;
  d?: string;
  t?: string;
  f?: string;
  v?: string;
  a?: string;
  sg?: string;
  rg?: string;
};

function encodeInvitePayload(payload: InvitePayload) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeInvitePayload(hash: string): InvitePayload {
  const binary = atob(hash);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as InvitePayload;
}

/* ─────────────────────────────────────
   CONFETTI
───────────────────────────────────── */
function Confetti() {
  const colors = [
    "#E11D48",
    "#FB7185",
    "#fef9c3",
    "#dcfce7",
    "#e0f2fe",
    "#f3e8ff",
    "#ffedd5",
    "#111111",
  ];
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 2 + Math.random() * 2,
    size: 6 + Math.random() * 10,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            rotate: p.rotation,
          }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [
              p.rotation,
              p.rotation + 360 * (Math.random() > 0.5 ? 1 : -1),
            ],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────
   RUNAWAY NO BUTTON
───────────────────────────────────── */
function RunawayNoButton({ onGiveUp }: { onGiveUp: () => void }) {
  const [attempts, setAttempts] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [surrendered, setSurrendered] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const flee = useCallback(() => {
    if (attempts >= 3) {
      setSurrendered(true);
      setTimeout(onGiveUp, 1200);
      return;
    }
    setAttempts((a) => a + 1);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxX = Math.min(vw * 0.3, 180);
    const maxY = Math.min(vh * 0.25, 120);
    setPos({
      x: (Math.random() - 0.5) * 2 * maxX,
      y: (Math.random() - 0.5) * 2 * maxY,
    });
  }, [attempts, onGiveUp]);

  const messages = ["", "Hey—!", "Stop it!", "Fine... 😤"];

  if (surrendered) {
    return (
      <motion.p
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-sm font-bold text-gray-400 text-center py-3"
      >
        Fine... but you&apos;re missing out 😤
      </motion.p>
    );
  }

  return (
    <div className="relative flex justify-center" style={{ height: 52 }}>
      <motion.button
        ref={btnRef}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onMouseEnter={flee}
        onTouchStart={flee}
        onClick={flee}
        className="absolute py-3 px-6 bg-white text-gray-500 font-bold text-sm uppercase rounded-2xl border-[2px] border-gray-200 hover:border-gray-300 transition-colors cursor-pointer select-none"
        style={{ fontSize: attempts >= 2 ? "11px" : undefined }}
      >
        {attempts > 0 ? messages[Math.min(attempts, 3)] : "Not this time"}
      </motion.button>
    </div>
  );
}

/* ─────────────────────────────────────
   RECEIVER REVEAL SCREENS
───────────────────────────────────── */
type RevealPhase =
  "name" | "thinking" | "question" | "plan" | "accept" | "celebration";

function ReceiverRevealFlow({
  senderName,
  receiverName,
  date,
  time,
  food,
  vibe,
  planId,
  accepted: initialAccepted,
  summaryCardRef,
  screenshotBusy,
  downloadScreenshot,
}: {
  senderName: string;
  receiverName: string;
  date: string;
  time: string;
  food: string;
  vibe: string;
  planId: string;
  accepted: boolean;
  summaryCardRef: React.RefObject<HTMLDivElement | null>;
  screenshotBusy: boolean;
  downloadScreenshot: () => void;
}) {
  const [phase, setPhase] = useState<RevealPhase>(
    initialAccepted ? "celebration" : "name",
  );
  const [showConfetti, setShowConfetti] = useState(initialAccepted);
  const [planStep, setPlanStep] = useState(0);

  const advance = () => {
    setPhase((p) => {
      if (p === "name") return "thinking";
      if (p === "thinking") return "question";
      if (p === "question") return "plan";
      if (p === "plan") return "accept";
      return p;
    });
  };

  const handleAccept = () => {
    if (planId) {
      fetch(`/api/plans/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted: true }),
      }).catch((e) => console.error("Failed to update plan", e));
    }
    setShowConfetti(true);
    setPhase("celebration");
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const calUrl =
    date && time ? getCalendarUrl(date, time, food, vibe, senderName) : null;

  const planDetails = [
    date
      ? {
          label: "When",
          value: new Date(date + "T12:00:00").toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          }),
          sub: time,
          icon: CalendarIcon,
          bg: "bg-[#dcfce7]",
        }
      : null,
    food
      ? {
          label: "We're eating",
          value: food,
          icon: Utensils,
          bg: "bg-[#fef9c3]",
        }
      : null,
    vibe
      ? { label: "Activity", value: vibe, icon: Star, bg: "bg-[#f3e8ff]" }
      : null,
  ].filter(Boolean) as {
    label: string;
    value: string;
    sub?: string;
    icon: LucideIcon;
    bg: string;
  }[];

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col items-center justify-center relative overflow-hidden">
      {showConfetti && <Confetti />}

      {/* Subtle background hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04]">
        {[...Array(12)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-rose-500"
            fill="currentColor"
            style={{
              left: `${(i * 17 + 5) % 100}%`,
              top: `${(i * 23 + 10) % 100}%`,
              width: 20 + (i % 3) * 16,
              height: 20 + (i % 3) * 16,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* PHASE 1: Just the name */}
        {phase === "name" && (
          <motion.div
            key="name"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center px-6 gap-8"
            onClick={advance}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-16 h-16 bg-[#fce7f3] border-[3px] border-black rounded-full flex items-center justify-center shadow-brutal"
            >
              <Heart
                className="w-8 h-8 text-rose-500"
                fill="currentColor"
                strokeWidth={0}
              />
            </motion.div>

            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm font-bold uppercase tracking-[0.25em] text-gray-400 mb-3"
              >
                A message for
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
                style={{ fontFamily: "var(--font-fredoka, var(--font-inter))" }}
              >
                {receiverName || "You"}
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-2 text-sm font-bold text-gray-400 animate-pulse"
            >
              Tap to continue <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.div>
        )}

        {/* PHASE 2: Someone's been thinking about you */}
        {phase === "thinking" && (
          <motion.div
            key="thinking"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center px-6 gap-8 max-w-sm"
            onClick={advance}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-3xl md:text-4xl font-black leading-tight tracking-tight"
            >
              Someone&apos;s been thinking about you.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="text-xl font-bold text-gray-500"
            >
              — {senderName}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="flex items-center gap-2 text-sm font-bold text-gray-400 animate-pulse"
            >
              Tap to continue <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.div>
        )}

        {/* PHASE 3: THE QUESTION — full screen dramatic */}
        {phase === "question" && (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center px-6 gap-10 max-w-md w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            >
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-rose-400 mb-4">
                {senderName} wants to know
              </p>
              <h1
                className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-2"
                style={{ fontFamily: "var(--font-fredoka, var(--font-inter))" }}
              >
                Will you go on a date with me?
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex flex-col gap-4 w-full max-w-xs"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={advance}
                className="w-full py-4 bg-black text-white font-black text-lg uppercase rounded-2xl border-[3px] border-black shadow-brutal transition-shadow hover:shadow-brutal-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart
                  className="w-5 h-5"
                  fill="currentColor"
                  strokeWidth={0}
                />
                Yes! Show me the plan
              </motion.button>

              <RunawayNoButton onGiveUp={advance} />
            </motion.div>
          </motion.div>
        )}

        {/* PHASE 4: THE PLAN REVEAL — one detail at a time */}
        {phase === "plan" && (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center px-6 gap-6 w-full max-w-sm"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-rose-400 mb-2">
                Here&apos;s what {senderName} planned
              </p>
              <h2 className="text-3xl font-black tracking-tight">for us 🗓️</h2>
            </motion.div>

            <div className="flex flex-col gap-3 w-full">
              {planDetails.map((detail, i) => {
                const Icon = detail.icon;
                return (
                  <motion.div
                    key={detail.label}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: planStep >= i ? 1 : 0.15, x: 0 }}
                    transition={{ delay: i * 0.35 + 0.3, duration: 0.5 }}
                    className="flex items-center gap-4 bg-white border-[3px] border-black rounded-2xl p-4 shadow-brutal"
                  >
                    <div
                      className={`w-12 h-12 ${detail.bg} border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        {detail.label}
                      </p>
                      <p className="font-black text-base leading-tight">
                        {detail.value}
                      </p>
                      {detail.sub && (
                        <p className="text-sm text-gray-500 font-bold mt-0.5">
                          {detail.sub}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: planDetails.length * 0.35 + 0.8 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (planStep < planDetails.length - 1) {
                  setPlanStep((s) => s + 1);
                } else {
                  setPhase("accept");
                }
              }}
              className="w-full py-4 bg-black text-white font-black text-base uppercase rounded-2xl border-[3px] border-black shadow-brutal flex items-center justify-center gap-2 cursor-pointer"
            >
              {planStep < planDetails.length - 1 ? "See more" : "Continue"}
              <ArrowRight className="w-5 h-5" strokeWidth={3} />
            </motion.button>
          </motion.div>
        )}

        {/* PHASE 5: ACCEPT */}
        {phase === "accept" && (
          <motion.div
            key="accept"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center px-6 gap-6 w-full max-w-sm"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-rose-400 mb-3">
                {senderName} is waiting
              </p>
              <h2 className="text-4xl font-black tracking-tighter leading-none">
                So, are you in?
              </h2>
            </motion.div>

            {/* Summary card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              ref={summaryCardRef}
              className="w-full rounded-3xl overflow-hidden border-[3px] border-black shadow-brutal"
              style={{
                background:
                  "linear-gradient(165deg, #fff1f2 0%, #ffe4e6 40%, #fecdd3 100%)",
              }}
            >
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
                      <Heart
                        className="w-3.5 h-3.5 text-white"
                        fill="currentColor"
                        strokeWidth={0}
                      />
                    </div>
                    <span className="font-black text-sm uppercase tracking-tight">
                      DateDrop
                    </span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">
                    Date Plan
                  </span>
                </div>
                <div className="text-center mb-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40 mb-2">
                    A date between
                  </p>
                  <p className="text-2xl font-black uppercase tracking-tight leading-none">
                    {senderName}
                  </p>
                  <div className="flex items-center justify-center gap-3 my-2">
                    <div className="h-[2px] w-8 bg-black/20 rounded-full" />
                    <Heart
                      className="w-4 h-4 text-rose-400"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                    <div className="h-[2px] w-8 bg-black/20 rounded-full" />
                  </div>
                  <p className="text-2xl font-black uppercase tracking-tight leading-none">
                    {receiverName}
                  </p>
                </div>
              </div>
              <div className="mx-4 mb-4 bg-white rounded-2xl border-[2px] border-black p-4 space-y-3">
                {date && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#dcfce7] border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0">
                      <CalendarIcon className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/40">
                        When
                      </p>
                      <p className="text-sm font-black leading-tight">
                        {new Date(date + "T12:00:00").toLocaleDateString(
                          "en-US",
                          { weekday: "long", month: "long", day: "numeric" },
                        )}
                      </p>
                      {time && (
                        <p className="text-xs font-bold text-black/50">
                          {time}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {food && (
                  <>
                    <div className="h-[1px] bg-black/5" />
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#fef9c3] border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0">
                        <Utensils className="w-4 h-4" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/40">
                          Eating
                        </p>
                        <p className="text-sm font-black">{food}</p>
                      </div>
                    </div>
                  </>
                )}
                {vibe && (
                  <>
                    <div className="h-[1px] bg-black/5" />
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#e0f2fe] border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0">
                        <Star className="w-4 h-4" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/40">
                          Activity
                        </p>
                        <p className="text-sm font-black">{vibe}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="px-5 pb-4 text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
                  Made with DateDrop
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-3 w-full"
            >
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAccept}
                className="w-full py-4 bg-black text-white font-black text-lg uppercase rounded-2xl border-[3px] border-black shadow-brutal flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-5 h-5" strokeWidth={4} />
                I&apos;m in! Let&apos;s do this
              </motion.button>
              <RunawayNoButton onGiveUp={() => {}} />
            </motion.div>
          </motion.div>
        )}

        {/* PHASE 6: CELEBRATION */}
        {phase === "celebration" && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center px-6 gap-6 w-full max-w-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 15,
              }}
              className="w-20 h-20 bg-[#dcfce7] border-[3px] border-black rounded-full flex items-center justify-center shadow-brutal"
            >
              <PartyPopper className="w-10 h-10" strokeWidth={2} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1
                className="text-5xl font-black tracking-tighter leading-none mb-2"
                style={{ fontFamily: "var(--font-fredoka, var(--font-inter))" }}
              >
                It&apos;s a Date!
              </h1>
              <p className="text-base font-bold text-gray-500">
                You just made {senderName}&apos;s day 💛
              </p>
            </motion.div>

            {date && time && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="w-full bg-white border-[3px] border-black rounded-2xl p-4 shadow-brutal flex items-center gap-3"
              >
                <div className="w-11 h-11 bg-[#dcfce7] border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <CalendarIcon className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Locked in
                  </p>
                  <p className="font-black text-sm leading-tight">
                    {new Date(date + "T12:00:00").toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs font-bold text-gray-500">{time}</p>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="flex flex-col gap-3 w-full"
            >
              {calUrl && (
                <a
                  href={calUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-black text-white font-black text-sm uppercase rounded-2xl border-[3px] border-black shadow-brutal hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2"
                >
                  <CalendarIcon className="w-4 h-4" strokeWidth={2.5} />
                  Add to Calendar
                </a>
              )}
              <button
                onClick={downloadScreenshot}
                disabled={screenshotBusy}
                className="w-full py-3.5 bg-white text-black font-black text-sm uppercase rounded-2xl border-[3px] border-black shadow-brutal hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {screenshotBusy ? "Saving..." : "Save the Invite Card"}
                <Download className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              href="/games"
              className="text-sm font-bold text-gray-400 underline underline-offset-4 hover:text-black transition-colors"
            >
              Play games together while you wait →
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────
   CREATOR COMPONENTS
───────────────────────────────────── */
/* ── Gender Symbol SVGs (Mars ♂ / Venus ♀ / Transgender ⚧) ─────────── */
// These use the canonical gender symbol geometry: circle + directional stem
// Same proportions as Unicode ♂ ♀ ⚧ but hand-tuned for visual weight at 64px

function SymbolMale({ color }: { color: string }) {
  // Mars symbol: circle + arrow pointing upper-right
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <circle
        cx="26"
        cy="38"
        r="17"
        stroke={color}
        strokeWidth="5"
        fill="none"
      />
      <line
        x1="38"
        y1="26"
        x2="56"
        y2="8"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <polyline
        points="44,8 56,8 56,20"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function SymbolFemale({ color }: { color: string }) {
  // Venus symbol: circle + cross pointing down
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <circle
        cx="32"
        cy="24"
        r="17"
        stroke={color}
        strokeWidth="5"
        fill="none"
      />
      <line
        x1="32"
        y1="41"
        x2="32"
        y2="59"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="22"
        y1="52"
        x2="42"
        y2="52"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SymbolOther({ color }: { color: string }) {
  // Transgender symbol: circle + arrow up-right + cross down + small arrow up
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <circle
        cx="32"
        cy="32"
        r="14"
        stroke={color}
        strokeWidth="4.5"
        fill="none"
      />
      {/* Mars arrow upper-right */}
      <line
        x1="41"
        y1="23"
        x2="55"
        y2="9"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <polyline
        points="48,9 55,9 55,16"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Venus cross lower */}
      <line
        x1="32"
        y1="46"
        x2="32"
        y2="58"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <line
        x1="25"
        y1="53"
        x2="39"
        y2="53"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* Non-binary arrow straight up */}
      <line
        x1="23"
        y1="23"
        x2="11"
        y2="11"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <polyline
        points="11,18 11,11 18,11"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// Placeholder — replaced below, kept so no parse error
function GenderPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const options = [
    {
      id: "male",
      title: "Man",
      pronoun: "He / Him",
      Symbol: SymbolMale,
      idleColor: "#2563EB",
      idleBg: "#EFF6FF",
      selectedColor: "#fff",
      selectedBg: "#2563EB",
      selectedBorder: "#1D4ED8",
    },
    {
      id: "female",
      title: "Woman",
      pronoun: "She / Her",
      Symbol: SymbolFemale,
      idleColor: "#DB2777",
      idleBg: "#FDF2F8",
      selectedColor: "#fff",
      selectedBg: "#DB2777",
      selectedBorder: "#BE185D",
    },
    {
      id: "other",
      title: "Non-binary",
      pronoun: "They / Them",
      Symbol: SymbolOther,
      idleColor: "#7C3AED",
      idleBg: "#F5F3FF",
      selectedColor: "#fff",
      selectedBg: "#7C3AED",
      selectedBorder: "#6D28D9",
    },
  ];

  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-3">
        {label}
      </p>

      <div className="flex gap-2.5">
        {options.map((opt) => {
          const sel = value === opt.id;
          return (
            <motion.button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              whileHover={!sel ? { y: -3 } : {}}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              className="flex-1 flex flex-col items-center gap-3 py-5 px-2 rounded-2xl border-[3px] cursor-pointer select-none relative overflow-hidden"
              style={{
                background: sel ? opt.selectedBg : opt.idleBg,
                borderColor: sel ? opt.selectedBorder : "transparent",
                boxShadow: sel
                  ? `0 6px 20px ${opt.selectedBg}55, 0 2px 8px ${opt.selectedBg}33`
                  : "0 2px 8px rgba(0,0,0,0.06)",
                outline: "none",
              }}
            >
              {/* Subtle radial glow behind symbol when selected */}
              {sel && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 50% 40%, ${opt.selectedColor}22 0%, transparent 70%)`,
                  }}
                />
              )}

              {/* Symbol */}
              <div className="w-10 h-10 relative z-10">
                <opt.Symbol color={sel ? opt.selectedColor : opt.idleColor} />
              </div>

              {/* Text */}
              <div className="flex flex-col items-center gap-0.5 relative z-10">
                <span
                  className="font-black text-xs uppercase tracking-wider leading-none"
                  style={{ color: sel ? "#fff" : "#111" }}
                >
                  {opt.title}
                </span>
                <span
                  className="text-[9px] font-bold leading-none"
                  style={{ color: sel ? "rgba(255,255,255,0.75)" : "#9CA3AF" }}
                >
                  {opt.pronoun}
                </span>
              </div>

              {/* Selected checkmark dot */}
              <AnimatePresence>
                {sel && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/30 flex items-center justify-center"
                  >
                    <Check
                      className="w-3 h-3"
                      style={{ color: opt.selectedColor }}
                      strokeWidth={3.5}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function BentoCard({
  label,
  icon: Icon,
  bg,
  selected,
  onClick,
  readOnly,
  desc,
}: {
  label: string;
  icon: LucideIcon;
  bg: string;
  selected: boolean;
  onClick?: () => void;
  readOnly?: boolean;
  desc?: string;
}) {
  return (
    <motion.div
      onClick={!readOnly ? onClick : undefined}
      whileHover={!readOnly ? { y: -3 } : {}}
      whileTap={!readOnly ? { scale: 0.97 } : {}}
      className={`bento-card ${bg} ${selected ? "selected" : ""} border-black rounded-2xl transition-shadow ${readOnly ? "cursor-default pointer-events-none" : "cursor-pointer"}`}
      style={{ minHeight: "120px" }}
    >
      <span className="font-black text-sm text-center w-full mt-1.5 leading-tight uppercase">
        {label}
      </span>
      <div className="flex-1 flex items-center justify-center py-2">
        <Icon className="w-9 h-9 text-black opacity-90" strokeWidth={2} />
      </div>
      {desc && (
        <span className="text-[9px] font-bold text-black/40 text-center w-full leading-tight mb-1">
          {desc}
        </span>
      )}
      <div
        className={`check-indicator absolute bottom-2 right-2 ${readOnly ? "opacity-50" : ""}`}
      >
        <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />
      </div>
    </motion.div>
  );
}

function CustomBentoCard({
  value,
  onChange,
  onSelect,
  selected,
  placeholder,
  bg,
}: {
  value: string;
  onChange: (v: string) => void;
  onSelect: (v: string) => void;
  selected: boolean;
  placeholder: string;
  bg: string;
}) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleConfirm = () => {
    if (value.trim()) {
      onSelect(value.trim());
    }
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <motion.div
      whileHover={!open ? { y: -3 } : {}}
      whileTap={!open ? { scale: 0.97 } : {}}
      className={`bento-card ${
        selected && !open ? "selected" : ""
      } ${bg} border-black rounded-2xl transition-shadow cursor-pointer`}
      style={{ minHeight: "120px" }}
      onClick={!open ? handleOpen : undefined}
    >
      {!open ? (
        // Collapsed — show icon + label
        <>
          <span className="font-black text-sm text-center w-full mt-1.5 leading-tight uppercase">
            {selected && value ? value : "Custom"}
          </span>
          <div className="flex-1 flex items-center justify-center py-2">
            <PenLine
              className="w-9 h-9 text-black opacity-70"
              strokeWidth={1.8}
            />
          </div>
          <span className="text-[9px] font-bold text-black/40 text-center w-full leading-tight mb-1">
            {selected && value ? "Your choice ✓" : "Write your own"}
          </span>
          <div
            className={`check-indicator absolute bottom-2 right-2 ${selected && value ? "opacity-100 scale-100" : ""}`}
          >
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />
          </div>
        </>
      ) : (
        // Expanded — inline input
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full h-full flex flex-col items-center justify-center gap-3 px-3 py-3"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={32}
            className="w-full text-center font-black text-sm bg-white border-[2px] border-black rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 placeholder:text-gray-300"
          />
          <div className="flex gap-2 w-full">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 py-1.5 bg-white border-[2px] border-black rounded-lg font-black text-xs uppercase hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!value.trim()}
              className="flex-1 py-1.5 bg-black text-white border-[2px] border-black rounded-lg font-black text-xs uppercase disabled:bg-gray-300 disabled:border-gray-300 cursor-pointer disabled:cursor-not-allowed"
            >
              Set
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function StepHeading({
  number,
  title,
  subtitle,
}: {
  number: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-1.5 mb-7 mt-2 max-w-2xl"
    >
      <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-black text-sm shadow-brutal mb-2">
        {number}
      </div>
      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-gray-500 font-medium mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────
   MAIN APP
───────────────────────────────────── */
export default function DateDropApp() {
  const [mounted, setMounted] = useState(false);
  const [appMode, setAppMode] = useState<"creator" | "receiver" | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Custom picker states
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [calMonth, setCalMonth] = useState(() => new Date());
  const [customHour, setCustomHour] = useState("7");
  const [customMin, setCustomMin] = useState("00");
  const [customAmpm, setCustomAmpm] = useState("PM");

  // Form state
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [senderGender, setSenderGender] = useState("");
  const [receiverGender, setReceiverGender] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [food, setFood] = useState("");
  const [vibe, setVibe] = useState("");
  const [customFood, setCustomFood] = useState("");
  const [customVibe, setCustomVibe] = useState("");
  const [accepted, setAccepted] = useState(false);

  const [linkCopied, setLinkCopied] = useState(false);
  const [planId, setPlanId] = useState("");
  const [loadedFromHash, setLoadedFromHash] = useState(false);
  const [creatorSawYes, setCreatorSawYes] = useState(false);

  const dates = useMemo(() => getNextWeekDays(), []);
  const today = useMemo(() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  }, []);

  // Screenshot
  const summaryCardRef = useRef<HTMLDivElement>(null);
  const [screenshotBusy, setScreenshotBusy] = useState(false);

  const downloadScreenshot = useCallback(async () => {
    if (!summaryCardRef.current) return;
    setScreenshotBusy(true);
    try {
      const opts = {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const canvas = await html2canvas(summaryCardRef.current, opts as any);
      canvas.toBlob((blob) => {
        if (!blob) {
          setScreenshotBusy(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "date-plan.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setScreenshotBusy(false);
      }, "image/png");
    } catch (e) {
      console.error("Screenshot failed", e);
      setScreenshotBusy(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const isObjectId = /^[a-f0-9]{24}$/i.test(hash);
      if (isObjectId) {
        setPlanId(hash);
        setLoadedFromHash(true);
        fetch(`/api/plans/${hash}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.senderName) setSenderName(data.senderName);
            if (data.receiverName) setReceiverName(data.receiverName);
            if (data.senderGender) setSenderGender(data.senderGender);
            if (data.receiverGender) setReceiverGender(data.receiverGender);
            if (data.date) setDate(data.date);
            if (data.time) setTime(data.time);
            if (data.food) setFood(data.food);
            if (data.vibe) setVibe(data.vibe);
            if (data.accepted) {
              setAccepted(true);
              // Creator reopening their own link after receiver accepted
              // We detect this by checking if there's a "creator" param OR the data has been accepted
              // For now, show receiver view (accepted state)
              setAppMode("receiver");
              // If the plan is accepted and the URL has a "from=creator" marker, show creator celebration
              const urlParams = new URLSearchParams(window.location.search);
              if (urlParams.get("from") === "creator") {
                setCreatorSawYes(true);
                setAppMode("creator");
              }
            } else {
              setAppMode("receiver");
            }
          })
          .catch((e) => console.error("Failed to load plan", e));
      } else {
        try {
          const payload = decodeInvitePayload(hash);
          setLoadedFromHash(true);
          const hasPlan = !!(payload.d || payload.t || payload.f || payload.v);
          setAppMode(hasPlan ? "receiver" : "creator");
          if (payload.s) setSenderName(payload.s);
          if (payload.r) setReceiverName(payload.r);
          if (payload.d) setDate(payload.d);
          if (payload.t) setTime(payload.t);
          if (payload.f) setFood(payload.f);
          if (payload.v) setVibe(payload.v);
          if (payload.a === "yes") setAccepted(true);
          if (payload.sg) setSenderGender(payload.sg);
          if (payload.rg) setReceiverGender(payload.rg);
        } catch (e) {
          console.error("Invalid invite link", e);
        }
      }
    } else {
      if (dates.length > 0 && !date) setDate(dates[0].fullVal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSteps = 4;

  const generateLink = async () => {
    let apiSucceeded = false;
    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: senderName.trim(),
          receiverName: receiverName.trim(),
          senderGender,
          receiverGender,
          date,
          time,
          food,
          vibe,
          accepted,
        }),
      });
      const data = await res.json();
      if (data.id) {
        apiSucceeded = true;
        setPlanId(data.id);
        const url = `${window.location.origin}${window.location.pathname}#${data.id}`;
        if (navigator.share) {
          try {
            await navigator.share({
              title: `DateDrop — A date for ${receiverName}`,
              text: `Hey ${receiverName}! I planned something for us 💌`,
              url,
            });
          } catch {
            await copyToClipboard(url);
          }
        } else {
          await copyToClipboard(url);
        }
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 3000);
      }
    } catch (e) {
      console.error("Failed to save plan, using fallback link", e);
    }
    if (!apiSucceeded) {
      const payload: InvitePayload = {
        s: senderName.trim(),
        r: receiverName.trim(),
        d: date,
        t: time,
        f: food,
        v: vibe,
        a: accepted ? "yes" : undefined,
        sg: senderGender || undefined,
        rg: receiverGender || undefined,
      };
      const url = `${window.location.origin}${window.location.pathname}#${encodeInvitePayload(payload)}`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: `DateDrop — A date for ${receiverName}`,
            text: `Hey ${receiverName}! I planned something for us 💌`,
            url,
          });
        } catch {
          await copyToClipboard(url);
        }
      } else {
        await copyToClipboard(url);
      }
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep((p) => p + 1);
  };
  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  const isStepComplete = () => {
    if (!appMode) return false;
    switch (currentStep) {
      case 0:
        return senderName.trim() !== "" && receiverName.trim() !== "";
      case 1:
        return date !== "" && time !== "";
      case 2:
        return food !== "";
      case 3:
        return vibe !== "";
      default:
        return true;
    }
  };

  const renderDateTimePickers = () => (
    <>
      <div className="mb-8 max-w-3xl">
        <h3 className="font-black text-base md:text-lg mb-2.5 uppercase tracking-tight text-gray-700">
          The Day
        </h3>
        <div className="flex items-center justify-start gap-2.5 md:gap-4 overflow-x-auto pb-4 snap-x">
          {dates.slice(0, 7).map((d) => (
            <div
              className="flex flex-col items-center gap-1.5 min-w-[48px] md:min-w-[60px] snap-start"
              key={d.fullVal}
            >
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {d.isToday ? "Today" : d.dayName}
              </span>
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`date-circle w-12 h-12 md:w-14 md:h-14 text-lg font-black cursor-pointer ${date === d.fullVal ? "bg-[#dcfce7] shadow-[inset_0_-10px_0_0_rgba(0,0,0,0.1)] border-[3px] border-black ring-2 ring-black ring-offset-1" : "bg-white border-[3px] border-black"}`}
                onClick={() => setDate(d.fullVal)}
              >
                {d.dateNum}
              </motion.div>
            </div>
          ))}
          {(() => {
            const isCustomDate =
              date !== "" && !dates.slice(0, 7).some((d) => d.fullVal === date);
            const displayNum = isCustomDate
              ? new Date(date + "T12:00:00").getDate()
              : "";
            const displayDay = isCustomDate
              ? new Date(date + "T12:00:00").toLocaleDateString("en-US", {
                  weekday: "short",
                })
              : "Custom";
            return (
              <div className="flex flex-col items-center gap-1.5 min-w-[48px] md:min-w-[60px] snap-start">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {displayDay}
                </span>
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`cursor-pointer date-circle w-12 h-12 md:w-14 md:h-14 text-lg border-[3px] border-black flex items-center justify-center font-black ${isCustomDate || showCustomDate ? "bg-[#dcfce7] shadow-[inset_0_-10px_0_0_rgba(0,0,0,0.1)]" : "bg-white"}`}
                  onClick={() => setShowCustomDate(!showCustomDate)}
                >
                  {isCustomDate ? (
                    displayNum
                  ) : (
                    <CalendarIcon
                      className="w-4 h-4 md:w-5 md:h-5"
                      strokeWidth={3}
                    />
                  )}
                </motion.div>
              </div>
            );
          })()}
        </div>

        <AnimatePresence>
          {showCustomDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-4 border-[3px] border-black rounded-2xl bg-white shadow-brutal w-full max-w-xs md:max-w-sm overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() =>
                    setCalMonth(
                      new Date(
                        calMonth.getFullYear(),
                        calMonth.getMonth() - 1,
                        1,
                      ),
                    )
                  }
                  className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={3} />
                </button>
                <span className="font-black text-sm uppercase tracking-widest">
                  {calMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  onClick={() =>
                    setCalMonth(
                      new Date(
                        calMonth.getFullYear(),
                        calMonth.getMonth() + 1,
                        1,
                      ),
                    )
                  }
                  className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" strokeWidth={3} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-1.5 text-center font-black text-gray-400 text-[10px]">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {(() => {
                  const year = calMonth.getFullYear();
                  const month = calMonth.getMonth();
                  const firstDay = new Date(year, month, 1).getDay();
                  const daysInMonth = new Date(year, month + 1, 0).getDate();
                  const blanks = Array.from({ length: firstDay }).map(
                    (_, i) => <div key={`b-${i}`} />,
                  );
                  const days = Array.from({ length: daysInMonth }).map(
                    (_, i) => {
                      const dayNum = i + 1;
                      const fullVal = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                      const isSelected = date === fullVal;
                      const isPast = fullVal < today;
                      return (
                        <button
                          key={dayNum}
                          onClick={() => {
                            if (!isPast) {
                              setDate(fullVal);
                              setShowCustomDate(false);
                            }
                          }}
                          disabled={isPast}
                          className={`aspect-square flex items-center justify-center rounded-full font-bold text-sm border-2 transition-all cursor-pointer ${isSelected ? "bg-black text-white border-black" : isPast ? "text-gray-300 border-transparent cursor-not-allowed" : "border-transparent hover:border-black hover:bg-gray-50"}`}
                        >
                          {dayNum}
                        </button>
                      );
                    },
                  );
                  return [...blanks, ...days];
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-3xl">
        <h3 className="font-black text-base md:text-lg mb-2.5 uppercase tracking-tight text-gray-700">
          The Hour
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {TIMES.map((t) => (
            <motion.div
              key={t}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTime(t)}
              className={`px-4 py-2.5 border-[3px] border-black rounded-2xl font-black text-base text-center cursor-pointer transition-all ${time === t ? "bg-[#e0f2fe] shadow-[inset_0_-5px_0_0_rgba(0,0,0,0.1)] translate-y-0.5" : "bg-white shadow-brutal"}`}
            >
              {t}
            </motion.div>
          ))}
          {(() => {
            const isCustomTime = time !== "" && !TIMES.includes(time);
            return (
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-4 py-2.5 border-[3px] border-black rounded-2xl font-black text-base text-center cursor-pointer transition-all flex items-center justify-center gap-1.5 ${isCustomTime || showCustomTime ? "bg-[#e0f2fe] shadow-[inset_0_-5px_0_0_rgba(0,0,0,0.1)] translate-y-0.5" : "bg-white shadow-brutal"}`}
                onClick={() => setShowCustomTime(!showCustomTime)}
              >
                {isCustomTime ? (
                  time
                ) : (
                  <>
                    <Clock className="w-4 h-4" strokeWidth={3} /> Custom
                  </>
                )}
              </motion.div>
            );
          })()}
        </div>
        <AnimatePresence>
          {showCustomTime && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-4 border-[3px] border-black rounded-2xl bg-white shadow-brutal w-full max-w-xs md:max-w-sm overflow-hidden"
            >
              <h4 className="font-black text-sm uppercase mb-4 text-center">
                Set Time
              </h4>
              <BrutalTimePicker
                value={`${customHour}:${customMin} ${customAmpm}`}
                onChange={(val) => {
                  const [hm, period] = val.split(" ");
                  const [h, m] = hm.split(":");
                  setCustomHour(h);
                  setCustomMin(m);
                  setCustomAmpm(period);
                }}
              />
              <button
                onClick={() => {
                  setTime(`${customHour}:${customMin} ${customAmpm}`);
                  setShowCustomTime(false);
                }}
                className="mt-5 w-full py-3 bg-black text-white font-black text-sm rounded-xl border-[3px] border-black hover:-translate-y-0.5 transition-transform shadow-brutal cursor-pointer"
              >
                Set Time
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );

  if (!mounted) return null;

  // RECEIVER FLOW — full cinematic experience
  if (appMode === "receiver" && loadedFromHash) {
    return (
      <ReceiverRevealFlow
        senderName={senderName}
        receiverName={receiverName}
        date={date}
        time={time}
        food={food}
        vibe={vibe}
        planId={planId}
        accepted={accepted}
        summaryCardRef={summaryCardRef}
        screenshotBusy={screenshotBusy}
        downloadScreenshot={downloadScreenshot}
      />
    );
  }

  // CREATOR SAW YES — celebration banner
  if (appMode === "creator" && creatorSawYes) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex flex-col items-center justify-center p-6 text-center gap-6">
        <Confetti />
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <div className="w-20 h-20 bg-[#dcfce7] border-[3px] border-black rounded-full flex items-center justify-center shadow-brutal mx-auto mb-6">
            <PartyPopper className="w-10 h-10" strokeWidth={2} />
          </div>
          <h1
            className="text-5xl font-black tracking-tighter mb-2"
            style={{ fontFamily: "var(--font-fredoka, var(--font-inter))" }}
          >
            They said YES! 🎉
          </h1>
          <p className="text-lg font-bold text-gray-500 mb-2">
            {receiverName} accepted your invite.
          </p>
          <p className="text-sm text-gray-400">
            It&apos;s a date —{" "}
            {date
              ? new Date(date + "T12:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })
              : "soon"}
            .
          </p>
        </motion.div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {date &&
            time &&
            getCalendarUrl(date, time, food, vibe, senderName) && (
              <a
                href={getCalendarUrl(date, time, food, vibe, senderName)!}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-black text-white font-black text-sm uppercase rounded-2xl border-[3px] border-black shadow-brutal hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2"
              >
                <CalendarIcon className="w-4 h-4" /> Add to Calendar
              </a>
            )}
          <button
            onClick={downloadScreenshot}
            disabled={screenshotBusy}
            className="w-full py-3.5 bg-white font-black text-sm uppercase rounded-2xl border-[3px] border-black shadow-brutal hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            Save Invite Card <Download className="w-4 h-4" />
          </button>
        </div>
        {/* Hidden summary card for screenshot */}
        <div
          className="fixed -left-[9999px] top-0 pointer-events-none"
          aria-hidden
        >
          <div
            ref={summaryCardRef}
            className="rounded-3xl overflow-hidden"
            style={{
              width: 390,
              background:
                "linear-gradient(165deg, #fff1f2 0%, #ffe4e6 40%, #fecdd3 100%)",
            }}
          >
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Heart
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                </div>
                <span className="font-black text-base uppercase tracking-tight">
                  DateDrop
                </span>
              </div>
              <div className="text-center mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 mb-2">
                  A date between
                </p>
                <p className="text-3xl font-black uppercase tracking-tight">
                  {senderName}
                </p>
                <div className="flex items-center justify-center gap-3 my-2">
                  <div className="h-[3px] w-8 bg-black/20 rounded-full" />
                  <Heart
                    className="w-5 h-5 text-rose-400"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                  <div className="h-[3px] w-8 bg-black/20 rounded-full" />
                </div>
                <p className="text-3xl font-black uppercase tracking-tight">
                  {receiverName}
                </p>
              </div>
            </div>
            <div className="mx-4 mb-4 bg-white rounded-2xl border-[3px] border-black p-5 space-y-4">
              {date && (
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-[#dcfce7] border-2 border-black rounded-xl flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/40">
                      When
                    </p>
                    <p className="text-lg font-black">
                      {new Date(date + "T12:00:00").toLocaleDateString(
                        "en-US",
                        { weekday: "long", month: "long", day: "numeric" },
                      )}
                    </p>
                    {time && (
                      <p className="text-sm font-bold text-black/60">{time}</p>
                    )}
                  </div>
                </div>
              )}
              {food && (
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-[#fef9c3] border-2 border-black rounded-xl flex items-center justify-center">
                    <Utensils className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/40">
                      Eating
                    </p>
                    <p className="text-lg font-black">{food}</p>
                  </div>
                </div>
              )}
              {vibe && (
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-[#e0f2fe] border-2 border-black rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/40">
                      Activity
                    </p>
                    <p className="text-lg font-black">{vibe}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 pb-6 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">
                Made with DateDrop ❤️
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CREATOR FLOW
  return (
    <div
      className="min-h-screen font-sans text-black flex flex-col relative bg-[#FFFBF5]"
      style={{ zIndex: 1 }}
    >
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        style={{ zIndex: 0 }}
      />

      {/* Header */}
      <div className="pt-4 px-5 pb-2.5 md:px-12 md:pt-6 bg-[#FFFBF5]/90 backdrop-blur-sm z-30 flex items-center justify-between w-full mx-auto max-w-5xl sticky top-0">
        <button
          onClick={handleBack}
          className={`w-9 h-9 flex items-center justify-center border-[3px] border-black rounded-full shadow-brutal bg-white hover:-translate-y-1 transition-transform cursor-pointer ${currentStep === 0 ? "opacity-0 pointer-events-none" : ""}`}
        >
          <ChevronLeft strokeWidth={4} className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          {/* Step dots */}
          {appMode === "creator" && (
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSteps + 1 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i === currentStep ? 20 : 8,
                    opacity: i <= currentStep ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`h-2 rounded-full bg-black`}
                />
              ))}
            </div>
          )}
          {!appMode && (
            <div className="flex items-center gap-2">
              <Heart
                className="w-4 h-4 text-rose-500"
                fill="currentColor"
                strokeWidth={0}
              />
              <span className="font-black text-sm uppercase tracking-tight">
                DateDrop
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sticky date/time banner */}
      <AnimatePresence>
        {(date || time) && currentStep > 1 && appMode === "creator" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="sticky top-[56px] z-20 w-full mx-auto max-w-5xl px-5 md:px-12 mb-3 mt-1"
          >
            <div className="w-full bg-black text-white border-[3px] border-black shadow-brutal px-3 py-2 md:px-5 md:py-3 rounded-xl flex items-center justify-between gap-2 rotate-1">
              <div>
                <span className="text-[10px] uppercase font-black text-green-300 tracking-widest">
                  Date locked in
                </span>
                <p className="text-sm font-black leading-tight">
                  {date
                    ? new Date(date + "T12:00:00").toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })
                    : "TBD"}
                </p>
              </div>
              {time && (
                <div className="bg-green-300 text-black px-3 py-1 rounded-lg border-2 border-black font-black text-xs -rotate-1">
                  {time}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 px-5 pb-32 md:px-12 w-full mx-auto max-w-5xl flex flex-col relative z-10 pt-4 md:pt-6">
        <AnimatePresence mode="wait">
          {/* STEP 0 — Mode Selection / Names */}
          {currentStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              {/* Landing — mode not yet chosen */}
              {!appMode && (
                <div className="flex flex-col items-center text-center py-6 md:py-10">
                  <div className="w-full max-w-sm md:max-w-md mb-6">
                    <img
                      src="/images/hero.png"
                      alt="Date illustration"
                      className="w-full h-auto mix-blend-multiply opacity-95"
                    />
                  </div>
                  <h2
                    className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-3"
                    style={{
                      fontFamily: "var(--font-fredoka, var(--font-inter))",
                    }}
                  >
                    Make them say yes.
                  </h2>
                  <p className="text-base font-medium text-gray-500 max-w-md mb-8 leading-relaxed">
                    Build a date invite they won&apos;t forget. Send a link.
                    Watch them smile.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mb-10">
                    <motion.button
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setAppMode("creator")}
                      className="flex-1 group p-6 bg-white border-[3px] border-black rounded-2xl shadow-brutal text-left cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-[#dcfce7] border-2 border-black rounded-xl flex items-center justify-center mb-4">
                        <Sparkles className="w-6 h-6" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-xl font-black uppercase mb-1">
                        I&apos;ll Plan It
                      </h3>
                      <p className="text-sm font-medium text-gray-500 leading-snug">
                        Create a date plan and send the link to your partner
                      </p>
                    </motion.button>

                    <motion.button
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setAppMode("receiver")}
                      className="flex-1 group p-6 bg-white border-[3px] border-black rounded-2xl shadow-brutal text-left cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-[#e0f2fe] border-2 border-black rounded-xl flex items-center justify-center mb-4">
                        <Send className="w-6 h-6" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-xl font-black uppercase mb-1">
                        Let Them Plan
                      </h3>
                      <p className="text-sm font-medium text-gray-500 leading-snug">
                        Send your partner a link so they can plan the date
                      </p>
                    </motion.button>
                  </div>

                  {/* Games banner */}
                  <a href="/games" className="w-full max-w-2xl block group">
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="relative border-[3px] border-black rounded-2xl shadow-brutal overflow-hidden bg-gradient-to-br from-[#f3e8ff] via-[#fce7f3] to-[#e0f2fe]"
                    >
                      <div className="absolute top-0 right-0 bg-black text-white font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-bl-xl">
                        New
                      </div>
                      <div className="p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-white border-[3px] border-black rounded-xl flex items-center justify-center shadow-brutal-sm">
                            <Sparkles className="w-5 h-5" strokeWidth={2} />
                          </div>
                          <span className="font-black text-xs uppercase tracking-[0.2em] text-black/40">
                            DateDrop Games
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none mb-2">
                          Play Together
                        </h3>
                        <p className="text-sm font-medium text-black/50 mb-5 max-w-md">
                          5 multiplayer games for two — Codenames, Draw & Guess,
                          Know Me, Hangman, and Who Is It?
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            {
                              href: "/games/codenames",
                              icon: Target,
                              label: "Codenames",
                              sub: "Word clues",
                            },
                            {
                              href: "/games/draw-guess",
                              icon: Camera,
                              label: "Draw & Guess",
                              sub: "Draw & guess",
                            },
                            {
                              href: "/games/know-me",
                              icon: Heart,
                              label: "Know Me?",
                              sub: "Couples quiz",
                            },
                            {
                              href: "/games/hangman",
                              icon: Star,
                              label: "Hangman",
                              sub: "Guess the word",
                            },
                          ].map((g) => {
                            const Icon = g.icon;
                            return (
                              <a
                                key={g.href}
                                href={g.href}
                                className="bg-white border-[3px] border-black rounded-xl p-3 shadow-brutal-sm hover:-translate-y-0.5 transition-transform block"
                              >
                                <Icon
                                  className="w-5 h-5 mb-1"
                                  strokeWidth={2}
                                />
                                <p className="font-black text-xs uppercase tracking-tight">
                                  {g.label}
                                </p>
                                <p className="text-[10px] text-black/40 font-medium">
                                  {g.sub}
                                </p>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  </a>
                </div>
              )}

              {/* CREATOR names step */}
              {appMode === "creator" && (
                <div>
                  <StepHeading
                    number={1}
                    title={
                      receiverName
                        ? `Planning for ${receiverName}`
                        : "The People"
                    }
                    subtitle="Who is this date for?"
                  />
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="flex-1 flex flex-col gap-5 max-w-2xl">
                      <div>
                        <label className="block text-sm font-black mb-2 ml-1 uppercase tracking-tight text-gray-600">
                          Your Name
                        </label>
                        <input
                          type="text"
                          className="input-brutal text-lg py-4 px-4"
                          placeholder="e.g. James"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                        />
                      </div>
                      <GenderPicker
                        label="Your Gender"
                        value={senderGender}
                        onChange={setSenderGender}
                      />
                      <div>
                        <label className="block text-sm font-black mb-2 ml-1 uppercase tracking-tight text-gray-600">
                          Their Name
                        </label>
                        <input
                          type="text"
                          className="input-brutal text-lg py-4 px-4"
                          placeholder="e.g. Sarah"
                          value={receiverName}
                          onChange={(e) => setReceiverName(e.target.value)}
                        />
                        {receiverName && (
                          <p className="text-xs font-bold text-rose-400 mt-2 ml-1">
                            ✓ Building a date for {receiverName}
                          </p>
                        )}
                      </div>
                      <GenderPicker
                        label="Their Gender"
                        value={receiverGender}
                        onChange={setReceiverGender}
                      />
                    </div>
                    <div className="hidden md:block w-48 lg:w-72 flex-shrink-0">
                      <img
                        src="/images/the_people.png"
                        alt="People illustration"
                        className="w-full h-auto mix-blend-multiply opacity-95"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* RECEIVER — send link to partner */}
              {appMode === "receiver" && !loadedFromHash && (
                <div className="flex flex-col items-center text-center py-8 md:py-16 max-w-lg mx-auto">
                  <div className="w-16 h-16 bg-[#e0f2fe] border-[3px] border-black rounded-2xl -rotate-3 flex items-center justify-center shadow-brutal mb-6">
                    <Send className="w-8 h-8" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-3">
                    Let them plan
                  </h2>
                  <p className="text-base font-medium text-gray-500 max-w-md mb-8 leading-relaxed">
                    Enter your names, generate a link, and send it to your
                    partner so they can plan the date.
                  </p>
                  <div className="w-full flex flex-col gap-5 text-left">
                    <div>
                      <label className="block text-sm font-black mb-2 ml-1 uppercase tracking-tight text-gray-600">
                        Your Name
                      </label>
                      <input
                        type="text"
                        className="input-brutal text-lg py-4 px-4"
                        placeholder="e.g. Sarah"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                      />
                    </div>
                    <GenderPicker
                      label="Your Gender"
                      value={receiverGender}
                      onChange={setReceiverGender}
                    />
                    <div>
                      <label className="block text-sm font-black mb-2 ml-1 uppercase tracking-tight text-gray-600">
                        Partner&apos;s Name
                      </label>
                      <input
                        type="text"
                        className="input-brutal text-lg py-4 px-4"
                        placeholder="e.g. James"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                      />
                    </div>
                    <GenderPicker
                      label="Partner's Gender"
                      value={senderGender}
                      onChange={setSenderGender}
                    />
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={async () => {
                        if (receiverName.trim() && senderName.trim()) {
                          try {
                            const res = await fetch("/api/plans", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                senderName: senderName.trim(),
                                receiverName: receiverName.trim(),
                                senderGender,
                                receiverGender,
                                date: "",
                                time: "",
                                food: "",
                                vibe: "",
                                accepted: false,
                              }),
                            });
                            const data = await res.json();
                            if (data.id) {
                              const url = `${window.location.origin}${window.location.pathname}#${data.id}`;
                              if (navigator.share) {
                                try {
                                  await navigator.share({
                                    title: `DateDrop — Plan a date!`,
                                    text: `Hey ${senderName}! Plan our date using this link 💌`,
                                    url,
                                  });
                                } catch {
                                  await copyToClipboard(url);
                                }
                              } else {
                                await copyToClipboard(url);
                              }
                              setLinkCopied(true);
                              setTimeout(() => setLinkCopied(false), 2000);
                            }
                          } catch {
                            const payload: InvitePayload = {
                              s: senderName.trim(),
                              r: receiverName.trim(),
                              rg: receiverGender || undefined,
                              sg: senderGender || undefined,
                            };
                            const url = `${window.location.origin}${window.location.pathname}#${encodeInvitePayload(payload)}`;
                            await copyToClipboard(url);
                            setLinkCopied(true);
                            setTimeout(() => setLinkCopied(false), 2000);
                          }
                        }
                      }}
                      disabled={!receiverName.trim() || !senderName.trim()}
                      className="mt-2 w-full py-4 bg-black text-white rounded-2xl border-[3px] border-black shadow-brutal font-black text-sm uppercase flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
                    >
                      {linkCopied ? (
                        <>
                          <Check className="w-4 h-4" strokeWidth={3} /> Link
                          Copied!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" strokeWidth={2.5} />{" "}
                          Generate & Share Link
                        </>
                      )}
                    </motion.button>
                    {linkCopied && (
                      <p className="text-sm font-bold text-green-600 text-center">
                        Link ready — send it to {senderName}!
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 1 — Date & Time */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1">
                  <StepHeading
                    number={2}
                    title="Date & Time"
                    subtitle={`When are you taking ${receiverName || "them"} out?`}
                  />
                </div>
                <div className="hidden md:block w-40 lg:w-64 flex-shrink-0 -mt-2">
                  <img
                    src="/images/date_time.png"
                    alt="Date and time illustration"
                    className="w-full h-auto mix-blend-multiply opacity-90"
                  />
                </div>
              </div>
              {renderDateTimePickers()}
            </motion.div>
          )}

          {/* STEP 2 — Food */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1">
                  <StepHeading
                    number={3}
                    title="The Food"
                    subtitle={`What would ${receiverName || "they"} love to eat?`}
                  />
                </div>
                <div className="hidden md:block w-40 lg:w-64 flex-shrink-0 -mt-2">
                  <img
                    src="/images/the_food.png"
                    alt="Food illustration"
                    className="w-full h-auto mix-blend-multiply opacity-90"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {FOODS.map((f) => (
                  <BentoCard
                    key={f.id}
                    label={f.label}
                    icon={f.icon}
                    bg={f.bg}
                    desc={f.desc}
                    selected={food === f.label}
                    onClick={() => {
                      setFood(f.label);
                      setCustomFood("");
                    }}
                  />
                ))}
                <CustomBentoCard
                  value={customFood}
                  onChange={setCustomFood}
                  onSelect={(v) => {
                    setFood(v);
                    setCustomFood(v);
                  }}
                  selected={!!food && !FOODS.some((f) => f.label === food)}
                  placeholder="e.g. Thai food"
                  bg="bg-[#fef9c3]"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Vibe */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1">
                  <StepHeading
                    number={4}
                    title="The Vibe"
                    subtitle={`What do you want ${receiverName || "them"} to experience?`}
                  />
                </div>
                <div className="hidden md:block w-40 lg:w-64 flex-shrink-0 -mt-2">
                  <img
                    src="/images/activities.png"
                    alt="Activities illustration"
                    className="w-full h-auto mix-blend-multiply opacity-90"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {VIBES.map((v) => (
                  <BentoCard
                    key={v.id}
                    label={v.label}
                    icon={v.icon}
                    bg={v.bg}
                    desc={v.desc}
                    selected={vibe === v.label}
                    onClick={() => {
                      setVibe(v.label);
                      setCustomVibe("");
                    }}
                  />
                ))}
                <CustomBentoCard
                  value={customVibe}
                  onChange={setCustomVibe}
                  onSelect={(v) => {
                    setVibe(v);
                    setCustomVibe(v);
                  }}
                  selected={!!vibe && !VIBES.some((v) => v.label === vibe)}
                  placeholder="e.g. Rooftop drinks"
                  bg="bg-[#f3e8ff]"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 4 — Final */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.3 }}
              className="flex-1 pb-12 pt-4"
            >
              <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-6"
                  >
                    <div className="w-16 h-16 bg-[#fef9c3] border-[3px] border-black rounded-2xl rotate-6 flex items-center justify-center shadow-brutal">
                      <PartyPopper className="w-8 h-8" strokeWidth={2} />
                    </div>
                    <div>
                      <h2
                        className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-1"
                        style={{
                          fontFamily: "var(--font-fredoka, var(--font-inter))",
                        }}
                      >
                        All Set!
                      </h2>
                      <p className="text-sm font-medium text-gray-500">
                        {receiverName} is going to love this.
                      </p>
                    </div>
                  </motion.div>

                  {/* Summary card */}
                  <div className="w-full max-w-lg mb-6">
                    <div
                      ref={summaryCardRef}
                      className="rounded-3xl overflow-hidden border-[3px] border-black shadow-brutal"
                      style={{
                        background:
                          "linear-gradient(165deg, #fff1f2 0%, #ffe4e6 40%, #fecdd3 100%)",
                      }}
                    >
                      <div className="px-6 pt-6 pb-4">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                              <Heart
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                strokeWidth={0}
                              />
                            </div>
                            <span className="font-black text-base uppercase tracking-tight">
                              DateDrop
                            </span>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                            Date Plan
                          </span>
                        </div>
                        <div className="text-center mb-6">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 mb-2">
                            A date between
                          </p>
                          <p className="text-3xl font-black uppercase tracking-tight leading-none">
                            {senderName}
                          </p>
                          <div className="flex items-center justify-center gap-3 my-2">
                            <div className="h-[3px] w-8 bg-black/20 rounded-full" />
                            <Heart
                              className="w-5 h-5 text-rose-400"
                              fill="currentColor"
                              strokeWidth={0}
                            />
                            <div className="h-[3px] w-8 bg-black/20 rounded-full" />
                          </div>
                          <p className="text-3xl font-black uppercase tracking-tight leading-none">
                            {receiverName}
                          </p>
                        </div>
                      </div>
                      <div className="mx-4 mb-4 bg-white rounded-2xl border-[3px] border-black p-5 space-y-4">
                        {date && (
                          <div className="flex items-start gap-4">
                            <div className="w-11 h-11 bg-[#dcfce7] border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0">
                              <CalendarIcon
                                className="w-5 h-5"
                                strokeWidth={2.5}
                              />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/40 mb-0.5">
                                When
                              </p>
                              <p className="text-lg font-black leading-tight">
                                {new Date(
                                  date + "T12:00:00",
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                              {time && (
                                <p className="text-sm font-bold text-black/60 mt-0.5">
                                  {time}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        {food && (
                          <>
                            <div className="h-[2px] bg-black/5 rounded-full" />
                            <div className="flex items-start gap-4">
                              <div className="w-11 h-11 bg-[#fef9c3] border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0">
                                <Utensils
                                  className="w-5 h-5"
                                  strokeWidth={2.5}
                                />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/40 mb-0.5">
                                  Eating
                                </p>
                                <p className="text-lg font-black leading-tight">
                                  {food}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                        {vibe && (
                          <>
                            <div className="h-[2px] bg-black/5 rounded-full" />
                            <div className="flex items-start gap-4">
                              <div className="w-11 h-11 bg-[#e0f2fe] border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0">
                                <Star className="w-5 h-5" strokeWidth={2.5} />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/40 mb-0.5">
                                  Activity
                                </p>
                                <p className="text-lg font-black leading-tight">
                                  {vibe}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="px-6 pb-6 text-center">
                        <a
                          href="/games"
                          className="text-xs font-bold uppercase tracking-[0.15em] text-black/50 hover:text-black underline underline-offset-4"
                        >
                          Play Games Together
                        </a>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 mt-1">
                          Made with DateDrop ❤️
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="w-full max-w-lg space-y-3">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={generateLink}
                      className="w-full btn-action py-4 text-lg flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                      {linkCopied ? (
                        <>
                          <Check className="w-5 h-5" strokeWidth={3} /> Link
                          Copied!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-5 h-5" /> Send to{" "}
                          {receiverName || "them"}
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={downloadScreenshot}
                      disabled={screenshotBusy}
                      className="w-full py-3.5 bg-white text-black font-black text-sm uppercase rounded-2xl border-[3px] border-black shadow-brutal flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {screenshotBusy ? "Capturing..." : "Download Card"}{" "}
                      <Download className="w-4 h-4" />
                    </motion.button>
                    {linkCopied && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-bold text-green-600 text-center"
                      >
                        Link ready — now send it to {receiverName}! 💌
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="hidden md:block w-48 lg:w-72 flex-shrink-0">
                  <img
                    src={
                      senderGender === "female"
                        ? "/images/all_set_girl.png"
                        : "/images/all_set_boy.png"
                    }
                    alt="All set illustration"
                    className="w-full h-auto mix-blend-multiply opacity-95"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky Next button */}
      {currentStep < totalSteps && appMode === "creator" && (
        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#FFFBF5] via-[#FFFBF5]/95 to-transparent pt-12 z-20 pointer-events-none">
          <div className="max-w-5xl mx-auto w-full flex justify-end pointer-events-auto">
            <motion.button
              whileHover={isStepComplete() ? { y: -2 } : {}}
              whileTap={isStepComplete() ? { scale: 0.97 } : {}}
              onClick={handleNext}
              disabled={!isStepComplete()}
              className="w-full sm:w-auto min-w-[180px] py-4 px-6 bg-black text-white rounded-2xl border-[3px] border-black shadow-brutal font-black text-sm uppercase flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
            >
              {currentStep === 0 && receiverName
                ? `Plan for ${receiverName}`
                : "Next"}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" strokeWidth={4} />
            </motion.button>
          </div>
        </div>
      )}

      {/* Receiver link generation - footer CTA */}
      {appMode === "receiver" && !loadedFromHash && currentStep === 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#FFFBF5] to-transparent pt-12 z-20 pointer-events-none">
          <div className="max-w-5xl mx-auto w-full flex justify-center pointer-events-auto">
            <button
              onClick={() => setAppMode(null)}
              className="flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
