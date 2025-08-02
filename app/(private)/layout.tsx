export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-screen-3xl mx-auto min-h-dvh w-full pb-6 pt-[72px]">
      <div className={"ml-0 px-4 md:ml-[--sidebar-width] md:px-6"}>
        {children}
      </div>
    </div>
  );
}
