import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Palette } from "lucide-react";

import { cn } from "@/app/lib/utils/utils";

import { Button } from "@/app/ui/shadcn/Button";
import { Card, CardContent } from "@/app/ui/shadcn/Card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/ui/shadcn/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/ui/shadcn/Dialog";

import { colorGroups } from "./colorsMap";

export function ColorPicker({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const t = useTranslations("Dialogs");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="max-w-[120px]">
        <Button
          variant={"ghost"}
          size={"icon"}
          className="text-text-primary [&_svg]:size-6"
          style={{ backgroundColor: selected }}
          aria-label="Select Color"
        >
          <Palette size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0">
        <DialogHeader>
          <DialogTitle>{t("selectColor")}</DialogTitle>
          <DialogDescription hidden>{t("selectColor")}</DialogDescription>
        </DialogHeader>

        <ColorPickerCarousel value={selected} onChange={onSelect} />
      </DialogContent>
    </Dialog>
  );
}

type ColorPickerCarouselProps = {
  value: string;
  onChange: (color: string) => void;
};

export function ColorPickerCarousel({
  value,
  onChange,
}: ColorPickerCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
    api.on("select", () => {
      setSelectedIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="mx-auto max-w-[300px] space-y-4 outline-black md:max-w-[500px] lg:max-w-[580px]">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {colorGroups.map((colors, groupIndex) => (
            <CarouselItem key={groupIndex}>
              <Card className="border-none bg-transparent">
                <CardContent
                  className={cn("grid gap-3 p-4", "grid-cols-6 md:grid-cols-8")}
                >
                  {colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => onChange(color)}
                      className={cn(
                        "rounded-full border-2 transition-colors",
                        value === color
                          ? "ring-2 ring-ring ring-offset-2"
                          : "border-muted",
                        "h-8 w-8 sm:h-10 sm:w-10"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="-left-6 top-1/2 z-10 -translate-y-1/2" />
        <CarouselNext className="-right-6 top-1/2 z-10 -translate-y-1/2" />
      </Carousel>

      <div className="flex justify-center gap-2">
        {colorGroups.map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-2 w-2 rounded-full bg-muted-foreground",
              index === selectedIndex && "bg-primary"
            )}
          />
        ))}
      </div>
    </div>
  );
}
