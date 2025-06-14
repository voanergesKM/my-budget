import dbConnect from "@/app/lib/db/mongodb";
import User from "@/app/lib/db/models/Users";
import { NotFoundError } from "@/app/lib/errors/customErrors";
import { User as UserType } from "../../definitions";

export async function getAllUsers() {
  await dbConnect();
  return await User.find({});
}

export async function getUserById(id: string) {
  await dbConnect();

  const user = await User.findById(id);

  if (!user) throw new NotFoundError("User not found");
  return user;
}

export async function findOrCreateUser(payload: UserType) {
  await dbConnect();

  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    return existingUser;
  }

  const newUser = await User.create(payload);
  return newUser;
}

export async function getUserByEmail(email: string) {
  await dbConnect();

  const user = await User.findOne({ email });

  if (!user) throw new NotFoundError("User not found");
  return user;
}

export async function createUser(payload: {}) {
  await dbConnect();

  const user = await User.create(payload);
  return user;
}

export async function updateUser(id: string, payload: {}) {
  await dbConnect();
  const user = await User.findByIdAndUpdate(id, payload, { new: true });
  return user;
}