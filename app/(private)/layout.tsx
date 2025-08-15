export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="max-w-screen-3xl mx-auto min-h-dvh w-full pb-10 pt-[72px]">
        <div className={"ml-0 px-2 md:px-4"}>{children}</div>
      </div>
    </>
  );
}
