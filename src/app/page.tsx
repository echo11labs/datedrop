"use client";

import type { CSSProperties } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  CalendarDays,
  CalendarPlus,
  Check,
  Copy,
  Coffee,
  Cookie,
  Gem,
  Heart,
  Link2,
  Moon,
  Palette,
  PartyPopper,
  RotateCcw,
  Share2,
  Sparkles,
  Star,
  Utensils,
  Wine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { DateWheelPicker } from "@/components/ui/date-wheel-picker";
import { TimeWheelPicker } from "@/components/ui/time-wheel-picker";

/* ─────────────────────────────────────
   CONSTANTS
───────────────────────────────────── */
const SCROLL_PER_WORLD = 900;

const NO_PROMPTS = [
  "Are you absolutely sure?",
  "I'm actually a really great cook...",
  "I'll let you pick the movie...",
  "I have excellent taste in coffee...",
  "Okay, now you're just playing hard to get.",
  "Please? 🥺",
  "I'm not giving up that easily.",
  "Just click Yes. You know you want to."
];

const FOODS = [
  { label: "Italian",      note: "pasta, candles",     icon: Wine      },
  { label: "Japanese",     note: "refined & crisp",    icon: Utensils  },
  { label: "Casual Bites", note: "relaxed, no fuss",   icon: Cookie    },
  { label: "Coffee & Cake",note: "slow and sweet",     icon: Coffee    },
  { label: "Fine Dining",  note: "dress beautifully",  icon: Gem       },
  { label: "Surprise Me",  note: "trust the plan",     icon: Sparkles  },
];

const VIBES = [
  { label: "Romantic",   note: "soft and intentional", icon: Heart      },
  { label: "Cozy",       note: "warm conversation",    icon: Coffee     },
  { label: "Playful",    note: "no script, just fun",  icon: PartyPopper},
  { label: "Refined",    note: "a reason to dress up", icon: Gem        },
  { label: "Mysterious", note: "revealed at the door", icon: Moon       },
  { label: "Surprise",   note: "you choose everything",icon: Star       },
];

const THEME_OPTIONS = [
  {
    id: "soft-minimal",
    label: "Soft Minimalism",
    note: "quiet love-note flow",
    swatch: "#c8192a",
    surface: "#fafaf8",
  },
  {
    id: "swiss",
    label: "Swiss",
    note: "poster grid, direct copy",
    swatch: "#e00022",
    surface: "#ffffff",
  },
  {
    id: "fashion",
    label: "Fashion Editorial",
    note: "magazine pacing, luxe copy",
    swatch: "#9f1239",
    surface: "#fbf7ef",
  },
  {
    id: "art-deco",
    label: "Art Deco",
    note: "centered gala invitation",
    swatch: "#9a6a00",
    surface: "#fff8e6",
  },
  {
    id: "retro-future",
    label: "Retro Futurism",
    note: "signal panel, playful copy",
    swatch: "#0f766e",
    surface: "#f2fbf8",
  },
] as const;

type ThemeId = (typeof THEME_OPTIONS)[number]["id"];

const DEFAULT_THEME: ThemeId = "soft-minimal";

type ThemeSectionCopy = {
  label: string;
  lead: string;
  accent: string;
  tail?: string;
  body?: string;
  cta?: string;
  deco: string;
  scene: string;
};

type ThemeContent = {
  creatorHero: ThemeSectionCopy;
  names: ThemeSectionCopy;
  plan: ThemeSectionCopy;
  date: ThemeSectionCopy;
  time: ThemeSectionCopy;
  food: ThemeSectionCopy;
  vibe: ThemeSectionCopy;
  creatorFinal: ThemeSectionCopy;
  receiverHero: ThemeSectionCopy;
  question: ThemeSectionCopy & { noBody: string; yes: string; no: string };
  celebration: ThemeSectionCopy;
  summary: ThemeSectionCopy;
};

