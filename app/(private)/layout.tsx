export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="max-w-screen-3xl mx-auto flex h-full min-h-dvh w-full flex-1 flex-col pb-10 pt-[72px]">
        {children}
      </div>
    </>
  );
}
