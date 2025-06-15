import mongoose from "mongoose";

const { Schema } = mongoose;

const emailRegex =
  /^(?!.*@.*@.*$)(?!.*@.*--.*\..*$)(?!.*@.*-\..*$)(?!.*@.*-$)((.*)?@.+(\..{1,11})?)$/;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
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
  { versionKey: false, timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
