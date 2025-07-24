import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export async function POST(req: Request): Promise<Response> {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<Response>((resolve, reject) => {
    const upload_stream = cloudinary.uploader.upload_stream(
      { folder: "myBudget" },
      (error, result) => {
        if (error || !result) {
          reject(
            new Response(
              JSON.stringify({ error: error?.message || "Upload failed" }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              }
            )
          );
        } else {
          resolve(NextResponse.json({ url: result.secure_url }));
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(upload_stream);
  });
}
