import { User } from "@/app/lib/definitions";

export function buildTransactionAccessFilter(
  user: User,
  extraFilter: Record<string, any> = {}
) {
  if (user.role === "admin") {
    return extraFilter;
  }

  const userGroupIds = user.groups.map((g: any) =>
    typeof g === "string" ? g : g._id.toString()
  );

  return {
    ...extraFilter,
    $or: [{ createdBy: user._id }, { group: { $in: userGroupIds } }],
  };
}
