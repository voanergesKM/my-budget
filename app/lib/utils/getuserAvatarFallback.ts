import { PublicUser } from "@/app/lib/definitions";

export const getuserAvatarFallback = ({ firstName, lastName }: PublicUser) =>
  [firstName, lastName]
    .map((name) => name?.[0]?.toUpperCase())
    .filter(Boolean)
    .join("") || "?";
