import { extractPublicCloudinaryId } from "@/app/lib/utils/extractPublicCloudinaryId";

export async function deleteUploadedImage(url: string) {
  const publicId = extractPublicCloudinaryId(url);

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
