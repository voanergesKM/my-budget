import { Group } from "../../definitions";

export const getUserGroups = async (): Promise<Array<Group>> => {
  const response = await fetch("/api/groups");
  const data = await response.json();
  return data.data;
};
