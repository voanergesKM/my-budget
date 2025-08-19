"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Edit2, Trash2Icon, UserIcon, UsersIcon } from "lucide-react";

import { Group } from "@/app/lib/definitions";

import { Avatar, AvatarImage } from "@/app/ui/shadcn/Avatar";
import { Button } from "@/app/ui/shadcn/Button";
import { Card, CardContent, CardHeader } from "@/app/ui/shadcn/Card";

type GroupCardProps = {
  group: Group;
  setDeleteData: React.Dispatch<React.SetStateAction<Group | null>>;
};

export const GroupCard = ({ group, setDeleteData }: GroupCardProps) => {
  const router = useRouter();

  const t = useTranslations("Groups");

  const session = useSession();

  const currentUser = session.data?.user;

  const totalMembers = group.members?.length ?? 0;
  const createdByName = group.createdBy?.fullName || "Unknown";

  const handleEdit = () => {
    router.push(`group/update/${group._id}`);
  };

  const handleDeleteGroup = () => {
    setDeleteData(group);
  };

  return (
    <Card className="w-[325px] cursor-pointer text-text-primary transition-all hover:shadow-xl">
      <CardHeader className="relative flex items-center gap-4">
        <div className="absolute right-2 top-2 ml-auto flex gap-2">
          <Button
            onClick={handleEdit}
            size={"icon"}
            variant={"ghost"}
            className="rounded-full"
          >
            <Edit2 />
          </Button>

          <Button
            size={"icon"}
            variant={"ghost"}
            className="rounded-full"
            onClick={handleDeleteGroup}
            disabled={
              currentUser?.id !== group.createdBy?._id &&
              (currentUser as any).role !== "admin"
            }
          >
            <Trash2Icon />
          </Button>
        </div>
        <Avatar className="h-[250px] w-[250px]">
          <AvatarImage
            className="rounded-full object-cover"
            src={group.image || "/image-placeholder.avif"}
            alt={group.name}
            sizes="100px"
          />
        </Avatar>

        <div className="text-center">
          <div className="text-lg font-semibold">{group.name}</div>
          {group.description && (
            <div className="text-sm">{group.description}</div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <UserIcon className="h-4 w-4" />
          <span>
            {t("createdBy")}: {createdByName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <UsersIcon className="h-4 w-4" />
          <span>
            {t("members")}: {totalMembers}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
