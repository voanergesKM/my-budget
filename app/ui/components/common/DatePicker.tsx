"use client";

import * as React from "react";
import { DateRange, isDateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";

import { formatDate } from "@/app/lib/utils/dateUtils";
import { cn } from "@/app/lib/utils/utils";

import { Button } from "@/app/ui/shadcn/Button";
import { Calendar } from "@/app/ui/shadcn/Calendar";
import { Input } from "@/app/ui/shadcn/Input";
import { Label } from "@/app/ui/shadcn/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/ui/shadcn/Popover";

type Mode = "single" | "range";

type CommonProps = {
  label?: string;
  currentValue?: Date | DateRange;
  onChange?: (value: Date | DateRange | undefined) => void;
  onBlur?: (value: Date | DateRange | undefined) => void;
  variant?: "icon" | "default";
  minDate?: Date;
};

type Props = { mode: Mode } & (
  | { mode: "single"; currentValue?: Date }
  | { mode: "range"; currentValue?: DateRange }
) &
  CommonProps;

export default function DatePicker(props: Props) {
  const [open, setOpen] = React.useState(false);

  const isSingle = props.mode === "single";
  const [value, setValue] = React.useState(
    props.currentValue ??
      (isSingle ? undefined : { from: undefined, to: undefined })
  );

  React.useEffect(() => {
    setValue(props.currentValue);
  }, [props.currentValue]);

  const formatValue = () => {
    if (isSingle) {
      return value ? formatDate(value as Date, "full") : "";
    } else {
      const range = value as DateRange;
      if (!range?.from) return "";
      const from = formatDate(range.from, "full");
      const to = range.to ? formatDate(range.to, "full") : "";
      return to ? `${from} - ${to}` : from;
    }
  };

  const handleSelect = (selected: Date | DateRange | undefined) => {
    if (!isSingle && selected && isDateRange(selected)) {
      const updated: DateRange = { ...selected };

      if (updated.from) {
        updated.from = new Date(updated.from);
        updated.from.setHours(0, 0, 0, 0);
      }

      if (updated.to) {
        updated.to = new Date(updated.to);
        updated.to.setHours(23, 59, 59, 999);
      }

      selected = updated;
    }

    setValue(selected);

    if (isSingle) {
      props.onChange?.(selected as Date | undefined);
    } else {
      props.onChange?.(selected as DateRange | undefined);
    }
  };

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      props.onBlur?.(value);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {props.label && (
        <Label htmlFor={props.label} className="px-1">
          {props.label}
        </Label>
      )}
      <div className="relative flex gap-2">
        {props.variant !== "icon" && (
          <Input
            id={props.label || "date-picker"}
            readOnly
            value={formatValue()}
            placeholder={isSingle ? "Select date" : "Select date range"}
            className="bg-transparent pr-10 text-xs text-text-primary"
            autoFocus={false}
          />
        )}

        <Popover open={open} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "absolute right-2 top-1/2 size-6 -translate-y-1/2 text-text-primary hover:text-popover-foreground",
                props.variant === "icon" &&
                  "size-10 rounded-full [&_svg]:size-5"
              )}
            >
              <CalendarIcon className={"size-3.5"} />
              <span className="sr-only">
                {isSingle ? "Select date" : "Select date range"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            {props.mode === "range" ? (
              <Calendar
                mode="range"
                selected={value as DateRange}
                onSelect={handleSelect}
                captionLayout="dropdown"
                numberOfMonths={1}
                required
                disabled={(date) =>
                  props.minDate ? date < props.minDate : false
                }
              />
            ) : (
              <Calendar
                mode="single"
                selected={value as Date}
                onSelect={handleSelect}
                captionLayout="dropdown"
                numberOfMonths={1}
                required
                disabled={(date) =>
                  props.minDate ? date < props.minDate : false
                }
              />
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