const THEME_CONTENT = {
  "soft-minimal": {
    creatorHero: {
      label: "A private invitation",
      lead: "Ask them out,",
      accent: "beautifully.",
      body: "Create a private link to send to someone special.",
      cta: "Get started",
      deco: "Hello.",
      scene: "note",
    },
    names: {
      label: "The people",
      lead: "Who is asking",
      accent: "who?",
      deco: "Who.",
      scene: "names",
    },
    plan: {
      label: "The details",
      lead: "How do you want to",
      accent: "handle the plan?",
      deco: "Plan.",
      scene: "plan",
    },
    date: {
      label: "Pick a day",
      lead: "When should I get to",
      accent: "see you?",
      cta: "Choose a time",
      deco: "When.",
      scene: "date",
    },
    time: {
      label: "The hour",
      lead: "What time",
      accent: "feels right?",
      body: "Pick the hour. I'll be ready.",
      cta: "Choose the food",
      deco: "When?",
      scene: "time",
    },
    food: {
      label: "The food",
      lead: "What kind of dinner",
      accent: "feels right?",
      cta: "Set the vibe",
      deco: "Eat.",
      scene: "food",
    },
    vibe: {
      label: "The vibe",
      lead: "Set the mood",
      accent: "for the evening.",
      cta: "Finish details",
      deco: "Vibe.",
      scene: "mood",
    },
    creatorFinal: {
      label: "Ready to send",
      lead: "Your invite is",
      accent: "ready.",
      body: "Copy the link below and send it to {receiver}.",
      deco: "Done.",
      scene: "send",
    },
    receiverHero: {
      label: "A private invitation",
      lead: "Hello,",
      accent: "{receiver}.",
      body: "{sender} wanted to ask you something.",
      cta: "See what it is",
      deco: "Hello.",
      scene: "open",
    },
    question: {
      label: "The question",
      lead: "Will you go on a",
      accent: "date with me?",
      noBody: "No pressure. A little charm, a little intention.",
      yes: "Yes",
      no: "No",
      deco: "Us?",
      scene: "ask",
    },
    celebration: {
      label: "Correct answer",
      lead: "You just made",
      accent: "my whole day.",
      body: "They've taken care of all the details.",
      cta: "See the plan",
      deco: "Yes!",
      scene: "yes",
    },
    summary: {
      label: "All set",
      lead: "It's a",
      accent: "date.",
      deco: "Done.",
      scene: "plan",
    },
  },
  swiss: {
    creatorHero: {
      label: "Invitation system",
      lead: "Make the ask",
      accent: "clear.",
      body: "Build a precise private date brief and send one link.",
      cta: "Start brief",
      deco: "01",
      scene: "brief",
    },
    names: {
      label: "Participants",
      lead: "Identify",
      accent: "both sides.",
      deco: "02",
      scene: "names",
    },
    plan: {
      label: "Planning route",
      lead: "Assign",
      accent: "the details.",
      deco: "03",
      scene: "route",
    },
    date: {
      label: "Date",
      lead: "Select the",
      accent: "day.",
      cta: "Set time",
      deco: "04",
      scene: "date",
    },
    time: {
      label: "Time",
      lead: "Lock the",
      accent: "hour.",
      body: "Choose the cleanest time slot for the plan.",
      cta: "Set food",
      deco: "05",
      scene: "time",
    },
    food: {
      label: "Food",
      lead: "Choose the",
      accent: "format.",
      cta: "Set tone",
      deco: "06",
      scene: "food",
    },
    vibe: {
      label: "Tone",
      lead: "Define the",
      accent: "mood.",
      cta: "Review link",
      deco: "07",
      scene: "tone",
    },
    creatorFinal: {
      label: "Dispatch",
      lead: "The invite is",
      accent: "ready.",
      body: "Send the selected format to {receiver}.",
      deco: "08",
      scene: "send",
    },
    receiverHero: {
      label: "Private brief",
      lead: "Hello,",
      accent: "{receiver}.",
      body: "{sender} sent a date request.",
      cta: "Open brief",
      deco: "01",
      scene: "open",
    },
    question: {
      label: "Response",
      lead: "Accept a",
      accent: "date?",
      noBody: "Simple question. Clear answer.",
      yes: "Accept",
      no: "Decline",
      deco: "02",
      scene: "ask",
    },
    celebration: {
      label: "Accepted",
      lead: "Response",
      accent: "recorded.",
      body: "The plan is ready for review.",
      cta: "View plan",
      deco: "03",
      scene: "yes",
    },
    summary: {
      label: "Final plan",
      lead: "Date plan",
      accent: "confirmed.",
      deco: "04",
      scene: "plan",
    },
  },
  fashion: {
    creatorHero: {
      label: "Private edit",
      lead: "Make the moment",
      accent: "worth dressing for.",
      body: "Send an invitation with the mood, timing, and taste already styled.",
      cta: "Begin the edit",
      deco: "Atelier",
      scene: "cover",
    },
    names: {
      label: "Cast",
      lead: "Name the",
      accent: "leading two.",
      deco: "Names",
      scene: "cast",
    },
    plan: {
      label: "Direction",
      lead: "Choose who",
      accent: "sets the scene.",
      deco: "Brief",
      scene: "brief",
    },
    date: {
      label: "The date",
      lead: "Choose the",
      accent: "opening night.",
      cta: "Choose the hour",
      deco: "Date",
      scene: "date",
    },
    time: {
      label: "Call time",
      lead: "What hour",
      accent: "has the mood?",
      body: "Pick the time. The entrance can take care of itself.",
      cta: "Choose the table",
      deco: "Hour",
      scene: "time",
    },
    food: {
      label: "Table",
      lead: "Style the",
      accent: "dinner.",
      cta: "Shape the mood",
      deco: "Menu",
      scene: "food",
    },
    vibe: {
      label: "Moodboard",
      lead: "Set the",
      accent: "evening's language.",
      cta: "Wrap the invite",
      deco: "Mood",
      scene: "mood",
    },
    creatorFinal: {
      label: "Ready for release",
      lead: "The invite is",
      accent: "styled.",
      body: "Send the editorial cut to {receiver}.",
      deco: "Send",
      scene: "send",
    },
    receiverHero: {
      label: "An invitation",
      lead: "For",
      accent: "{receiver}.",
      body: "{sender} prepared something with your name on it.",
      cta: "Open the note",
      deco: "RSVP",
      scene: "open",
    },
    question: {
      label: "The ask",
      lead: "Will you be",
      accent: "my date?",
      noBody: "Consider this your private front-row invitation.",
      yes: "Yes",
      no: "Not yet",
      deco: "Us",
      scene: "ask",
    },
    celebration: {
      label: "Accepted",
      lead: "That was",
      accent: "the answer.",
      body: "The details are ready for their close-up.",
      cta: "See the plan",
      deco: "Yes",
      scene: "yes",
    },
    summary: {
      label: "Final look",
      lead: "It's a",
      accent: "date.",
      deco: "Plan",
      scene: "plan",
    },
  },
  "art-deco": {
    creatorHero: {
      label: "Evening invitation",
      lead: "Present the",
      accent: "grand invitation.",
      body: "Build a polished date card with a little ceremony.",
      cta: "Open the card",
      deco: "Soiree",
      scene: "card",
    },
    names: {
      label: "Guests",
      lead: "Place the",
      accent: "names.",
      deco: "Guests",
      scene: "names",
    },
    plan: {
      label: "Arrangement",
      lead: "Who will host",
      accent: "the evening?",
      deco: "Host",
      scene: "host",
    },
    date: {
      label: "The evening",
      lead: "Choose the",
      accent: "date.",
      cta: "Choose the hour",
      deco: "Date",
      scene: "date",
    },
    time: {
      label: "The hour",
      lead: "Set the",
      accent: "arrival.",
      body: "Choose the time for the evening to begin.",
      cta: "Choose the menu",
      deco: "Hour",
      scene: "time",
    },
    food: {
      label: "The menu",
      lead: "Select the",
      accent: "table.",
      cta: "Choose the atmosphere",
      deco: "Menu",
      scene: "food",
    },
    vibe: {
      label: "Atmosphere",
      lead: "Set the",
      accent: "occasion.",
      cta: "Seal the invitation",
      deco: "Mood",
      scene: "mood",
    },
    creatorFinal: {
      label: "Sealed",
      lead: "Your invitation",
      accent: "awaits.",
      body: "Send the finished card to {receiver}.",
      deco: "Seal",
      scene: "send",
    },
    receiverHero: {
      label: "A sealed invitation",
      lead: "Good evening,",
      accent: "{receiver}.",
      body: "{sender} requests the pleasure of your company.",
      cta: "Open it",
      deco: "RSVP",
      scene: "open",
    },
    question: {
      label: "RSVP",
      lead: "Will you attend",
      accent: "this date?",
      noBody: "A simple yes would make the evening official.",
      yes: "Accept",
      no: "Regretfully",
      deco: "RSVP",
      scene: "ask",
    },
    celebration: {
      label: "Accepted",
      lead: "The evening is",
      accent: "official.",
      body: "The invitation has become a plan.",
      cta: "View the card",
      deco: "Yes",
      scene: "yes",
    },
    summary: {
      label: "Engagement card",
      lead: "The date is",
      accent: "set.",
      deco: "Plan",
      scene: "plan",
    },
  },
  "retro-future": {
    creatorHero: {
      label: "Signal compose",
      lead: "Transmit a",
      accent: "date signal.",
      body: "Build a playful invite packet and send it across the timeline.",
      cta: "Boot invite",
      deco: "Signal",
      scene: "boot",
    },
    names: {
      label: "Identity scan",
      lead: "Sync the",
      accent: "two names.",
      deco: "ID",
      scene: "names",
    },
    plan: {
      label: "Control mode",
      lead: "Choose the",
      accent: "pilot.",
      deco: "Mode",
      scene: "mode",
    },
    date: {
      label: "Calendar lock",
      lead: "Pick the",
      accent: "coordinates.",
      cta: "Tune the hour",
      deco: "Date",
      scene: "date",
    },
    time: {
      label: "Time signal",
      lead: "Tune the",
      accent: "arrival window.",
      body: "Choose the hour and keep the signal clean.",
      cta: "Pick fuel",
      deco: "Time",
      scene: "time",
    },
    food: {
      label: "Fuel type",
      lead: "Select the",
      accent: "dinner channel.",
      cta: "Set the vibe",
      deco: "Food",
      scene: "food",
    },
    vibe: {
      label: "Atmosphere",
      lead: "Program the",
      accent: "mood.",
      cta: "Compile invite",
      deco: "Vibe",
      scene: "mood",
    },
    creatorFinal: {
      label: "Ready to transmit",
      lead: "Invite packet",
      accent: "compiled.",
      body: "Send the signal to {receiver}.",
      deco: "Send",
      scene: "send",
    },
    receiverHero: {
      label: "Incoming signal",
      lead: "Hello,",
      accent: "{receiver}.",
      body: "{sender} sent a date transmission.",
      cta: "Decode signal",
      deco: "Open",
      scene: "open",
    },
    question: {
      label: "Response required",
      lead: "Join the",
      accent: "date mission?",
      noBody: "Signal is stable. Charm levels are unusually high.",
      yes: "Launch",
      no: "Hold",
      deco: "Ask",
      scene: "ask",
    },
    celebration: {
      label: "Launch confirmed",
      lead: "Mission",
      accent: "accepted.",
      body: "Coordinates are ready for review.",
      cta: "View coordinates",
      deco: "Yes",
      scene: "yes",
    },
    summary: {
      label: "Mission card",
      lead: "Date mission",
      accent: "locked.",
      deco: "Plan",
      scene: "plan",
    },
  },
} satisfies Record<ThemeId, ThemeContent>;

