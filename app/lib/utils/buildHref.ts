export function buildHref(
  path: string,
  params?: Record<string, string | null | undefined>
): string {
  const searchParams = new URLSearchParams();

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value != null && value !== "") {
        searchParams.set(key, value);
      }
    }
  }

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}
