import { User } from "@/app/lib/definitions";

export const getuserAvatarFallback = ({ firstName, lastName }: User) =>
  [firstName, lastName]
    .map((name) => name?.[0]?.toUpperCase())
    .filter(Boolean)
    .join("") || "?";
