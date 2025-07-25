export async function deleteUploadedImage(url: string) {
  const publicId = extractPublicId(url);

  try {
    await fetch("/api/delete-uploaded-image", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });
  } catch (error) {
    console.error("Error deleting uploaded image:", error);
  }
}

export function extractPublicId(url: string): string {
  const parts = url.split("/");
  return parts
    .slice(parts.length - 2)
    .join("/")
    .split(".")[0]; // my-folder/image-name.jpg -> my-folder/image-name
}
