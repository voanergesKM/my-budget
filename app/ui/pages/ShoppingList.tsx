"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/ui/shadcn/Dialog";
import { v4 as uuid } from "uuid";
import Button from "@/app/ui/components/Button";
import { getShoppingsList } from "@/app/lib/api/shoppings/getShoppingsList";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { createShopping } from "@/app/lib/api/shoppings/createShopping";
import SpinnerIcon from "@/app/ui/components/SpinnerIcon";
import { TextField } from "@/app/ui/components/TextField";
import { Shopping, ShoppingItem } from "@/app/lib/definitions";
import { formatDate } from "@/app/lib/utils/dateUtils";
import SelectField from "../components/common/SelectField";
import UnitSelector from "../components/UnitSelector";

type Unit = {
  value: string;
  label: string;
  title: string;
};

export default function ShoppingList() {
  const params = useParams();
  const queryClient = useQueryClient();

  const groupId = params?.groupId as string;
  const [open, setOpen] = useState(false);

  const [item, setItem] = useState({
    title: "",
    // quantity: 1,
    unit: "pcs",
  });

  const [state, setState] = useState<Pick<Shopping, "title" | "items">>({
    title: "",
    items: [],
  });

  const shoppingListKey = ["shoppingList", groupId ?? "all"];

  const { data } = useQuery({
    queryKey: shoppingListKey,
    queryFn: () => getShoppingsList(groupId),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => createShopping({ ...state, groupId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shoppingListKey });
      setOpen(false);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const handleUnitSelect = (value: string) => {
    setItem({ ...item, unit: value });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create Shopping</Button>
        </DialogTrigger>

        <DialogContent className="max-w-[360px] gap-2 bg-primary md:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Purchase List</DialogTitle>
            <DialogDescription className="text-secondary">
              Give your list a title and start planning purchases.
            </DialogDescription>
          </DialogHeader>

          <TextField
            label="List Title"
            value={state.title}
            onChange={(e) => setState({ ...state, title: e.target.value })}
            required
            name="title"
          />

          <div className="my-2 flex w-full items-end space-x-4">
            <TextField
              label="Item Name"
              value={item.title}
              onChange={(e) => setItem({ ...item, title: e.target.value })}
              name="title"
            />
            <UnitSelector value={item.unit} onChange={handleUnitSelect} />

            <Button
              disabled={!item.title}
              onClick={() => {
                setState({ ...state, items: [{ ...item, id: uuid() }, ...state.items] });
                setItem({ title: "", unit: "" });
              }}
            >
              Add
            </Button>
          </div>

          {!!state.items.length && (
            <ul className="my-2 flex max-h-[200px] flex-col gap-2 overflow-y-auto">
              {state.items.map((item: ShoppingItem) => (
                <li key={item.id}>{item.title}</li>
              ))}
            </ul>
          )}

          <DialogFooter className="mt-2">
            <Button
              disabled={isPending}
              type="button"
              onClick={() => mutate()}
              classes={{ root: "w-[150px]" }}
            >
              {isPending && <SpinnerIcon className="absolute left-[16px] w-[20px]" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {data && (
        <ul className="flex flex-col items-center gap-4">
          {data.map((list: Shopping) => (
            <li key={list._id} className="flex items-center gap-2">
              <span>{list.title}</span>
              <span>{list.items.length}</span>
              <span>{formatDate(list.createdAt, "time")}</span>
              <span>{formatDate(list.updatedAt, "time")}</span>
              <span>{list.createdBy.fullName}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
