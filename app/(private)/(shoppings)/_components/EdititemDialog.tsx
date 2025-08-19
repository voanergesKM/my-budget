import { useState } from "react";
import { useTranslations } from "next-intl";

import { ShoppingItem } from "@/app/lib/definitions";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/ui/shadcn/Dialog";

import { TextField } from "@/app/ui/components/TextField";
import UnitSelector from "@/app/ui/components/UnitSelector";

interface EdititemDialogProps {
  open: boolean;
  onClose: (b: ShoppingItem | null) => void;
  data: ShoppingItem;
  onSubmit: (data: ShoppingItem) => void;
}

const EdititemDialog = ({
  open,
  onClose,
  data,
  onSubmit,
}: EdititemDialogProps) => {
  const [item, setItem] = useState<ShoppingItem>(data);

  const tDialogs = useTranslations("Dialogs");
  const tInputs = useTranslations("Common.inputs");
  const tButtons = useTranslations("Common.buttons");

  const handleClose = () => {
    onClose(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  const handleUnitSelect = (option: string) => {
    setItem((prev) => ({ ...prev, unit: option }));
  };

  const handleSubmit = () => {
    onSubmit(item);
    onClose(null);
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[360px] gap-2 bg-primary md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{tDialogs("editTitle", { entity: "" })}</DialogTitle>
          <DialogDescription className="text-secondary" hidden>
            {tDialogs("updateUnitDialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <TextField
            label={tInputs("title")}
            value={item.title}
            onChange={handleChange}
            name="title"
          />

          <UnitSelector value={item.unit} onChange={handleUnitSelect} />

          <TextField
            label={tInputs("quantity")}
            value={item.quantity}
            type="number"
            onChange={(e) => {
              const raw = e.target.value;
              setItem({ ...item, quantity: !raw ? null : +raw });
            }}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button type="button" onClick={handleSubmit}>
            {tButtons("update")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EdititemDialog;
