import { v4 as uuidv4 } from "uuid";

import { UserSession } from "@/app/lib/definitions";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";

import { PendingInvitation } from "@/app/lib/db/models";
import dbConnect from "@/app/lib/db/mongodb";

type AddPendingInvitationArgs = {
  emails: string[];
  groupId: string;
  invitedBy: string;
};

export const addPendingInvitation = async ({
  emails,
  groupId,
  invitedBy,
}: AddPendingInvitationArgs) => {
  await dbConnect();

  const invitations = emails.map((email) => ({
    email: email.toLowerCase(),
    groupId,
    invitedBy,
    token: uuidv4(),
  }));

  try {
    return await PendingInvitation.insertMany(invitations, { ordered: false });
  } catch (error: any) {
    if (error.code === 11000 || error.name === "MongoBulkWriteError") {
      console.warn("Some invitations already exist, skipping duplicates.");
      return;
    }

    throw error;
  }
};

export const deleteMemberInvitation = async (
  id: string,
  currentUser: UserSession["user"]
) => {
  await dbConnect();

  return await withAccessCheck(
    () => PendingInvitation.findByIdAndDelete(id),
    currentUser
  );
};
