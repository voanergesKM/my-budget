"use client";

import { useState } from "react";

import { Group, User } from "@/app/lib/definitions";
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
  state,
  setState,
}: {
  state: Omit<Group, "_id">;
  setState: React.Dispatch<React.SetStateAction<Omit<Group, "_id">>>;
}) {
  const [open, setOpen] = useState(false);
  const [member, setMember] = useState("");

  const handleAddMember = () => {
    if (!member) {
      Notify.warning("Please enter an email.");
      return;
    }

    if (!isValidEmail(member)) {
      Notify.warning("Invalid email format.");
      return;
    }

    if (
      state.pendingMembers.some((n) => n.email === member) ||
      state.members?.some((n: User) => n.email === member)
    ) {
      Notify.warning("Member already exists!");
      return;
    }

    setState({
      ...state,
      pendingMembers: [...state.pendingMembers, { email: member }],
    });

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
        <Button>Add Member</Button>
      </DialogTrigger>

      <DialogContent className="max-w-[360px] gap-2 bg-primary md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription className="text-secondary">
            Add email to invite a new member
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          <TextField
            label="Email"
            value={member}
            onChange={(e) => setMember(e.target.value)}
            type="email"
          />
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleAddMember}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default InviteMemberDialog;
