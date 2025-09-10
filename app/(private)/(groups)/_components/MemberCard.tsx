"use client";

import { Trash2 } from "lucide-react";

import { PendingMember, User } from "@/app/lib/definitions";
import { getOptimizedAvatar } from "@/app/lib/utils/getOptimizedAvatar";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/ui/shadcn/Avatar";
import { Button } from "@/app/ui/shadcn/Button";
import { Card, CardContent } from "@/app/ui/shadcn/Card";

type MemberCardProps = {
  member: PendingMember | User;
  onRemove?: (member: PendingMember | User) => void;
  disabledDelete: (member: PendingMember | User) => boolean;
};

export function MemberCard({
  member,
  onRemove,
  disabledDelete,
}: MemberCardProps) {
  const isPending = !("role" in member);

  const displayName =
    "fullName" in member
      ? member.fullName
      : "firstName" in member && "lastName" in member
        ? `${member.firstName} ${member.lastName}`
        : member.email;

  return (
    <Card key={member.email} className="mb-4 bg-transparent">
      <CardContent className="flex items-center justify-between px-4 py-2 text-text-primary">
        <div className="flex items-center gap-4">
          {isUser(member) ? (
            <Avatar>
              <AvatarImage
                src={
                  member.avatarURL
                    ? getOptimizedAvatar(member.avatarURL, 40)
                    : ""
                }
                alt={"User avatar"}
              />
              <AvatarFallback>
                {member.firstName?.[0]?.toUpperCase() || ""}
                {member.lastName?.[0]?.toUpperCase() || ""}
              </AvatarFallback>
            </Avatar>
          ) : null}

          <div className="flex flex-col">
            <span className="font-medium">{displayName}</span>
            <span className="text-xs text-text-primary">
              {member.email}
              {isPending && member.status ? ` — ${member.status}` : ""}
            </span>
          </div>
        </div>

        {!!onRemove && (
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full p-1"
            disabled={disabledDelete(member)}
            onClick={() => onRemove(member)}
            aria-label="Remove member"
          >
            <Trash2 />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function isUser(member: PendingMember | User): member is User {
  return "role" in member;
}
