import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatInviteTime(date: Date) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}
