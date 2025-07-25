import { Group } from "../definitions";

type AccessCheckOptions<T> = {
  userId: string;
  userGroupIds: string[] | Group[];
  getCreatedBy?: (obj: T) => string | undefined | null;
  getGroupId?: (obj: T) => string | undefined | null;
  getMembers?: (obj: T) => Array<{ _id: string }> | undefined | null;
};

function hasUserOrGroupAccess<T>(
  obj: T,
  options: AccessCheckOptions<T>
): boolean {
  const getCreatedBy =
    options.getCreatedBy ?? ((o: any) => o.createdBy?._id?.toString?.());
  const getGroupId =
    options.getGroupId ?? ((o: any) => o.groupId?.toString?.());
  const getMembers = options.getMembers;

  const createdBy = getCreatedBy(obj);
  const groupId = getGroupId(obj);
  const members = getMembers?.(obj);

  return (
    createdBy === options.userId.toString() ||
    (groupId && options.userGroupIds.includes(groupId.toString())) ||
    (members?.some((m) => m._id.toString() === options.userId) ?? false)
  );
}

export default hasUserOrGroupAccess;
