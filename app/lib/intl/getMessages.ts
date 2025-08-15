import fs from "fs";
import path from "path";

export async function getMessages(
  locale: string,
  key?: string
): Promise<Record<string, string>> {
  try {
    const filePath = path.join(
      process.cwd(),
      "/app/lib/intl",
      `${locale}.json`
    );
    const fileContents = await fs.promises.readFile(filePath, "utf-8");

    const messages = JSON.parse(fileContents);

    if (key) {
      return messages[key] || {};
    }

    return JSON.parse(fileContents);
  } catch (err) {
    console.error("Failed to load messages for locale", locale, err);
    return {};
  }
}
