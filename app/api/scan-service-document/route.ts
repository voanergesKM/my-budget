import crypto from "crypto";

const API_BASE_URL = "https://my-api-vo0r.onrender.com/api/v1";

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json(
      { error: "Invalid upload form", code: "INVALID_FORM" },
      { status: 400 }
    );
  }

  const secret = process.env.API_SECRET;
  if (!secret) {
    console.error("Service document proxy: API_SECRET is not configured");
    return Response.json(
      {
        error: "Service document service is not configured",
        code: "PROXY_CONFIG_ERROR",
      },
      { status: 500 }
    );
  }

  const ts = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(ts)
    .digest("hex");
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/service-document/scan`, {
      method: "POST",
      body: formData,
      headers: { "x-ts": ts, "x-sign": signature },
    });
  } catch (error) {
    console.error("Service document proxy: API request failed", error);
    return Response.json(
      {
        error: "Could not connect to the service document service",
        code: "API_UNREACHABLE",
      },
      { status: 502 }
    );
  }

  const requestId = res.headers.get("x-request-id");
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    console.error("Service document proxy: non-JSON API response", {
      status: res.status,
      requestId,
    });
    return Response.json(
      {
        error: `Service document service returned an invalid response (HTTP ${res.status})`,
        code: "INVALID_API_RESPONSE",
        requestId,
      },
      { status: 502 }
    );
  }

  if (!res.ok)
    console.error("Service document proxy: API error", {
      status: res.status,
      requestId,
      data,
    });
  return Response.json(data, {
    status: res.status,
    ...(requestId ? { headers: { "X-Request-Id": requestId } } : {}),
  });
}
