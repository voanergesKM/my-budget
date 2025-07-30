import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-background-secondary mt-6 flex h-[calc(100dvh-120px)] flex-col items-center justify-center p-6 text-foreground">
      <h1
        className="text-[6rem] font-extrabold"
        style={{ color: "hsl(var(--primary))" }}
      >
        404
      </h1>
      <p
        className="mb-6 text-xl font-semibold sm:text-2xl"
        style={{ color: "var(--text-primary)" }}
      >
        This page could not be found.
      </p>
      <p className="mb-8 max-w-md text-center text-text-secondary">
        This page may have been removed or is temporarily unavailable
      </p>
      <Link
        href="/"
        className="rounded-md bg-[hsl(var(--button-bg))] px-6 py-3 font-semibold text-[hsl(var(--button-text))] shadow-md transition-shadow hover:bg-[hsl(var(--button-hover-bg))]"
      >
        Back to home
      </Link>
    </main>
  );
}
