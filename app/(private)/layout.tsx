export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="max-w-screen-3xl mx-auto min-h-dvh w-full pb-10 pt-[72px]">
        {children}
      </div>
    </>
  );
}
