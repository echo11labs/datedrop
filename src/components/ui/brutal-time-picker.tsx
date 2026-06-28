"use client";

import { useState, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const HOURS = ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
const MINUTES = ["00", "15", "30", "45"];
const PERIODS = ["AM", "PM"];

interface BrutalTimePickerProps {
  value: string; // e.g. "7:00 PM"
  onChange: (time: string) => void;
}

function BrutalColumn({
  items,
  value,
  onChange,
  label,
}: {
  items: string[];
  value: string;
  onChange: (val: string) => void;
  label: string;
}) {
  const currentIndex = items.indexOf(value);

  const handlePrev = () => {
    const newIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
    onChange(items[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentIndex >= items.length - 1 ? 0 : currentIndex + 1;
    onChange(items[newIndex]);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={handlePrev}
        className="w-9 h-7 flex items-center justify-center border-[3px] border-black rounded-lg bg-white hover:-translate-y-0.5 active:translate-y-0 transition-transform shadow-brutal-sm hover:shadow-brutal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        aria-label={`Previous ${label}`}
      >
        <ChevronUp className="w-4 h-4" strokeWidth={3} />
      </button>

      <div className="w-14 h-12 flex items-center justify-center border-[3px] border-black rounded-xl bg-[#e0f2fe] font-black text-lg md:text-xl select-none">
        {value}
      </div>

      <button
        type="button"
        onClick={handleNext}
        className="w-9 h-7 flex items-center justify-center border-[3px] border-black rounded-lg bg-white hover:-translate-y-0.5 active:translate-y-0 transition-transform shadow-brutal-sm hover:shadow-brutal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        aria-label={`Next ${label}`}
      >
        <ChevronDown className="w-4 h-4" strokeWidth={3} />
      </button>

      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
        {label}
      </span>
    </div>
  );
}

export function BrutalTimePicker({ value, onChange }: BrutalTimePickerProps) {
  const [hour, minuteAndPeriod] = value.split(":");
  const [minute, period] = (minuteAndPeriod || "00 PM").split(" ");

  const handleHourChange = useCallback(
    (h: string) => {
      onChange(`${h}:${minute} ${period}`);
    },
    [minute, period, onChange],
  );

  const handleMinuteChange = useCallback(
    (m: string) => {
      onChange(`${hour}:${m} ${period}`);
    },
    [hour, period, onChange],
  );

  const handlePeriodChange = useCallback(
    (p: string) => {
      onChange(`${hour}:${minute} ${p}`);
    },
    [hour, minute, onChange],
  );

  return (
    <div
      className="flex items-center justify-center gap-3"
      role="group"
      aria-label="Time picker"
    >
      <BrutalColumn
        items={HOURS}
        value={hour || "12"}
        onChange={handleHourChange}
        label="Hour"
      />

      <div className="font-black text-2xl text-black pb-5 select-none">:</div>

      <BrutalColumn
        items={MINUTES}
        value={minute || "00"}
        onChange={handleMinuteChange}
        label="Min"
      />

      <BrutalColumn
        items={PERIODS}
        value={period || "PM"}
        onChange={handlePeriodChange}
        label="AM/PM"
      />
    </div>
  );
}
