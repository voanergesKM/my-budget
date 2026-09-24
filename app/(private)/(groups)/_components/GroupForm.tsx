"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Group, PendingMember, User } from "@/app/lib/definitions";

import { deleteUploadedImage } from "@/app/lib/api/deleteUploadedImage";

import { Button } from "@/app/ui/shadcn/Button";

import { AvatarUploader } from "@/app/ui/components/AvatarUploader";
import ConfirmationDialog from "@/app/ui/components/common/ConfirmationDialog";
import { CurrencySelect } from "@/app/ui/components/CurrencySelect";
import { useAppForm } from "@/app/ui/components/Form";
import { PageTitle } from "@/app/ui/components/PageTitle";

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

export default function GroupForm(props: Props) {
  const { groupId } = useParams();
  const isEdit = Boolean(groupId);

  const t = useTranslations("Groups");
  const td = useTranslations("Dialogs");
  const te = useTranslations("Entities");
  const tb = useTranslations("Common.buttons");
  const ti = useTranslations("Common.inputs");

  const router = useRouter();
  const session = useSession();
  const currentUser = session.data?.user;

  const { mutateAsync: sendCreate, isPending: isCreating } =
    useCreateGroupMutation(() => {
      router.back();
    });

  const { mutateAsync: sendUpdate, isPending: isUpdating } =
    useUpdateGroupMutation(() => {
      router.back();
    });

  const { mutate, isPending: isDeletingMember } = useDeleteGroupMemberMutation(
    () => {
      setDeleteMemberData(null);
    }
  );

  const form = useAppForm({
    defaultValues: (props.initialData as any) || initialState,
    onSubmit: async ({ value }) => {
      if (isEdit) {
        await sendUpdate({ id: groupId as string, payload: value });
      } else {
        await sendCreate(value);
      }
    },
  });

  const [deleteMemberData, setDeleteMemberData] = useState<
    PendingMember | User | null
  >(null);

  const handleCancel = () => {
    router.back();
    if (!isEdit) {
      const image = form.getFieldValue("image");
      if (image) deleteUploadedImage(image);
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

  const disabledDelete = (member: PendingMember | User) => {
    const createdById = props.initialData?.createdBy?._id;
    return (
      member._id === createdById ||
      (createdById !== currentUser?.id &&
        (currentUser as User)?.role !== "admin")
    );
  };

  return (
    <div className="mx-auto mt-6 max-w-3xl">
      <PageTitle
        title={td(isEdit ? "editTitle" : "createTitle", {
          entity: te("group.accusative"),
        })}
      />

      <form.AppForm>
        <div className="my-4">
          <form.AppField name="image">
            {(field) => (
              <AvatarUploader
                image={field.state.value}
                onUpload={(url) => {
                  if (!isEdit && field.state.value) {
                    deleteUploadedImage(field.state.value);
                  }
                  field.handleChange(url);
                }}
                title={t("groupImage")}
              />
            )}
          </form.AppField>
        </div>

        <div className="flex flex-col gap-4">
          <form.AppField name="name">
            {(field) => <field.TextField label={ti("title")} required />}
          </form.AppField>

          <form.AppField name="description">
            {(field) => <field.TextField label={ti("description")} />}
          </form.AppField>

          <form.AppField name="defaultCurrency">
            {(field) => (
              <CurrencySelect
                value={field.state.value}
                onChange={(option) => {
                  if (!option || typeof option === "string") return;
                  field.handleChange(option.value);
                }}
              />
            )}
          </form.AppField>
        </div>

        <div className="mt-4 flex">
          <form.Subscribe
            selector={(state) => [
              state.values.pendingMembers,
              state.values.members,
            ]}
          >
            {([pendingMembers, members]) => {
              const pending = pendingMembers || [];
              const currMembers = members || [];
              const existingEmails = [
                ...pending.map((m: any) => m.email),
                ...currMembers.map((m: any) => m.email),
              ];

              return (
                <InviteMemberDialog
                  existingEmails={existingEmails}
                  onAdd={(email) => {
                    form.setFieldValue("pendingMembers", [
                      ...pending,
                      { email },
                    ]);
                  }}
                />
              );
            }}
          </form.Subscribe>
        </div>

        <form.AppField name="pendingMembers">
          {(field) => {
            const pendingMembers = field.state.value || [];
            return pendingMembers.length ? (
              <>
                <p className="my-4 text-text-primary">
                  {t("pendingMembers")}: {pendingMembers.length}
                </p>
                {pendingMembers.map((member: PendingMember) => (
                  <MemberCard
                    key={member.email}
                    member={member}
                    onRemove={(m) => {
                      if (isEdit && m._id) {
                        setDeleteMemberData(m);
                      } else {
                        field.handleChange(
                          pendingMembers.filter(
                            (pm: PendingMember) => pm.email !== m.email
                          )
                        );
                      }
                    }}
                    disabledDelete={disabledDelete}
                  />
                ))}
              </>
            ) : null;
          }}
        </form.AppField>

        <form.AppField name="members">
          {(field) => {
            const members = field.state.value || [];
            return members.length ? (
              <>
                <p className="my-4 text-text-primary">
                  {t("invitedMembers")}: {members.length}
                </p>
                {members.map((member: User) => (
                  <MemberCard
                    key={member.email}
                    member={member}
                    disabledDelete={disabledDelete}
                    onRemove={(m) => {
                      if (isEdit && m._id) {
                        setDeleteMemberData(m);
                      }
                    }}
                  />
                ))}
              </>
            ) : null;
          }}
        </form.AppField>

        <div className="mt-6 flex items-center justify-center gap-4">
          <form.SubmitButton
            label={tb(isEdit ? "update" : "create", { entity: "" })}
            className="md:w-fit"
          />
          <Button disabled={loading} onClick={handleCancel} size={"md"}>
            {tb("cancel")}
          </Button>
        </div>
      </form.AppForm>

      <ConfirmationDialog<PendingMember | User>
        open={!!deleteMemberData}
        loading={isDeletingMember}
        data={deleteMemberData!}
        onClose={() => setDeleteMemberData(null)}
        confirmationQusestion={td("deleteGroupMemberMessage")}
        onDecision={handleDecision}
        renderItems={(data) => data?.email}
      />
    </div>
  );
}
