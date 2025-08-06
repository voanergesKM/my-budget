"use client";

import * as React from "react";
import { DateRange, isDateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";

import { formatDate } from "@/app/lib/utils/dateUtils";

import { Button } from "@/app/ui/shadcn/Button";
import { Calendar } from "@/app/ui/shadcn/Calendar";
import { Input } from "@/app/ui/shadcn/Input";
import { Label } from "@/app/ui/shadcn/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/ui/shadcn/Popover";

type Props =
  | {
      mode: "single";
      label?: string;
      currentValue?: Date;
      onChange?: (date: Date | undefined) => void;
    }
  | {
      mode: "range";
      label?: string;
      currentValue?: DateRange;
      onChange?: (range: DateRange | undefined) => void;
    };

export default function DatePicker(props: Props) {
  const [open, setOpen] = React.useState(false);

  const isSingle = props.mode === "single";
  const [value, setValue] = React.useState(
    props.currentValue ??
      (isSingle ? undefined : { from: undefined, to: undefined })
  );

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
    setValue(selected);
    if (isSingle) {
      props.onChange?.(selected as Date | undefined);
    } else {
      props.onChange?.(selected as DateRange | undefined);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {props.label && (
        <Label htmlFor="date-picker" className="px-1">
          {props.label}
        </Label>
      )}
      <div className="relative flex gap-2">
        <Input
          id="date-picker"
          readOnly
          value={formatValue()}
          placeholder={isSingle ? "Select date" : "Select date range"}
          className="bg-transparent pr-10 text-text-primary"
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="absolute right-2 top-1/2 size-6 -translate-y-1/2 text-text-primary hover:text-popover-foreground"
            >
              <CalendarIcon className="size-3.5" />
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
              />
            ) : (
              <Calendar
                mode="single"
                selected={value as Date}
                onSelect={handleSelect}
                captionLayout="dropdown"
                numberOfMonths={1}
                required
              />
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
