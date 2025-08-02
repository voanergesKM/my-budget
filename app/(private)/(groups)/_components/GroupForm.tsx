"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Group, PendingMember, User } from "@/app/lib/definitions";

import { deleteUploadedImage } from "@/app/lib/api/deleteUploadedImage";

import { Button } from "@/app/ui/shadcn/Button";

import { AvatarUploader } from "@/app/ui/components/AvatarUploader";
import ConfirmationDialog from "@/app/ui/components/common/ConfirmationDialog";
import {
  CurrencyOption,
  CurrencySelect,
} from "@/app/ui/components/CurrencySelect";
import { PageTitle } from "@/app/ui/components/PageTitle";
import { TextField } from "@/app/ui/components/TextField";

import { useDeleteGroupMemberMutation } from "../_hooks/useDeleteGroupMemberMutation";
import {
  useCreateGroupMutation,
  useUpdateGroupMutation,
} from "../_hooks/useSendGroupMutation";

import InviteMemberDialog from "./InviteMemberDialog";
import { MemberCard } from "./MemberCard";

type Props = {
  initialData?: Group;
};

const initialState = {
  name: "",
  description: "",
  image: "",
  pendingMembers: [] as PendingMember[],
  defaultCurrency: "USD",
};

export default function GroupFrom(props: Props) {
  const { groupId } = useParams();

  const isEdit = Boolean(groupId);

  const router = useRouter();

  const session = useSession();

  const currentUser = session.data?.user;

  const { mutate: sendCreate, isPending: isCreating } = useCreateGroupMutation(
    () => {
      router.back();
    }
  );

  const { mutate: sendUpdate, isPending: isUpdating } = useUpdateGroupMutation(
    () => {
      router.back();
    }
  );

  const { mutate, isPending: isDeletingMember } = useDeleteGroupMemberMutation(
    () => {
      setDeleteMemberData(null);
    }
  );

  const [state, setState] = useState<Omit<Group, "_id">>(initialState);
  const [deleteMemberData, setDeleteMemberData] = useState<
    PendingMember | User | null
  >(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setState({
      ...state,
      [name]: value,
    });
  };

  const handleCurrencyChange = (option: string | CurrencyOption | null) => {
    if (!option) return;
    if (typeof option === "string") {
    } else if (option) {
      setState((prev) => ({ ...prev, defaultCurrency: option.value }));
    }
  };

  useEffect(() => {
    if (props.initialData) {
      setState(props.initialData);
    }
  }, [props.initialData]);

  const handleImageUpload = (url: string) => {
    handleDeleteImage();

    setState((prev) => ({
      ...prev,
      image: url,
    }));
  };

  const handleSubmit = async () => {
    if (isEdit) {
      sendUpdate({ id: groupId as string, payload: state });
    } else {
      sendCreate(state);
    }
  };

  const handleCancel = () => {
    router.back();
    handleDeleteImage();
  };

  function handleDeleteImage() {
    if (!isEdit && state.image) {
      deleteUploadedImage(state.image);
    }
  }

  const onRemovePendingMember = (member: PendingMember) => {
    const onDelete = () =>
      setState((prev) => ({
        ...prev,
        pendingMembers: prev.pendingMembers.filter(
          (m) => m.email !== member.email
        ),
      }));

    if (isEdit) {
      if (member._id) {
        setDeleteMemberData(member);
      } else {
        onDelete();
      }
    } else {
      onDelete();
    }
  };

  const handleDecision = () => {
    mutate({
      memberId: deleteMemberData!._id as string,
      origin:
        deleteMemberData && "role" in deleteMemberData ? "member" : "pending",
      groupId: groupId as string,
    });
  };

  const loading = isCreating || isUpdating;

  const disabledDelete = (member: PendingMember | User) =>
    member._id === state.createdBy?._id ||
    (state.createdBy?._id !== currentUser?.id &&
      (currentUser as User).role !== "admin");

  return (
    <div className="mx-auto mt-6 max-w-3xl">
      <PageTitle title={isEdit ? "Edit Group" : "Create New Group"} />

      <div className="my-4">
        <AvatarUploader
          image={state.image}
          onUpload={handleImageUpload}
          title="Group Image"
        />
      </div>

      <div className="flex flex-col gap-4">
        <TextField
          label="Group Name"
          value={state.name}
          onChange={handleChange}
          required
          name="name"
        />
        <TextField
          label="Group Description"
          value={state.description}
          onChange={handleChange}
          name="description"
        />
        <CurrencySelect
          value={state.defaultCurrency}
          onChange={handleCurrencyChange}
        />
      </div>

      <div className="mt-4 flex">
        <InviteMemberDialog state={state} setState={setState} />
      </div>

      {!!state.pendingMembers?.length && (
        <>
          <p className="my-4 text-text-primary">
            Pending Members: {state.pendingMembers.length}
          </p>
          {state.pendingMembers.map((member) => (
            <MemberCard
              key={member.email}
              member={member}
              onRemove={onRemovePendingMember}
              disabledDelete={disabledDelete}
            />
          ))}
        </>
      )}

      {!!state.members?.length && (
        <>
          <p className="my-4 text-text-primary">
            Invited Members: {state.members.length}
          </p>
          {state.members.map((member) => (
            <MemberCard
              key={member.email}
              member={member}
              disabledDelete={disabledDelete}
              onRemove={onRemovePendingMember}
            />
          ))}
        </>
      )}

      <div className="mt-6 flex items-center justify-center gap-4">
        <Button
          disabled={loading}
          onClick={handleSubmit}
          isLoading={loading}
          size={"lg"}
        >
          {isEdit ? "Update" : "Create"}
        </Button>

        <Button disabled={loading} onClick={handleCancel} size={"lg"}>
          Cancel
        </Button>
      </div>

      <ConfirmationDialog<PendingMember | User>
        open={!!deleteMemberData}
        loading={isDeletingMember}
        data={deleteMemberData!}
        onClose={() => setDeleteMemberData(null)}
        confirmationQusestion="Are you sure you want to remove this member?"
        onDecision={handleDecision}
        renderItems={(data) => data?.email}
      />
    </div>
  );
}
