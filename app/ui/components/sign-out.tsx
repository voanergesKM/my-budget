import { signOut } from "next-auth/react";
import { PowerIcon } from "@heroicons/react/24/outline";

export default function SignOut() {
  return (
    <form
      action={async () => {
        await signOut({ redirectTo: "/" });
      }}
      className="w-full"
    >
      <button className="flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-[18px] transition hover:bg-red-500 hover:text-white">
        <PowerIcon />
        <span>Sign Out</span>
      </button>
    </form>
  );
}
