import React, { useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Calculator } from "lucide-react";

import { Button } from "@/app/ui/shadcn/Button";
import { Input } from "@/app/ui/shadcn/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/ui/shadcn/Popover";

import { evaluateCalculatorExpression } from "./calculatorExpression";

interface CalculatorPopoverProps {
  value: string | number;
  disabled?: boolean;
  onApply: (value: number) => void;
}

const keys = [
  "7",
  "8",
  "9",
  "/",
  "4",
  "5",
  "6",
  "*",
  "1",
  "2",
  "3",
  "-",
  "0",
  ".",
  "(",
  ")",
  "C",
  "⌫",
  "+",
];

export function CalculatorPopover({
  value,
  disabled,
  onApply,
}: CalculatorPopoverProps) {
  const t = useTranslations("Calculator");
  const [open, setOpen] = useState(false);
  const [expression, setExpression] = useState("");
  const [error, setError] = useState(false);
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setExpression(
        value === "" || value == null || Number(value) === 0
          ? ""
          : String(value)
      );
      setError(false);
    }
    setOpen(nextOpen);
  };

  const apply = () => {
    try {
      const result = evaluateCalculatorExpression(expression);
      onApply(result);
      setOpen(false);
    } catch {
      setError(true);
    }
  };

  const pressKey = (key: string) => {
    setError(false);
    setExpression((previous) =>
      key === "C" ? "" : key === "⌫" ? previous.slice(0, -1) : previous + key
    );
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          aria-label={t("open")}
          className="absolute right-0 top-0 h-10 w-10 rounded-md text-text-primary hover:text-accent-foreground"
        >
          <Calculator />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-64 space-y-3"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            (event.target === inputRef.current ||
              event.target === event.currentTarget)
          ) {
            event.preventDefault();
            apply();
          } else if (
            event.target !== inputRef.current &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey
          ) {
            if (/^[0-9+*/().,\-]$/.test(event.key)) {
              event.preventDefault();
              pressKey(event.key);
            } else if (event.key === "Backspace") {
              event.preventDefault();
              pressKey("⌫");
            }
          }
        }}
      >
        <Input
          ref={inputRef}
          aria-label={t("expression")}
          aria-invalid={error}
          aria-describedby={error ? errorId : undefined}
          inputMode="decimal"
          value={expression}
          onChange={(event) => {
            setExpression(event.target.value);
            setError(false);
          }}
        />
        {error && (
          <p id={errorId} role="alert" className="text-sm text-destructive">
            {t("invalidExpression")}
          </p>
        )}
        <div className="grid grid-cols-4 gap-1">
          {keys.map((key) => (
            <Button
              key={key}
              type="button"
              variant="outline"
              className="h-9 px-0"
              aria-label={
                key === "C"
                  ? t("clear")
                  : key === "⌫"
                    ? t("backspace")
                    : undefined
              }
              onClick={() => pressKey(key)}
            >
              {key === "*" ? "×" : key === "/" ? "÷" : key}
            </Button>
          ))}
          <Button
            type="button"
            className="h-9 px-0"
            aria-label={t("apply")}
            onClick={apply}
          >
            =
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
