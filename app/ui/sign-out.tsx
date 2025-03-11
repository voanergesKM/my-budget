import { signOut } from "next-auth/react";
import { PowerIcon } from "@heroicons/react/24/outline";

export default function SignOut() {
  return (
    <form
      action={async () => {
        await signOut({ redirectTo: "/" });
      }}
    >
      <button className="flex w-full items-center gap-2 px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition">
        <PowerIcon className="w-5" />
        <span>Sign Out</span>
      </button>
    </form>
  );
}
