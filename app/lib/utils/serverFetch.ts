import { headers } from "next/headers";

export async function serverFetch<T>(
  input: string,
  init?: RequestInit
): Promise<T> {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const response = await fetch(`${baseUrl}${input}`, {
    ...init,
    headers: {
      ...init?.headers,
      cookie: headersList.get("cookie") || "",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`serverFetch failed: ${response.status} - ${errorText}`);
  }

  return response.json();
}
