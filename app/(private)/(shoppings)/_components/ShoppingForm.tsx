"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuid } from "uuid";

import { Shopping, ShoppingItem } from "@/app/lib/definitions";
import Notify from "@/app/lib/utils/notify";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { createShopping } from "@/app/lib/api/shoppings/createShopping";
import { updateShopping } from "@/app/lib/api/shoppings/updateShopping";

import { Button } from "@/app/ui/shadcn/Button";
import { Card, CardContent } from "@/app/ui/shadcn/Card";

import { PageTitle } from "@/app/ui/components/PageTitle";
import { TextField } from "@/app/ui/components/TextField";
import UnitSelector from "@/app/ui/components/UnitSelector";

import EdititemDialog from "./EdititemDialog";
import ShoppingListItem from "./ShoppingListItem";

type ShoppingFormProps = {
  initialData?: Shopping;
};

const initialItemState = {
  title: "",
  unit: "pcs",
  quantity: 1,
  completed: false,
};

export default function ShoppingForm({ initialData }: ShoppingFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = Boolean(initialData);

  const tDialogs = useTranslations("Dialogs");
  const tEntities = useTranslations("Entities");
  const tInputs = useTranslations("Common.inputs");
  const tButtons = useTranslations("Common.buttons");

  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId") || undefined;

  const shoppingListKey = [QueryKeys.shoppingList, groupId ?? "all"];

  const [item, setItem] = useState<ShoppingItem>(initialItemState);

  const [editItemData, setEditItemData] = useState<ShoppingItem | null>(null);

  const [state, setState] = useState<Pick<Shopping, "title" | "items" | "_id">>(
    {
      _id: initialData?._id || "",
      title: "",
      items: [],
    }
  );

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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: shoppingListKey });

      if (isEdit) {
        queryClient.setQueryData(
          [...QueryKeys.getCurrentShopping, initialData!._id],
          {
            success: true,
            data: data.data,
            message: data.message,
          }
        );
      }

      const location = groupId ? `/shoppings?groupId=${groupId}` : "/shoppings";

      Notify.success(data.message);
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
          title={tDialogs(isEdit ? "editTitle" : "createTitle", {
            entity: tEntities("shopping.nominative"),
          })}
          className="mb-6"
        />

        <TextField
          label={tInputs("title")}
          value={state.title}
          onChange={(e) => setState({ ...state, title: e.target.value })}
          required
          name="title"
        />

        <Card className="mt-4 w-full border border-secondary bg-transparent">
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:gap-6">
            <TextField
              label={tInputs("title")}
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
                  label={tInputs("quantity")}
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
              {tButtons("add")}
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
                  setState({
                    ...state,
                    items: state.items.filter((i) => i.id !== item.id),
                  })
                }
                onEdit={setEditItemData}
                shoppingId={state._id}
              />
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            size={"md"}
            className="px-10"
            onClick={() => mutate()}
            isLoading={isPending}
          >
            {tButtons(isEdit ? "update" : "create", { entity: "" })}
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
              items: prev.items.map((i) =>
                i.id === updatedItem.id ? updatedItem : i
              ),
            }));
            setEditItemData(null);
          }}
        />
      )}
    </>
  );
}
