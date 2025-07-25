import { Group, User } from "@/app/lib/definitions";

import { ForbiddenError, NotFoundError } from "@/app/lib/errors/customErrors";

import hasUserOrGroupAccess from "./hasUserOrGroupAccess";

type EntityAccessOptions<T> = {
  adminRoleName?: string;
  getCreatedBy?: (obj: T) => string | undefined | null;
  getGroupId?: (obj: T) => string | undefined | null;
  getMembers?: (obj: T) => Array<{ _id: string }> | undefined | null;
};

export async function withAccessCheck<T>(
  getEntity: () => Promise<T | T[] | null>,
  user: User,
  options?: EntityAccessOptions<T>
): Promise<T | T[]> {
  const entity = await getEntity();

  if (!entity || (Array.isArray(entity) && entity.length === 0)) {
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

  const userGroupIds = user.groups.map((g: string | Group) =>
    typeof g === "string" ? g : g._id.toString()
  );

  const canAccessEntity = (item: T) =>
    isAdmin ||
    hasUserOrGroupAccess(item, {
      userId: user._id,
      userGroupIds,
      getCreatedBy,
      getGroupId,
      getMembers,
    });

  if (Array.isArray(entity)) {
    const accessibleEntities = entity.filter(canAccessEntity);

    if (accessibleEntities.length === 0) {
      throw new ForbiddenError();
    }

    return accessibleEntities;
  }

  if (!canAccessEntity(entity)) {
    throw new ForbiddenError();
  }

  return entity;
}
