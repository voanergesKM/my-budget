import React, { useState } from "react";
import { UploadCloud } from "lucide-react";

import { Button } from "@/app/ui/shadcn/Button";
import { Item, ItemContent, ItemTitle } from "@/app/ui/shadcn/item";
import { Popover, PopoverContent, PopoverTrigger, } from "@/app/ui/shadcn/Popover";

function DialogTrigger({ onSelect }: { onSelect: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>
          <UploadCloud /> Import Backup
        </Button>
      </PopoverTrigger>

      <PopoverContent className={"w-52"}>
        <Item
          variant={"outline"}
          onClick={() => {
            onSelect();
            setOpen(false);
          }}
          className={"cursor-pointer text-text-primary"}
        >
          <ItemContent>
            <ItemTitle>Fuelio</ItemTitle>
          </ItemContent>
        </Item>
      </PopoverContent>
    </Popover>
  );
}

export default DialogTrigger;
