"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import Notify from "@/app/lib/utils/notify";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/ui/shadcn/Dialog";

import { TextField } from "@/app/ui/components/TextField";

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export function InviteMemberDialog({
  existingEmails,
  onAdd,
}: {
  existingEmails: string[];
  onAdd: (email: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [member, setMember] = useState("");

  const t = useTranslations("Groups");
  const ti = useTranslations("Common.inputs");
  const tb = useTranslations("Common.buttons");

  const handleAddMember = () => {
    if (!member) {
      Notify.warning("Please enter an email.");
      return;
    }

    if (!isValidEmail(member)) {
      Notify.warning("Invalid email format.");
      return;
    }

    if (existingEmails.includes(member)) {
      Notify.warning("Member already exists!");
      return;
    }

    onAdd(member);
    setMember("");
    setOpen(false);
  };

  const onClose = () => {
    setMember("");
    setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button size={"sm"}>{t("addMember")}</Button>
      </DialogTrigger>

      <DialogContent className="max-w-[360px] gap-2 bg-primary md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("addMember")}</DialogTitle>
          <DialogDescription className="text-secondary" hidden>
            {t("addDialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          <TextField
            label={ti("email")}
            value={member}
            onChange={(e) => setMember(e.target.value)}
            type="email"
          />
        </div>

        <DialogFooter className="flex flex-row justify-end space-x-4">
          <Button type="submit" onClick={handleAddMember}>
            {tb("add")}
          </Button>
          <Button onClick={onClose}>{tb("cancel")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default InviteMemberDialog;
