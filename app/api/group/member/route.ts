import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { deleteGroupMember } from "@/app/lib/db/controllers/groupController";
import { deleteMemberInvitation } from "@/app/lib/db/controllers/pendingInvitationController";
import {
  deleteUserFeromGroup,
  getUser,
} from "@/app/lib/db/controllers/userController";

export const DELETE = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get("memberId");
  const groupId = searchParams.get("groupId");
  const origin = searchParams.get("origin");

  const currentUser = await getUser(token);

  if (memberId && groupId && origin) {
    if (origin === "pending") {
      const data = await deleteMemberInvitation(memberId, currentUser);

      return NextResponse.json({ success: true, data }, { status: 200 });
    } else if (origin === "member") {
      const data = await Promise.all([
        deleteGroupMember(groupId, memberId, currentUser),
        deleteUserFeromGroup(groupId, memberId, currentUser),
      ]);

      return NextResponse.json({ success: true, data }, { status: 200 });
    }
  }

  return NextResponse.json(
    { success: false, data: null, message: "Something went wrong" },
    { status: 400 }
  );
});
