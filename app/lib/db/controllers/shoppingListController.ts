import { Shopping as ShoppingType } from "../../definitions";
import Shopping from "../models/Shopping";
import dbConnect from "../mongodb";

export async function getShoppingsList(groupId: string | null, userId: string) {
  await dbConnect();

  if (groupId) return await Shopping.find({ groupId }).populate("createdBy");

  return await Shopping.find({ createdBy: userId }).populate("createdBy");
}

export async function getShoppingById(id: string) {
  await dbConnect();

  return await Shopping.findById(id);
}

export async function createShopping(createdBy: string, groupId: string, payload: ShoppingType) {
  await dbConnect();

  const { title, items } = payload;

  const shoppingItem = await Shopping.create({
    title,
    createdBy,
    groupId,
    items,
  });

  return shoppingItem;
}
