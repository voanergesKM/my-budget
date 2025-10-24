import { RecipeScan } from "../definitions";

export const sendRecipeScan = async (
  formData: FormData
): Promise<RecipeScan> => {
  try {
    const res = await fetch("https://my-api-vo0r.onrender.com/api/v1/recipie", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};
