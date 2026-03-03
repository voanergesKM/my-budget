import { User as UserType } from "@/app/lib/definitions";

type Query = Record<string, any>;

export function buildQuery(
  query: Query,
  currentUser: UserType,
  groupId: string | null
) {
  const { page = 1, pageSize = 10, ...params } = query;

  const mongoQuery: Query = {};

  if (params.origin) {
    mongoQuery.type = params.origin;
  }

  if (groupId) {
    mongoQuery.group = groupId;
  } else {
    mongoQuery.createdBy = currentUser._id;
  }

  if (params.from || params.to) {
    mongoQuery.createdAt = {};
    if (params.from) {
      mongoQuery.createdAt.$gte = new Date(params.from);
    }
    if (params.to) {
      mongoQuery.createdAt.$lte = new Date(params.to);
    }
  }

  if (params.cid) {
    mongoQuery.category = params.cid;
  }

  return {
    paginationParams: {
      page,
      pageSize,
    },
    mongoQuery,
  };
}
