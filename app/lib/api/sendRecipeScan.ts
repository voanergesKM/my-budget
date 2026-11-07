import { z } from "zod";

const scanSchema = z.object({
  date: z.string().nullable().optional(),
  store: z.string().optional(),
  currency: z.string().regex(/^[A-Za-z]{3}$/),
  items: z
    .array(
      z.object({
        name: z.string(),
        quantity: z.number().finite(),
        total: z.number().finite(),
        category: z.string(),
      })
    )
    .min(1),
});

export class ReceiptScanError extends Error {
  code: string;
  details?: unknown;

  constructor(code: string, details?: unknown) {
    super(code);
    this.code = code;
    this.details = details;
  }
}

// Leave room for multipart headers under the hosting platform's request limit.
const MAX_UPLOAD_SIZE = 4 * 1024 * 1024;

export const sendRecipeScan = async (file: File) => {
  if (file.size > MAX_UPLOAD_SIZE) {
    throw new ReceiptScanError("FILE_TOO_LARGE", { size: file.size });
  }

  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/scan-receipt", {
    method: "POST",
    body: formData,
  });
  const body = await res.text();
  let result: unknown;
  try {
    result = JSON.parse(body);
  } catch {
    throw new ReceiptScanError("INVALID_RESPONSE", {
      status: res.status,
      body,
    });
  }

  if (!res.ok) {
    throw new ReceiptScanError("HTTP_ERROR", {
      status: res.status,
      requestId: res.headers.get("x-request-id"),
      response: result,
    });
  }

  const parsed = scanSchema.safeParse(
    (result as { data?: unknown } | null)?.data
  );
  if (!parsed.success) {
    throw new ReceiptScanError("INVALID_SCAN", {
      response: result,
      issues: parsed.error.issues,
    });
  }
  return parsed.data;
};
