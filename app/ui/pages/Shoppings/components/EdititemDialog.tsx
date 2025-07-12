import { useState } from "react";

import { ShoppingItem } from "@/app/lib/definitions";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/ui/shadcn/Dialog";

import Button from "@/app/ui/components/Button";
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
          <DialogTitle>Update</DialogTitle>
          <DialogDescription className="text-secondary">
            Update title, quantity and unit
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <TextField
            label="Item Name"
            value={item.title}
            onChange={handleChange}
            name="title"
          />

          <UnitSelector value={item.unit} onChange={handleUnitSelect} />

          <TextField
            label="Quantity"
            value={item.quantity}
            type="number"
            onChange={(e) => {
              const raw = e.target.value;
              setItem({ ...item, quantity: !raw ? null : +raw });
            }}
          />
        </div>

        <DialogFooter className="mt-2">
          <Button
            type="button"
            onClick={handleSubmit}
            classes={{ root: "w-[150px]" }}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EdititemDialog;
