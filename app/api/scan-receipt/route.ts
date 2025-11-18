import crypto from "crypto";

export const config = {
  runtime: "nodejs",
  maxDuration: 60,
};

const API_URL = "https://my-api-vo0r.onrender.com/api/v1/recipie/ocr";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const ts = Date.now().toString();
    const secret = process.env.API_SECRET!;
    console.log("🚀 ~ POST ~ secret:", secret);
    const signature = crypto
      .createHmac("sha256", secret)
      .update(ts)
      .digest("hex");

    const res = await fetch(API_URL, {
      method: "POST",
      body: formData,
      headers: {
        "x-ts": ts,
        "x-sign": signature,
      },
    });

    const data = await res.json();

    return Response.json(data);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "proxy error" }, { status: 500 });
  }
}
