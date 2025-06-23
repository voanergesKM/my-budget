import mongoose from "mongoose";

import Group from "./Group";

const { Schema } = mongoose;

const emailRegex =
  /^(?!.*@.*@.*$)(?!.*@.*--.*\..*$)(?!.*@.*-\..*$)(?!.*@.*-$)((.*)?@.+(\..{1,11})?)$/;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    lastName: { type: String, default: "" },
    // fullName: String,
    password: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegex,
      unique: true,
      index: true,
    },
    avatarURL: {
      type: String,
      required: false,
    },
    groups: {
      type: [{ type: Schema.Types.ObjectId, ref: "Group" }],
      default: [],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual("fullName").get(function () {
  return [this.name, this.lastName].filter(Boolean).join(" ");
});

UserSchema.virtual("totalGroups").get(function (this: any) {
  return this.groups ? this.groups.length : 0;
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
