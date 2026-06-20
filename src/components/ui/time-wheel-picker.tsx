import * as React from "react";
import { cn } from "@/lib/utils";
import { WheelColumn } from "./date-wheel-picker";

export interface TimeWheelPickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "value"> {
  value?: string; // "7:00 PM"
  onChange: (time: string) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

const sizeConfig = {
  sm: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS * 0.8,
    itemHeight: ITEM_HEIGHT * 0.8,
    fontSize: "text-sm",
    gap: "gap-2",
  },
  md: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    itemHeight: ITEM_HEIGHT,
    fontSize: "text-base",
    gap: "gap-4",
  },
  lg: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS * 1.2,
    itemHeight: ITEM_HEIGHT * 1.2,
    fontSize: "text-lg",
    gap: "gap-6",
  },
};

const HOURS = Array.from({ length: 12 }, (_, i) => String(i === 0 ? 12 : i));
const MINUTES = ["00", "15", "30", "45"];
const PERIODS = ["AM", "PM"];

export const TimeWheelPicker = React.forwardRef<HTMLDivElement, TimeWheelPickerProps>(
  (
    {
      value = "7:00 PM",
      onChange,
      size = "md",
      disabled = false,
      className,
      ...props
    },
    ref,
  ) => {
    const config = sizeConfig[size];

    const [hour, minuteAndPeriod] = value.split(":");
    const [minute, period] = (minuteAndPeriod || "00 PM").split(" ");

    const hourIndex = Math.max(0, HOURS.indexOf(hour));
    const minIndex = Math.max(0, MINUTES.indexOf(minute));
    const periodIndex = Math.max(0, PERIODS.indexOf(period));

    const handleHourChange = React.useCallback(
      (index: number) => {
        onChange(`${HOURS[index]}:${minute} ${period}`);
      },
      [minute, period, onChange],
    );

    const handleMinuteChange = React.useCallback(
      (index: number) => {
        onChange(`${hour}:${MINUTES[index]} ${period}`);
      },
      [hour, period, onChange],
    );

    const handlePeriodChange = React.useCallback(
      (index: number) => {
        onChange(`${hour}:${minute} ${PERIODS[index]}`);
      },
      [hour, minute, onChange],
    );

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center",
          config.gap,
          config.fontSize,
          disabled && "pointer-events-none opacity-50",
          className,
        )}
        style={{ perspective: "1000px" }}
        role="group"
        aria-label="Time picker"
        {...props}
      >
        <WheelColumn
          items={HOURS}
          value={hourIndex}
          onChange={handleHourChange}
          itemHeight={config.itemHeight}
          visibleItems={VISIBLE_ITEMS}
          disabled={disabled}
          className="w-16"
          ariaLabel="Select hour"
        />

        <div className="font-bold text-muted-foreground pb-1">:</div>

        <WheelColumn
          items={MINUTES}
          value={minIndex}
          onChange={handleMinuteChange}
          itemHeight={config.itemHeight}
          visibleItems={VISIBLE_ITEMS}
          disabled={disabled}
          className="w-16"
          ariaLabel="Select minute"
        />

        <WheelColumn
          items={PERIODS}
          value={periodIndex}
          onChange={handlePeriodChange}
          itemHeight={config.itemHeight}
          visibleItems={VISIBLE_ITEMS}
          disabled={disabled}
          className="w-16"
          ariaLabel="Select AM/PM"
        />
      </div>
    );
  },
);

TimeWheelPicker.displayName = "TimeWheelPicker";
