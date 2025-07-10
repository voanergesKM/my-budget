import { Types } from "mongoose";

type AccessCheckOptions<T> = {
  userId: string;
  userGroupIds: string[];
  getCreatedBy?: (obj: T) => string | undefined | null;
  getGroupId?: (obj: T) => string | undefined | null;
};

function hasUserOrGroupAccess<T>(
  obj: T,
  options: AccessCheckOptions<T>
): boolean {
  const getCreatedBy =
    options.getCreatedBy ?? ((o: any) => o.createdBy?.toString());
  const getGroupId = options.getGroupId ?? ((o: any) => o.groupId?.toString());

  const createdBy = getCreatedBy(obj);
  const groupId = getGroupId(obj);

  return (
    createdBy === options.userId ||
    (groupId !== undefined &&
      groupId !== null &&
      options.userGroupIds.includes(groupId))
  );
}

export default hasUserOrGroupAccess;
