import mongoose, { type Schema } from "mongoose";

/** Recompile a cached model when hot reload introduces required schema paths. */
export function getCurrentModel(
  name: string,
  schema: Schema,
  requiredPaths: string[]
) {
  const cached = mongoose.models[name];
  if (cached && requiredPaths.some((path) => !cached.schema.path(path))) {
    mongoose.deleteModel(name);
  }
  return mongoose.models[name] || mongoose.model(name, schema);
}
