
import { ArrowRightIcon, PowerIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import Image from "next/image";



export default async function Header() {
  const session = await auth();

  if (!session) return null;

  console.log(session);

  return (
    <header className="w-full flex justify-center py-2 md:py-4 border-b-2 border-[#F3F3F3] relative">
      <div className="w-full max-w-screen-xl mx-5 md:mx-20 flex items-center justify-between">
        {/* <Link href={"/"}>
          <Brand />
        </Link> */}
        <nav className=" gap-14 hidden lg:flex">
          {/* {HeaderNavs.map((el, _i) => (
            <HeaderNav key={_i} value={el.value} id={el.id} href={el.href} />
          ))} */}
        </nav>
        {/* <HeaderUserActions targetUser={targetUser} /> */}
        <div className="flex lg:hidden">
          {/* <HamburgerButton /> */}
          <div>hamburger</div>
        </div>
        <Link
          href="/login"
          className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
          <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
        </Link>
        {session && (
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
              <PowerIcon className="w-6" />
              <div className="hidden md:block">Sign Out</div>
            </button>

            <Image src={session?.user?.image || ""} alt="Profile" width={48} height={48} className="rounded-full"/>
          </form>
        )}


      </div>
    </header>
  );
}
