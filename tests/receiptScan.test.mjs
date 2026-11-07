import assert from "node:assert/strict";
import test from "node:test";
import {
  ReceiptScanError,
  sendRecipeScan,
} from "../app/lib/api/sendRecipeScan.ts";

test("receipt scan retains server diagnostics without exposing them as the error message", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    Response.json(
      { error: "technical details", requestId: "abc" },
      { status: 502 }
    );
  try {
    await assert.rejects(
      sendRecipeScan(new File(["image"], "receipt.jpg")),
      (error) => {
        assert.ok(error instanceof ReceiptScanError);
        assert.equal(error.message, "HTTP_ERROR");
        assert.deepEqual(error.details, {
          status: 502,
          requestId: null,
          response: { error: "technical details", requestId: "abc" },
        });
        return true;
      }
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("receipt scan rejects malformed results and oversized files", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ data: { items: null } });
  try {
    await assert.rejects(sendRecipeScan(new File(["image"], "receipt.jpg")), {
      code: "INVALID_SCAN",
    });
    await assert.rejects(
      sendRecipeScan(
        new File([new Uint8Array(4 * 1024 * 1024 + 1)], "receipt.jpg")
      ),
      { code: "FILE_TOO_LARGE" }
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
