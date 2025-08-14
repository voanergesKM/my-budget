import SideBar from "@/app/ui/layout/SideBar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SideBar />

      <div className="max-w-screen-3xl mx-auto min-h-dvh w-full pb-10 pt-[72px]">
        <div className={"ml-0 px-2 md:ml-[--sidebar-width] md:px-4"}>
          {children}
        </div>
      </div>
    </>
  );
}
