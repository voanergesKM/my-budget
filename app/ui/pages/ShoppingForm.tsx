"use client";

import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TextField } from "@/app/ui/components/TextField";
import UnitSelector from "@/app/ui/components/UnitSelector";
import Button from "@/app/ui/components/Button";
import SpinnerIcon from "@/app/ui/components/SpinnerIcon";

import { createShopping } from "@/app/lib/api/shoppings/createShopping";
import { updateShopping } from "@/app/lib/api/shoppings/updateShopping"; // маєш створити, якщо ще не існує
import { Shopping, ShoppingItem } from "@/app/lib/definitions";
import { Card, CardContent } from "../shadcn/Card";
import ShoppingListItem from "../components/ShoppingListItem";
import { PageTitle } from "../components/PageTitle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../shadcn/Dialog";

type ShoppingFormProps = {
  groupId?: string | null;
  initialData?: Shopping;
};

const initialItemState = { title: "", unit: "pcs", quantity: 1, completed: false };

export default function ShoppingForm({ groupId, initialData }: ShoppingFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = Boolean(initialData);

  const shoppingListKey = ["shoppingList", groupId ?? "all"];

  const [item, setItem] = useState<ShoppingItem>(initialItemState);

  const [editItemData, setEditItemData] = useState<ShoppingItem | null>(null);

  const [state, setState] = useState<Pick<Shopping, "title" | "items" | "_id">>({
    _id: initialData?._id || "",
    title: "",
    items: [],
  });

  useEffect(() => {
    if (isEdit) {
      setState({
        _id: initialData!._id,
        title: initialData!.title,
        items: initialData!.items,
      });
    }
  }, [initialData, isEdit]);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      isEdit
        ? updateShopping({ ...initialData!, ...state })
        : createShopping({ ...state, groupId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shoppingListKey });
      const location = groupId ? `/shoppings/${groupId}` : "/shoppings";
      router.push(location);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const handleAddItem = () => {
    setState((prev) => ({
      ...prev,
      items: [{ ...item, id: uuid() }, ...prev.items],
    }));
    setItem(initialItemState);
  };

  const handleUnitSelect = (unit: string) => {
    setItem((prev) => ({ ...prev, unit }));
  };

  return (
    <>
      <div className="mx-auto mt-6 max-w-3xl">
        <PageTitle
          title={isEdit ? "Edit Purchase List" : "Create New Purchase List"}
          className="mb-6"
        />

        <TextField
          label="List Title"
          value={state.title}
          onChange={(e) => setState({ ...state, title: e.target.value })}
          required
          name="title"
        />

        <Card className="mt-4 w-full border border-secondary bg-transparent">
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:gap-6">
            <TextField
              label="Item Name"
              value={item.title}
              onChange={(e) => setItem({ ...item, title: e.target.value })}
              name="item-title"
            />

            <div className="flex w-full flex-row gap-4 md:w-[300px]">
              <div className="w-1/2 md:w-[200px]">
                <UnitSelector value={item.unit} onChange={handleUnitSelect} />
              </div>

              <div className="w-1/2 md:w-[150px]">
                <TextField
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                  name="quantity"
                  onChange={(e) => {
                    const raw = e.target.value;
                    setItem({ ...item, quantity: raw === "" ? null : +raw });
                  }}
                />
              </div>
            </div>

            <Button disabled={!item.title} onClick={handleAddItem}>
              Add
            </Button>
          </CardContent>
        </Card>

        {!!state.items.length && (
          <ul className="my-4 flex flex-col gap-2 overflow-y-auto rounded">
            {state.items.map((item: ShoppingItem) => (
              <ShoppingListItem
                key={item.id}
                item={item}
                onDelete={() =>
                  setState({ ...state, items: state.items.filter((i) => i.id !== item.id) })
                }
                onEdit={() => setEditItemData(item)}
              />
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            disabled={isPending || !state.title || !state.items.length}
            onClick={() => mutate()}
            classes={{ root: "w-[150px]" }}
          >
            {isPending && <SpinnerIcon className="absolute left-[16px] w-[20px]" />}
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </div>

      {editItemData && (
        <EdititemDialog
          open={Boolean(editItemData)}
          onClose={setEditItemData}
          data={editItemData}
          onSubmit={(updatedItem) => {
            setState((prev) => ({
              ...prev,
              items: prev.items.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
            }));
            setEditItemData(null);
          }}
        />
      )}
    </>
  );
}

interface EdititemDialogProps {
  open: boolean;
  onClose: (b: ShoppingItem | null) => void;
  data: ShoppingItem;
  onSubmit: (data: ShoppingItem) => void;
}

const EdititemDialog = ({ open, onClose, data, onSubmit }: EdititemDialogProps) => {
  const [item, setItem] = useState<ShoppingItem>(data);

  const handleClose = () => {
    onClose(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  const handleUnitSelect = (option: string) => {
    console.log("option", option);
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
          <TextField label="Item Name" value={item.title} onChange={handleChange} name="title" />

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
            // disabled={isPending}
            type="button"
            onClick={handleSubmit}
            classes={{ root: "w-[150px]" }}
          >
            {/* {isPending && <SpinnerIcon className="absolute left-[16px] w-[20px]" />} */}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