/* ─────────────────────────────────────
   HELPERS
───────────────────────────────────── */
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toDateValue(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getNextWeekday(base: Date, weekday: number) {
  const start = new Date(base);
  start.setHours(12, 0, 0, 0);
  const diff = (weekday - start.getDay() + 7) % 7 || 7;
  return addDays(start, diff);
}

function getQuickDates(base = new Date()) {
  const friday = getNextWeekday(base, 5);
  const saturday = getNextWeekday(base, 6);

  return [
    { label: "Friday", value: toDateValue(friday) },
    { label: "Saturday", value: toDateValue(saturday) },
    { label: "Next Friday", value: toDateValue(addDays(friday, 7)) },
  ];
}

function formatDate(v: string) {
  if (!v) return "a day yet to be chosen";
  return new Intl.DateTimeFormat("en", {
    weekday: "long", month: "long", day: "numeric",
  }).format(new Date(`${v}T12:00:00`));
}

type InvitePayload = {
  m?: "sender_plans" | "receiver_plans";
  s?: string;
  r?: string;
  d?: string;
  t?: string;
  f?: string;
  v?: string;
  a?: "accepted";
  th?: ThemeId;
};

function isThemeId(value: unknown): value is ThemeId {
  return THEME_OPTIONS.some((theme) => theme.id === value);
}

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

function fillThemeText(
  text: string | undefined,
  values: { sender: string; receiver: string },
) {
  if (!text) return "";
  return text
    .replaceAll("{sender}", values.sender || "Someone")
    .replaceAll("{receiver}", values.receiver || "you");
}

function renderThemeHeadline(
  copy: ThemeSectionCopy,
  values: { sender: string; receiver: string },
) {
  return (
    <>
      {fillThemeText(copy.lead, values)}
      <br />
      <em>{fillThemeText(copy.accent, values)}</em>
      {copy.tail ? fillThemeText(copy.tail, values) : null}
    </>
  );
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const input = document.createElement("textarea");
  input.value = text;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.focus();
  input.select();
  document.execCommand("copy");
  input.remove();
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

function parseInviteDateTime(dateValue: string, timeValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const match = timeValue.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  const rawHour = Number(match?.[1] ?? 7);
  const minute = Number(match?.[2] ?? 0);
  const period = (match?.[3] ?? "PM").toUpperCase();
  const hour = period === "PM" && rawHour !== 12
    ? rawHour + 12
    : period === "AM" && rawHour === 12
      ? 0
      : rawHour;

  return new Date(year, month - 1, day, hour, minute, 0);
}

function formatIcsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcsText(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");
}

/* ─────────────────────────────────────
   SPRING ANIMATION VARIANTS
   Per skill: ease-out enter, ease-in exit,
   exit ~70% of enter duration
───────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.45,
      ease: [0.0, 0.0, 0.2, 1] as [number, number, number, number], // ease-out
    },
  }),
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.22, ease: [0.4, 0.0, 1, 1] as [number, number, number, number] }, // ease-in, 70% of enter
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.07,
      duration: 0.5,
      ease: [0.0, 0.0, 0.2, 1] as [number, number, number, number],
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.22, ease: [0.4, 0.0, 1, 1] as [number, number, number, number] },
  },
};

/* ─────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────── */
function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let rx = 0, ry = 0;
    let animId: number;

    const onMove = (e: MouseEvent) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top  = `${e.clientY}px`;
    };

    const lerp = () => {
      const tx = parseFloat(dot.style.left || "0");
      const ty = parseFloat(dot.style.top  || "0");
      rx += (tx - rx) * 0.14;
      ry += (ty - ry) * 0.14;
      ring.style.left = `${rx}px`;
      ring.style.top  = `${ry}px`;
      animId = requestAnimationFrame(lerp);
    };
    animId = requestAnimationFrame(lerp);

    const addHover = () => ring.classList.add("hovering");
    const rmHover  = () => ring.classList.remove("hovering");
    const targets  = document.querySelectorAll("button, a, input, [role=button]");
    targets.forEach(el => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", rmHover);
    });

    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mousemove", onMove);
      targets.forEach(el => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", rmHover);
      });
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}

