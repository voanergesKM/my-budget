"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Category } from "@/app/lib/definitions";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/ui/shadcn/Dialog";
import { Label } from "@/app/ui/shadcn/label";
import { RadioGroup, RadioGroupItem } from "@/app/ui/shadcn/radio-group";
import { Switch } from "@/app/ui/shadcn/switch";

import { ColorPicker } from "@/app/ui/components/ColorPicker";
import {
  CategoryOption,
  DefaultCategorySelect,
} from "@/app/ui/components/DefaultCategorySelect";
import { TextField } from "@/app/ui/components/TextField";

import { CategoryIconKey, categoryIcons } from "@/app/ui/icons/categories";

import { useSendCategoryMutation } from "../_hooks/useSendCategoryMutation";

type DialogProps = {
  initial?: CategoryDialogState | null;
  open: boolean;
  onOpenChange: () => void;
};

type CategoryDialogState = Omit<Category, "group" | "createdBy"> & {
  category?: string;
};

const initialState: CategoryDialogState = {
  _id: "",
  name: "",
  icon: "other" as CategoryIconKey,
  color: "",
  category: "other",
  type: "outgoing",
  includeInAnalytics: true,
};

const CategoryDialog = ({ initial, open, onOpenChange }: DialogProps) => {
  const searchParams = useSearchParams();

  const origin = searchParams.get("origin");
  const groupId = searchParams.get("groupId");

  const t = useTranslations("Categories");
  const td = useTranslations("Dialogs");
  const te = useTranslations("Entities");
  const ti = useTranslations("Common.inputs");
  const tb = useTranslations("Common.buttons");

  const [state, setState] = useState<CategoryDialogState>(
    initial ?? initialState
  );

  const isEdit = Boolean(state?._id);

  const { mutate, isPending } = useSendCategoryMutation(isEdit, () => {
    handleClose();
  });

  useEffect(() => {
    if (origin && (origin === "outgoing" || origin === "incoming")) {
      setState((prev) => ({
        ...prev,
        type: origin as "outgoing" | "incoming",
      }));
    }
  }, [origin, open]);

  useEffect(() => {
    if (initial && !!Object.values(initial).length) {
      setState(initial);
    } else {
      setState(initialState);
    }
  }, [initial]);

  const handleCategoryChange = (option: string | CategoryOption | null) => {
    if (typeof option === "string") {
      setState((prev) => ({ ...prev, category: option }));
    } else if (option) {
      setState((prev) => ({
        ...prev,
        category: option.value,
        name: option.label,
        color: option.color,
        icon: option.icon as CategoryIconKey,
      }));
    }
  };

  const includeAnalyticsChange = (checked: boolean) => {
    setState((prev) => ({ ...prev, includeInAnalytics: checked }));
  };

  const handleClose = () => {
    setState(initialState);
    onOpenChange();
  };

  const handleSubmit = () => {
    mutate({ ...state, groupId: groupId ?? null });
  };

  const IconComponent = categoryIcons[state.icon as keyof typeof categoryIcons];

  const dialogTitle = td(isEdit ? "editTitle" : "createTitle", {
    entity: te("category.accusative"),
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription hidden>{t("pageDescription")}</DialogDescription>
        </DialogHeader>

        {IconComponent && (
          <div className="flex items-center justify-center">
            <div
              className="relative flex h-24 w-24 items-center justify-center rounded-full md:h-36 md:w-36"
              style={{ backgroundColor: state.color }}
            >
              <IconComponent className="size-16 text-white md:size-24" />

              <div className="absolute -right-14 top-1">
                <ColorPicker
                  selected={state.color}
                  onSelect={(color) => setState({ ...state, color })}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <Label>{t("categoryType")}:</Label>
          <RadioGroup
            defaultValue={state.type || "outgoing"}
            className="flex gap-4"
            onValueChange={(value) =>
              setState({ ...state, type: value as "outgoing" | "incoming" })
            }
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="outgoing" id="r1" />
              <Label htmlFor="r1" className="cursor-pointer">
                {te("expense.nominative")}
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="incoming" id="r2" />
              <Label htmlFor="r2" className="cursor-pointer">
                {te("income.nominative")}
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="airplane-mode"
            checked={state.includeInAnalytics}
            onCheckedChange={includeAnalyticsChange}
          />
          <Label htmlFor="airplane-mode">Inculde in analytics</Label>
        </div>

        {state.category && (
          <DefaultCategorySelect
            type={state.type as "incoming" | "outgoing"}
            value={state.category}
            onChange={handleCategoryChange}
          />
        )}

        <TextField
          label={ti("title")}
          name="name"
          value={state.name}
          onChange={(e) => setState({ ...state, name: e.target.value })}
        />
        <DialogFooter className="mt-6">
          <Button onClick={handleSubmit} isLoading={isPending} size={"md"}>
            {tb(isEdit ? "update" : "create", {
              entity: "",
            })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
