import { UserSession } from "@/app/lib/definitions";

import { ForbiddenError, NotFoundError } from "@/app/lib/errors/customErrors";

import hasUserOrGroupAccess from "./hasUserOrGroupAccess";

type User = UserSession["user"];

type EntityAccessOptions<T> = {
  adminRoleName?: string;
  getCreatedBy?: (obj: T) => string | undefined | null;
  getGroupId?: (obj: T) => string | undefined | null;
  getMembers?: (obj: T) => Array<{ _id: string }> | undefined | null;
};

export async function withAccessCheck<T>(
  getEntity: () => Promise<T | null>,
  user: User,
  options?: EntityAccessOptions<T>
): Promise<T> {
  const entity = await getEntity();

  if (!entity) {
    throw new NotFoundError("Entity not found");
  }

  const {
    getCreatedBy = (obj: any) =>
      typeof obj.createdBy === "object"
        ? obj.createdBy?._id?.toString()
        : obj.createdBy?.toString(),

    getGroupId = (obj: any) =>
      obj.groupId?.toString?.() ?? obj._id?.toString?.(),

    getMembers = (obj: any) => obj.members,
  } = options ?? {};

  const isAdmin = user.role === (options?.adminRoleName ?? "admin");

  const canAccess =
    isAdmin ||
    hasUserOrGroupAccess(entity, {
      userId: user.id,
      userGroupIds: user.groups,
      getCreatedBy,
      getGroupId,
      getMembers,
    });

  if (!canAccess) {
    throw new ForbiddenError();
  }

  return entity;
}
