export function extractPublicCloudinaryId(url: string): string {
  const parts = url.split("/");
  return parts
    .slice(parts.length - 2)
    .join("/")
    .split(".")[0]; // my-folder/image-name.jpg -> my-folder/image-name
}
