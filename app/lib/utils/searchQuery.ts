/** Build a literal, case-insensitive substring search for MongoDB. */
export function buildSearchQuery(
  search: string | null | undefined,
  fields: string[]
) {
  const value = search?.trim().slice(0, 200);
  if (!value) return {};

  const expression = new RegExp(
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "i"
  );
  return { $or: fields.map((field) => ({ [field]: expression })) };
}