/* ─────────────────────────────────────
   OPTION CARD
───────────────────────────────────── */
function OptionCard({
  selected, label, note, icon: Icon, onClick, index,
}: {
  selected: boolean; label: string; note: string;
  icon: LucideIcon; onClick: () => void; index: number;
}) {
  return (
    <motion.button
      className={`option-card ${selected ? "selected" : ""}`}
      onClick={onClick}
      aria-pressed={selected}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={index}
      whileTap={{ scale: 0.97 }}
    >
      <span className={`option-icon ${selected ? "selected" : ""}`}>
        <Icon
          className="w-4 h-4"
          style={{ color: selected ? "var(--red)" : "var(--ink-muted)" }}
          aria-hidden="true"
        />
      </span>
      <span className="flex flex-col min-w-0">
        <span className="option-label">{label}</span>
        <span className="option-note">{note}</span>
      </span>
      <AnimatePresence>
        {selected && (
          <motion.span
            variants={scaleIn}
            initial="hidden"
            animate="show"
            exit="exit"
            className="option-check"
            aria-hidden="true"
          >
            <Check className="w-3 h-3 text-white" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ─────────────────────────────────────
   CELEBRATION BURST
───────────────────────────────────── */
function CelebrationBurst() {
  const particles = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * 360;
      const dist  = 70 + Math.random() * 120;
      const rad   = (angle * Math.PI) / 180;
      return {
        id: i,
        tx: `${Math.cos(rad) * dist}px`,
        ty: `${Math.sin(rad) * dist}px`,
        rot: `${(Math.random() - 0.5) * 480}deg`,
        delay: `${Math.random() * 0.2}s`,
        symbol: ["✦", "♥", "◆", "★", "•"][i % 5],
        color: ["#c8192a", "#e01f2e", "#0f0e0c", "#6b6560", "#c8192a"][i % 5],
      };
    }), []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      {particles.map(p => (
        <span
          key={p.id}
          className="burst-particle"
          style={{
            "--tx": p.tx, "--ty": p.ty,
            "--rot": p.rot, "--delay": p.delay,
            color: p.color,
          } as CSSProperties}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────
   DECORATIVE ELEMENTS (CSS, no images)
───────────────────────────────────── */

// Large italic word behind content
function DecoWord({ word, opacity = 0.04, index = 0 }: { word: string; opacity?: number; index?: number }) {
  const { scrollY } = useScroll();
  const start = (index - 1) * SCROLL_PER_WORLD;
  const end = (index + 1) * SCROLL_PER_WORLD;
  
  const x = useTransform(scrollY, [start, end], [100, -100]);
  const y = useTransform(scrollY, [start, end], [30, -30]);

  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none select-none absolute right-[-2%] bottom-[-0.05em]
                 font-serif italic leading-none"
      style={{
        fontSize: "clamp(180px, 28vw, 360px)",
        fontWeight: 900,
        color: "var(--ink)",
        opacity,
        letterSpacing: "-0.04em",
        fontFamily: "var(--font-playfair), Georgia, serif",
        zIndex: 0,
        x, y
      }}
    >
      {word}
    </motion.span>
  );
}

// Thin red line accent
function RedLine({
  style,
  vertical = false,
  index = 0,
}: {
  style?: CSSProperties;
  vertical?: boolean;
  index?: number;
}) {
  const { scrollY } = useScroll();
  const start = (index - 1) * SCROLL_PER_WORLD;
  const end = (index + 1) * SCROLL_PER_WORLD;
  
  const x = useTransform(scrollY, [start, end], [-50, 50]);
  const y = useTransform(scrollY, [start, end], [-15, 15]);

  return (
    <motion.div
      aria-hidden="true"
      className="deco-line"
      style={{
        ...(vertical
          ? { width: 2, height: 80 }
          : { width: 80, height: 2 }),
        ...style,
        x, y
      }}
    />
  );
}

function ThemeScene({
  label,
  index = 0,
}: {
  label: string;
  index?: number;
}) {
  const { scrollY } = useScroll();
  const start = (index - 1) * SCROLL_PER_WORLD;
  const end = (index + 1) * SCROLL_PER_WORLD;
  const x = useTransform(scrollY, [start, end], [26, -26]);
  const y = useTransform(scrollY, [start, end], [-14, 14]);

  return (
    <motion.div className="theme-scene" style={{ x, y }} aria-hidden="true">
      <div className="theme-scene-frame">
        <span>{label}</span>
      </div>
      <div className="theme-scene-orbit" />
      <div className="theme-scene-rule" />
    </motion.div>
  );
}

/* ─────────────────────────────────────
   STAGGER CONTAINER
───────────────────────────────────── */
const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

/* ─────────────────────────────────────
   MAIN PAGE
───────────────────────────────────── */
export default function Home() {
  /* ── State ── */
  const initialQuickDates = useMemo(() => getQuickDates(), []);
  const [appMode,    setAppMode]    = useState<"creator" | "receiver">("creator");
  const [planMode,   setPlanMode]   = useState<"sender_plans" | "receiver_plans">("sender_plans");
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");

  const [noCount,    setNoCount]    = useState(0);
  const [date,       setDate]       = useState(initialQuickDates[0].value);
  const [time,       setTime]       = useState("7:00 PM");
  const [food,       setFood]       = useState("Italian");
  const [vibe,       setVibe]       = useState("Romantic");
  const [theme,      setTheme]      = useState<ThemeId>(DEFAULT_THEME);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [acceptedReply, setAcceptedReply] = useState(false);
  const [shared,     setShared]     = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [showBurst,  setShowBurst]  = useState(false);
  const [scrollY,    setScrollY]    = useState(0);
  const [active,     setActive]     = useState(0);
  const [maxWorld,   setMaxWorld]   = useState(1);
  const [navScrolled,setNavScrolled]= useState(false);
  const [mounted,    setMounted]    = useState(false);

  const stageRef  = useRef<HTMLDivElement>(null);
  const nameRef   = useRef<HTMLInputElement>(null);
  const worldCountRef = useRef(1);
  const themeSwitcherRef = useRef<HTMLDivElement>(null);

  const dateLabel   = useMemo(() => formatDate(date), [date]);
  const noPrompt    = NO_PROMPTS[Math.min(noCount, NO_PROMPTS.length - 1)];
  const quickDates   = useMemo(() => getQuickDates(), []);
  const activeTheme = useMemo(
    () => THEME_OPTIONS.find((option) => option.id === theme) ?? THEME_OPTIONS[0],
    [theme],
  );
  const themeCopy = THEME_CONTENT[theme];
  const themeTextValues = useMemo(
    () => ({
      sender: senderName.trim() || "Someone",
      receiver: receiverName.trim() || "you",
    }),
    [receiverName, senderName],
  );

  const parsedDate = useMemo(() => new Date(`${date}T12:00:00`), [date]);
  const handleWheelDateChange = useCallback((d: Date) => {
    setDate(toDateValue(d));
  }, []);

  /* ── Mount & URL Parsing ── */
  useEffect(() => {
    setMounted(true);
    const savedTheme = window.localStorage.getItem("datedrop-theme");
    if (isThemeId(savedTheme)) {
      setTheme(savedTheme);
    }

    const hash = window.location.hash.replace("#", "");
    if (hash) {
      try {
        const payload = decodeInvitePayload(hash);
        setAppMode("receiver");
        setPlanMode(payload.m || "sender_plans");
        setSenderName(payload.s || "");
        setReceiverName(payload.r || "");
        if (payload.d) setDate(payload.d);
        if (payload.t) setTime(payload.t);
        if (payload.f) setFood(payload.f);
        if (payload.v) setVibe(payload.v);
        if (isThemeId(payload.th)) setTheme(payload.th);
        setAcceptedReply(payload.a === "accepted");
      } catch (e) {
        console.error("Failed to parse invite link", e);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (mounted) {
      window.localStorage.setItem("datedrop-theme", theme);
    }
  }, [mounted, theme]);

  useEffect(() => {
    if (!themeMenuOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (
        themeSwitcherRef.current &&
        !themeSwitcherRef.current.contains(event.target as Node)
      ) {
        setThemeMenuOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setThemeMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [themeMenuOpen]);

  /* ── Go to world ── */
  const goTo = useCallback((idx: number) => {
    const target = clamp(idx, 0, worldCountRef.current - 1);
    setMaxWorld((m) => Math.max(m, target));
    setTimeout(() => {
      window.scrollTo({ top: target * SCROLL_PER_WORLD, behavior: "smooth" });
    }, 10);
  }, []);

  /* ── Handle YES ── */
  const handleYes = useCallback(() => {
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 1200);
    setTimeout(() => goTo(active + 1), 600);
  }, [goTo, active]);

  const createInviteLink = useCallback((payloadOverrides: InvitePayload = {}) => {
    const payload: InvitePayload = {
      m: planMode,
      s: senderName.trim(),
      r: receiverName.trim(),
      d: date,
      t: time,
      f: food,
      v: vibe,
      a: acceptedReply ? "accepted" : undefined,
      th: theme,
      ...payloadOverrides,
    };
    return `${window.location.origin}${window.location.pathname}#${encodeInvitePayload(payload)}`;
  }, [acceptedReply, date, food, planMode, receiverName, senderName, theme, time, vibe]);

  const showStatus = useCallback((message: string) => {
    setStatusMessage(message);
    setShared(true);
    setTimeout(() => {
      setShared(false);
      setStatusMessage("");
    }, 2500);
  }, []);

  const handleThemeChange = useCallback((nextTheme: ThemeId) => {
    const nextThemeLabel = THEME_OPTIONS.find((option) => option.id === nextTheme)?.label ?? "Theme";
    setTheme(nextTheme);
    setThemeMenuOpen(false);
    showStatus(`${nextThemeLabel} applied.`);
  }, [showStatus]);

  const copyInviteLink = useCallback(async (payloadOverrides?: InvitePayload) => {
    try {
      await copyText(createInviteLink(payloadOverrides));
      showStatus("Link copied.");
    } catch (error) {
      console.error("Failed to copy invite link", error);
      showStatus("Copy failed. Try sharing instead.");
    }
  }, [createInviteLink, showStatus]);

  const shareInviteLink = useCallback(async (payloadOverrides?: InvitePayload) => {
    const url = createInviteLink(payloadOverrides);
    const text = `${receiverName || "Someone special"}, ${senderName || "someone"} sent you a DateDrop invite.`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "DateDrop", text, url });
        showStatus("Invite shared.");
        return;
      }
    } catch (error) {
      if (isAbortError(error)) return;
      console.error("Failed to share invite link", error);
    }

    try {
      await copyText(url);
      showStatus("Link copied.");
    } catch (error) {
      console.error("Failed to copy invite link fallback", error);
      showStatus("Share failed. Copy the page URL manually.");
    }
  }, [createInviteLink, receiverName, senderName, showStatus]);

  const saveCalendarInvite = useCallback(() => {
    const start = parseInviteDateTime(date, time);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const partnerName = acceptedReply ? receiverName : senderName;
    const title = `Date with ${partnerName || "DateDrop"}`;
    const description = `${food} · ${vibe} vibe\nCreated with DateDrop`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//DateDrop//Invitation//EN",
      "BEGIN:VEVENT",
      `UID:${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}@datedrop.local`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${formatIcsDate(start)}`,
      `DTEND:${formatIcsDate(end)}`,
      `SUMMARY:${escapeIcsText(title)}`,
      `DESCRIPTION:${escapeIcsText(description)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "datedrop-invite.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showStatus("Calendar file saved.");
  }, [acceptedReply, date, food, receiverName, senderName, showStatus, time, vibe]);

  const sharePlanSummary = useCallback(async () => {
    const text = `It's a date.\n${dateLabel} at ${time}\n${food} · ${vibe} vibe\nSent with DateDrop`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "DateDrop", text });
        showStatus("Details shared.");
        return;
      }
    } catch (error) {
      if (isAbortError(error)) return;
      console.error("Failed to share plan summary", error);
    }

    try {
      await copyText(text);
      showStatus("Details copied.");
    } catch (error) {
      console.error("Failed to copy plan summary fallback", error);
      showStatus("Share failed. Copy the details manually.");
    }
  }, [dateLabel, food, showStatus, time, vibe]);


  /* ── Worlds Array Logic ── */
  const worlds = useMemo(() => {
    const list: React.ReactNode[] = [];
    const inactiveProps = (idx: number) => ({
      "aria-hidden": active !== idx,
      inert: active !== idx ? true : undefined,
    });

    // Helper functions for common sections
    const pushDate = () => {
      const idx = list.length;
      const copy = themeCopy.date;
      list.push(
      <article className={`world world-${idx}`} aria-label="Choose a date" key="w-date" {...inactiveProps(idx)}>
        <DecoWord word={copy.deco} index={idx} opacity={0.04} />
        <ThemeScene label={copy.scene} index={idx} />
        <RedLine style={{ top: "22%", left: "8%", width: 50, opacity: 0.15 }} vertical index={idx} />
        <motion.div className="world-content interactive" variants={staggerContainer} initial="hidden" animate={active === idx ? "show" : "hidden"}>
          <motion.div className="world-label" variants={fadeUp} custom={0}>{copy.label}</motion.div>
          <motion.div variants={fadeUp} custom={1} aria-hidden="true"><CalendarDays className="w-8 h-8 mb-4" style={{ color: "var(--red)", opacity: 0.7 }} /></motion.div>
          <motion.h2 className="world-title" variants={fadeUp} custom={2}>{renderThemeHeadline(copy, themeTextValues)}</motion.h2>
          <motion.div className="chip-row" variants={fadeUp} custom={3}>
            {quickDates.map(qd => (
              <button key={qd.value} className={`chip ${date === qd.value ? "selected" : ""}`} onClick={() => setDate(qd.value)} aria-pressed={date === qd.value}>{qd.label}</button>
            ))}
          </motion.div>
          <motion.div variants={fadeUp} custom={4} style={{ marginTop: 24, marginBottom: 12 }}>
            <DateWheelPicker value={parsedDate} onChange={handleWheelDateChange} size="md" minYear={2026} maxYear={2028} />
          </motion.div>
          <AnimatePresence mode="wait">
            {date && <motion.p key={date} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ marginTop: 12, fontSize: 14, fontWeight: 600, color: "var(--red)", opacity: 0.7 }}>{dateLabel}</motion.p>}
          </AnimatePresence>
          <motion.div variants={fadeUp} custom={5} style={{ marginTop: 24 }}>
            <button className="btn-primary" onClick={() => date && goTo(idx + 1)} disabled={!date}>{copy.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
          </motion.div>
        </motion.div>
        <div className="world-wall" aria-hidden="true" />
      </article>
      );
    };

    const pushTime = () => {
      const idx = list.length;
      const copy = themeCopy.time;
      list.push(
      <article className={`world world-${idx}`} aria-label="Choose a time" key="w-time" {...inactiveProps(idx)}>
        <DecoWord word={copy.deco} index={idx} opacity={0.035} />
        <ThemeScene label={copy.scene} index={idx} />
        <motion.div className="world-content interactive" variants={staggerContainer} initial="hidden" animate={active === idx ? "show" : "hidden"}>
          <motion.div className="world-label" variants={fadeUp} custom={0}>{copy.label}</motion.div>
          <motion.div variants={fadeUp} custom={1} aria-hidden="true"><Clock3 className="w-8 h-8 mb-4" style={{ color: "var(--red)", opacity: 0.7 }} /></motion.div>
          <motion.h2 className="world-title" variants={fadeUp} custom={2}>{renderThemeHeadline(copy, themeTextValues)}</motion.h2>
          {copy.body && <motion.p className="world-body" variants={fadeUp} custom={3}>{fillThemeText(copy.body, themeTextValues)}</motion.p>}
          <motion.div variants={fadeUp} custom={4} style={{ marginTop: 24 }}>
            <TimeWheelPicker value={time} onChange={setTime} size="md" />
          </motion.div>
          <motion.div variants={fadeUp} custom={5} style={{ marginTop: 28 }}>
            <button className="btn-primary" onClick={() => goTo(idx + 1)}>{copy.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
          </motion.div>
        </motion.div>
        <div className="world-wall" aria-hidden="true" />
      </article>
      );
    };

    const pushFood = () => {
      const idx = list.length;
      const copy = themeCopy.food;
      list.push(
      <article className={`world world-${idx}`} aria-label="Choose food preference" key="w-food" {...inactiveProps(idx)}>
        <DecoWord word={copy.deco} opacity={0.04} index={idx} />
        <ThemeScene label={copy.scene} index={idx} />
        <motion.div className="world-content interactive" variants={staggerContainer} initial="hidden" animate={active === idx ? "show" : "hidden"} style={{ maxWidth: 640 }}>
          <motion.div className="world-label" variants={fadeUp} custom={0}>{copy.label}</motion.div>
          <motion.h2 className="world-title" variants={fadeUp} custom={1} style={{ fontSize: "clamp(32px, 5vw, 60px)", marginBottom: 12 }}>{renderThemeHeadline(copy, themeTextValues)}</motion.h2>
          <div className="option-grid">
            {FOODS.map((f, i) => (
              <OptionCard key={f.label} icon={f.icon} label={f.label} note={f.note} selected={food === f.label} onClick={() => setFood(f.label)} index={i} />
            ))}
          </div>
          <motion.div variants={fadeUp} custom={8} style={{ marginTop: 24 }}>
            <button className="btn-primary" onClick={() => goTo(idx + 1)}>{copy.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
          </motion.div>
        </motion.div>
        <div className="world-wall" aria-hidden="true" />
      </article>
      );
    };

    const pushVibe = () => {
      const idx = list.length;
      const copy = themeCopy.vibe;
      list.push(
      <article className={`world world-${idx}`} aria-label="Choose the vibe" key="w-vibe" {...inactiveProps(idx)}>
        <DecoWord word={copy.deco} opacity={0.05} index={idx} />
        <ThemeScene label={copy.scene} index={idx} />
        <motion.div className="world-content interactive" variants={staggerContainer} initial="hidden" animate={active === idx ? "show" : "hidden"} style={{ maxWidth: 640 }}>
          <motion.div className="world-label" variants={fadeUp} custom={0}>{copy.label}</motion.div>
          <motion.h2 className="world-title" variants={fadeUp} custom={1} style={{ fontSize: "clamp(32px, 5vw, 60px)", marginBottom: 12 }}>{renderThemeHeadline(copy, themeTextValues)}</motion.h2>
          <div className="option-grid">
            {VIBES.map((v, i) => (
              <OptionCard key={v.label} icon={v.icon} label={v.label} note={v.note} selected={vibe === v.label} onClick={() => setVibe(v.label)} index={i} />
            ))}
          </div>
          <motion.div variants={fadeUp} custom={9} style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <button className="btn-primary" onClick={() => goTo(idx + 1)}>{copy.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
          </motion.div>
        </motion.div>
        <div className="world-wall" aria-hidden="true" />
      </article>
      );
    };

    if (appMode === "creator") {
      const idx0 = list.length;
      const heroCopy = themeCopy.creatorHero;
      list.push(
        <article className={`world world-${idx0}`} aria-label="Welcome" key="c-w0" {...inactiveProps(idx0)}>
          <DecoWord word={heroCopy.deco} index={idx0} opacity={0.04} />
          <ThemeScene label={heroCopy.scene} index={idx0} />
          <RedLine style={{ top: "30%", right: "12%", opacity: 0.12, width: 120 }} index={idx0} />
          <RedLine style={{ top: "32%", right: "12%", opacity: 0.08, width: 80 }} vertical index={idx0} />
          <motion.div className="world-content interactive" variants={staggerContainer} initial="hidden" animate={active === idx0 ? "show" : "hidden"}>
            <motion.div className="world-label" variants={fadeUp} custom={0}>{heroCopy.label}</motion.div>
            <motion.h1 className="world-title" variants={fadeUp} custom={1}>{renderThemeHeadline(heroCopy, themeTextValues)}</motion.h1>
            {heroCopy.body && <motion.p className="world-body" variants={fadeUp} custom={2}>{fillThemeText(heroCopy.body, themeTextValues)}</motion.p>}
            <motion.div variants={fadeUp} custom={3} style={{ marginTop: 36 }}>
              <button className="btn-primary" onClick={() => goTo(idx0 + 1)}>{heroCopy.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
            </motion.div>
          </motion.div>
          <div className="world-wall" aria-hidden="true" />
        </article>
      );

      const idx1 = list.length;
      const namesCopy = themeCopy.names;
      list.push(
        <article className={`world world-${idx1}`} aria-label="Names" key="c-w1" {...inactiveProps(idx1)}>
          <DecoWord word={namesCopy.deco} index={idx1} opacity={0.035} />
          <ThemeScene label={namesCopy.scene} index={idx1} />
          <motion.div className="world-content interactive" variants={staggerContainer} initial="hidden" animate={active === idx1 ? "show" : "hidden"}>
            <motion.div className="world-label" variants={fadeUp} custom={0}>{namesCopy.label}</motion.div>
            <motion.h2 className="world-title" variants={fadeUp} custom={1}>{renderThemeHeadline(namesCopy, themeTextValues)}</motion.h2>
            <motion.div variants={fadeUp} custom={2} style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 24, maxWidth: 300 }}>
              <div>
                <label htmlFor="sender-name" className="text-sm font-semibold opacity-70 mb-2 block">Your name (Sender)</label>
                <input id="sender-name" ref={nameRef} type="text" className="world-input" value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="e.g. John" autoComplete="name" />
              </div>
              <div>
                <label htmlFor="receiver-name" className="text-sm font-semibold opacity-70 mb-2 block">Their name (Receiver)</label>
                <input id="receiver-name" type="text" className="world-input" value={receiverName} onChange={e => setReceiverName(e.target.value)} placeholder="e.g. Jane" autoComplete="name" />
              </div>
            </motion.div>
            <motion.div variants={fadeUp} custom={3} style={{ marginTop: 36 }}>
              <button className="btn-primary" onClick={() => senderName && receiverName && goTo(idx1 + 1)} disabled={!senderName.trim() || !receiverName.trim()}>Continue <ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
            </motion.div>
          </motion.div>
          <div className="world-wall" aria-hidden="true" />
        </article>
      );

      const idx2 = list.length;
      const planCopy = themeCopy.plan;
      list.push(
        <article className={`world world-${idx2}`} aria-label="Plan Choice" key="c-w2" {...inactiveProps(idx2)}>
          <DecoWord word={planCopy.deco} index={idx2} opacity={0.035} />
          <ThemeScene label={planCopy.scene} index={idx2} />
          <motion.div className="world-content interactive" variants={staggerContainer} initial="hidden" animate={active === idx2 ? "show" : "hidden"}>
            <motion.div className="world-label" variants={fadeUp} custom={0}>{planCopy.label}</motion.div>
            <motion.h2 className="world-title" variants={fadeUp} custom={1}>{renderThemeHeadline(planCopy, themeTextValues)}</motion.h2>
            <motion.div variants={fadeUp} custom={2} style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 16 }}>
              <button className={`chip !block !text-left !px-6 !py-4 ${planMode === 'sender_plans' ? 'selected' : ''}`} onClick={() => setPlanMode('sender_plans')} aria-pressed={planMode === "sender_plans"}>
                <strong className="block mb-1 text-lg">I will plan it</strong>
                <span className="text-sm opacity-70">You pick the date, time, food, and vibe.</span>
              </button>
              <button className={`chip !block !text-left !px-6 !py-4 ${planMode === 'receiver_plans' ? 'selected' : ''}`} onClick={() => setPlanMode('receiver_plans')} aria-pressed={planMode === "receiver_plans"}>
                <strong className="block mb-1 text-lg">Let them decide</strong>
                <span className="text-sm opacity-70">They will pick the date, time, food, and vibe.</span>
              </button>
            </motion.div>
            <motion.div variants={fadeUp} custom={3} style={{ marginTop: 36 }}>
              <button className="btn-primary" onClick={() => goTo(idx2 + 1)}>Continue <ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
            </motion.div>
          </motion.div>
          <div className="world-wall" aria-hidden="true" />
        </article>
      );

      if (planMode === "sender_plans") {
        pushDate();
        pushTime();
        pushFood();
        pushVibe();
      }

      const idxFinal = list.length;
      const finalCopy = themeCopy.creatorFinal;
      list.push(
        <article className={`world world-${idxFinal}`} aria-label="Link Generation" key="c-final" {...inactiveProps(idxFinal)}>
          <DecoWord word={finalCopy.deco} index={idxFinal} opacity={0.05} />
          <ThemeScene label={finalCopy.scene} index={idxFinal} />
          <motion.div className="world-content interactive" variants={staggerContainer} initial="hidden" animate={active === idxFinal ? "show" : "hidden"}>
            <motion.div className="world-label" variants={fadeUp} custom={0}>{finalCopy.label}</motion.div>
            <motion.h2 className="world-title" variants={fadeUp} custom={1}>{renderThemeHeadline(finalCopy, themeTextValues)}</motion.h2>
            {finalCopy.body && <motion.p className="world-body" variants={fadeUp} custom={2}>{fillThemeText(finalCopy.body, { ...themeTextValues, receiver: receiverName || "them" })}</motion.p>}
            <motion.div variants={fadeUp} custom={3} className="action-row">
              <button className="btn-primary" onClick={() => copyInviteLink()}>
                <Copy className="w-4 h-4" aria-hidden="true" />
                {shared ? "Copied!" : "Copy Link"}
              </button>
              <button className="btn-ghost" onClick={() => shareInviteLink()}>
                <Share2 className="w-4 h-4" aria-hidden="true" />
                Share Invite
              </button>
            </motion.div>
          </motion.div>
          <div className="world-wall" aria-hidden="true" />
        </article>
      );
    } else {
      // RECEIVER MODE
      const pushSummary = () => {
        const idx = list.length;
        const copy = themeCopy.summary;
        list.push(
          <article className={`world world-${idx}`} aria-label="Summary" key="r-summary" {...inactiveProps(idx)}>
            <DecoWord word={copy.deco} opacity={0.05} index={idx} />
            <ThemeScene label={copy.scene} index={idx} />
            <motion.div className="world-content interactive" variants={staggerContainer} initial="hidden" animate={active === idx ? "show" : "hidden"} style={{ maxWidth: 640 }}>
              <motion.div className="world-label" variants={fadeUp} custom={0}>{acceptedReply ? "Reply received" : copy.label}</motion.div>
              <motion.h2 className="world-title" variants={fadeUp} custom={1} style={{ fontSize: "clamp(32px, 5vw, 60px)", marginBottom: 12 }}>{renderThemeHeadline(copy, themeTextValues)}</motion.h2>
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.45, ease: [0.0, 0.0, 0.2, 1] } }} className="summary-card mt-8">
                <div className="summary-header">With {acceptedReply ? receiverName : senderName}</div>
                {[
                  { label: "Day",  value: dateLabel },
                  { label: "Time", value: time      },
                  { label: "Food", value: food      },
                  { label: "Vibe", value: vibe      },
                ].map(row => (
                  <div key={row.label} className="summary-row">
                    <dt className="summary-label">{row.label}</dt>
                    <dd className="summary-value">{row.value}</dd>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} custom={4} className="action-row">
                {planMode === "sender_plans" ? (
                  <>
                    <button className="btn-primary" onClick={saveCalendarInvite}>
                      <CalendarPlus className="w-4 h-4" aria-hidden="true" />
                      {shared ? "Saved!" : "Save Calendar"}
                    </button>
                    <button className="btn-ghost" onClick={sharePlanSummary}>
                      <Share2 className="w-4 h-4" aria-hidden="true" />
                      Share Details
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-primary" onClick={() => copyInviteLink({ m: "sender_plans", a: "accepted" })}>
                      <Link2 className="w-4 h-4" aria-hidden="true" />
                      {shared ? "Copied!" : "Copy Reply Link"}
                    </button>
                    <button className="btn-ghost" onClick={() => shareInviteLink({ m: "sender_plans", a: "accepted" })}>
                      <Share2 className="w-4 h-4" aria-hidden="true" />
                      Send Back
                    </button>
                  </>
                )}
                <button className="btn-ghost" onClick={() => goTo(0)}>
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  Replay
                </button>
              </motion.div>
            </motion.div>
            <div className="world-wall" aria-hidden="true" />
          </article>
        );
      };

      const rIdx0 = list.length;
      const receiverCopy = themeCopy.receiverHero;
      list.push(
        <article className={`world world-${rIdx0}`} aria-label="Welcome" key="r-w0" {...inactiveProps(rIdx0)}>
          <DecoWord word={receiverCopy.deco} index={rIdx0} opacity={0.04} />
          <ThemeScene label={receiverCopy.scene} index={rIdx0} />
          <motion.div className="world-content interactive" variants={staggerContainer} initial="hidden" animate={active === rIdx0 ? "show" : "hidden"}>
            <motion.div className="world-label" variants={fadeUp} custom={0}>{acceptedReply ? "Reply received" : receiverCopy.label}</motion.div>
            <motion.h1 className="world-title" variants={fadeUp} custom={1}>
              {acceptedReply ? (
                <>
                  Reply received,<br/><em>{senderName || "you"}.</em>
                </>
              ) : (
                renderThemeHeadline(receiverCopy, themeTextValues)
              )}
            </motion.h1>
            <motion.p className="world-body" variants={fadeUp} custom={2}>
              {acceptedReply ? `${receiverName || "They"} said yes and sent the plan back.` : fillThemeText(receiverCopy.body, themeTextValues)}
            </motion.p>
            <motion.div variants={fadeUp} custom={3} style={{ marginTop: 36 }}>
              <button className="btn-primary" onClick={() => goTo(rIdx0 + 1)}>
                {acceptedReply ? "See the plan" : receiverCopy.cta}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </motion.div>
          </motion.div>
          <div className="world-wall" aria-hidden="true" />
        </article>
      );

      if (acceptedReply) {
        pushSummary();
        return list;
      }

      const rIdx1 = list.length;
      const questionCopy = themeCopy.question;
      list.push(
        <article className={`world world-${rIdx1}`} aria-label="The question" key="r-w1" {...inactiveProps(rIdx1)}>
          <DecoWord word={questionCopy.deco} index={rIdx1} opacity={0.04} />
          <ThemeScene label={questionCopy.scene} index={rIdx1} />
          <motion.div className="world-content interactive" variants={staggerContainer} initial="hidden" animate={active === rIdx1 ? "show" : "hidden"}>
            {showBurst && <CelebrationBurst />}
            <motion.div className="world-label" variants={fadeUp} custom={0}>{questionCopy.label}</motion.div>
            <motion.h2 className="world-title" variants={fadeUp} custom={1}>{renderThemeHeadline(questionCopy, themeTextValues)}</motion.h2>
            <motion.p className="world-body" variants={fadeUp} custom={2}>{noCount > 0 ? noPrompt : questionCopy.noBody}</motion.p>
            <motion.div variants={fadeUp} custom={3} style={{ display: "flex", gap: 16, marginTop: 32, alignItems: "center", flexWrap: "wrap", minHeight: 70 }}>
              <motion.button className="btn-yes" animate={{ scale: 1 + noCount * 0.15, marginRight: noCount * 8 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} onClick={handleYes} style={{ transformOrigin: "left center", zIndex: 10 }}>
                <Heart className="w-5 h-5" style={{ fill: "rgba(255,255,255,0.5)" }} aria-hidden="true" /> {questionCopy.yes} <Check className="w-5 h-5" aria-hidden="true" />
              </motion.button>
              <motion.button className="btn-no" animate={{ scale: Math.max(0.6, 1 - noCount * 0.08), opacity: Math.max(0.4, 1 - noCount * 0.1) }} transition={{ type: "spring", stiffness: 280, damping: 16 }} onClick={() => setNoCount(v => v + 1)}>
                {questionCopy.no}
              </motion.button>
            </motion.div>
            <AnimatePresence>
              {noCount >= 5 && planMode === 'sender_plans' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginTop: 20 }}>
                  <button className="btn-ghost" onClick={() => goTo(rIdx1 + 2)}>Show me the plan first</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <div className="world-wall" aria-hidden="true" />
        </article>
      );

      const rIdx2 = list.length;
      const celebrationCopy = themeCopy.celebration;
      list.push(
        <article className={`world world-${rIdx2}`} aria-label="Celebration" key="r-w2" {...inactiveProps(rIdx2)}>
          <DecoWord word={celebrationCopy.deco} opacity={0.04} index={rIdx2} />
          <ThemeScene label={celebrationCopy.scene} index={rIdx2} />
          <motion.div className="world-content interactive" variants={staggerContainer} initial="hidden" animate={active === rIdx2 ? "show" : "hidden"}>
            <motion.div className="world-label" variants={fadeUp} custom={0}>{celebrationCopy.label}</motion.div>
            <motion.div variants={scaleIn} style={{ marginBottom: 20 }} aria-hidden="true"><Heart className="w-12 h-12" style={{ color: "var(--red)", fill: "var(--red)" }} /></motion.div>
            <motion.h2 className="world-title" variants={fadeUp} custom={2}>{renderThemeHeadline(celebrationCopy, themeTextValues)}</motion.h2>
            <motion.p className="world-body" variants={fadeUp} custom={3}>
              {planMode === "sender_plans" ? celebrationCopy.body : "Since they asked, you get to choose the details!"}
            </motion.p>
            <motion.div variants={fadeUp} custom={4} style={{ marginTop: 32 }}>
              <button className="btn-primary" onClick={() => goTo(rIdx2 + 1)}>
                {planMode === "sender_plans" ? celebrationCopy.cta : "Make it official"}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </motion.div>
          </motion.div>
          <div className="world-wall" aria-hidden="true" />
        </article>
      );

      if (planMode === "sender_plans") {
        pushSummary();
      } else {
        pushDate();
        pushTime();
        pushFood();
        pushVibe();
        pushSummary();
      }
    }

    return list;
  }, [
    appMode, planMode, senderName, receiverName, date, time, food, vibe,
    active, noCount, dateLabel, parsedDate, handleWheelDateChange,
    showBurst, handleYes, shared, goTo, noPrompt, quickDates, acceptedReply,
    copyInviteLink, shareInviteLink, saveCalendarInvite, sharePlanSummary,
    themeCopy, themeTextValues
  ]);

  useEffect(() => {
    worldCountRef.current = worlds.length;
    setMaxWorld((current) => clamp(current, 1, Math.max(1, worlds.length - 1)));
  }, [worlds.length]);

  /* ── Scroll driver ── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setNavScrolled(y > 20);
      const w = clamp(Math.floor(y / SCROLL_PER_WORLD), 0, worlds.length - 1);
      setActive(w);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [worlds.length]);

  /* ── Translate stage ── */
  useEffect(() => {
    if (!stageRef.current) return;
    const pct = -(scrollY / SCROLL_PER_WORLD) * 100;
    stageRef.current.style.transform = `translateX(${pct}vw)`;
  }, [scrollY]);

  /* ── Focus name on world 1 ── */
  useEffect(() => {
    if (appMode === "creator" && active === 1) setTimeout(() => nameRef.current?.focus(), 500);
  }, [active, appMode]);

  /* ── Overall scroll % for top bar ── */
  const totalH = maxWorld * SCROLL_PER_WORLD;
  const barPct = mounted
    ? clamp(scrollY / totalH, 0, 1) * 100
    : 0;

  return (
    <>
      {/* Skip link (a11y) */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* Custom cursor — desktop only */}
      <Cursor />

      {/* ── TOP NAV ── */}
      <div
        className={`top-nav ${navScrolled ? "scrolled" : ""}`}
        role="banner"
      >
        {/* Brand */}
        <div className="brand" aria-label="DateDrop">
          <div className="brand-dot" aria-hidden="true" />
          <span className="brand-wordmark">DateDrop</span>
        </div>

        <div className="top-nav-actions">
          <div className="theme-switcher" ref={themeSwitcherRef}>
            <button
              type="button"
              className="theme-trigger"
              aria-haspopup="dialog"
              aria-expanded={themeMenuOpen}
              aria-controls="theme-menu"
              onClick={() => setThemeMenuOpen((open) => !open)}
            >
              <Palette className="w-4 h-4" aria-hidden="true" />
              <span className="theme-trigger-label">{activeTheme.label}</span>
              <ChevronDown className={`w-4 h-4 theme-trigger-chevron ${themeMenuOpen ? "open" : ""}`} aria-hidden="true" />
            </button>

            <AnimatePresence>
              {themeMenuOpen && (
                <motion.div
                  id="theme-menu"
                  className="theme-menu"
                  role="radiogroup"
                  aria-label="Choose DateDrop theme"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.0, 0.0, 0.2, 1] }}
                >
                  {THEME_OPTIONS.map((option) => {
                    const selected = option.id === theme;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`theme-option ${selected ? "selected" : ""}`}
                        role="radio"
                        aria-checked={selected}
                        onClick={() => handleThemeChange(option.id)}
                      >
                        <span
                          className="theme-swatch"
                          style={{
                            "--theme-swatch": option.swatch,
                            "--theme-surface": option.surface,
                          } as CSSProperties}
                          aria-hidden="true"
                        />
                        <span className="theme-option-copy">
                          <span className="theme-option-name">{option.label}</span>
                          <span className="theme-option-note">{option.note}</span>
                        </span>
                        {selected && <Check className="w-4 h-4 theme-option-check" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Step counter */}
          <p className="step-counter" aria-live="polite" aria-atomic="true">
            <strong>{active + 1}</strong> / {worlds.length}
          </p>
        </div>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={Math.round(barPct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Invitation progress"
      >
        <motion.div
          className="progress-fill"
          animate={{ width: `${barPct}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>

      <div className={`status-toast ${statusMessage ? "visible" : ""}`} role="status" aria-live="polite">
        {statusMessage}
      </div>

      {/* ── SCROLL TRACK (tall invisible — drives stage) ── */}
      <div
        style={{ height: maxWorld * SCROLL_PER_WORLD + (mounted ? window.innerHeight : 900) }}
        aria-hidden="true"
      />

      {/* ── WORLDS VIEWPORT ── */}
      <main
        className="worlds-viewport"
        id="main-content"
        style={{ height: `calc(${maxWorld * SCROLL_PER_WORLD}px + 100vh)` }}
      >
        <div
          ref={stageRef}
          className="worlds-stage"
          style={{ transition: "transform 60ms linear" }}
        >
          {worlds}
        </div>
      </main>
    </>
  );
}
