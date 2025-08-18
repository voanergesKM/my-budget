"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import Notify from "@/app/lib/utils/notify";
import { cn } from "@/app/lib/utils/utils";

import CircularProgress from "./CircularProgress";

type Props = {
  image: string | undefined;
  title: string;
  onUpload?: (url: string) => void;
};

export function AvatarUploader({ image, title, onUpload }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const t = useTranslations("Common.titles");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setPreview(data.url);
      onUpload && onUpload(data.url);
      Notify.success("Image uploaded successfully!");
    } catch (error) {
      Notify.error("Image upload failed!");
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const imageToShow = preview || image;

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      <div
        onClick={triggerFileInput}
        className={cn(
          "relative h-32 w-32 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-white/40 transition hover:border-white md:h-[200px] md:w-[200px] xl:h-[300px] xl:w-[300px]"
        )}
      >
        {/* Image preview */}
        {imageToShow && !loading && (
          <Image
            src={imageToShow}
            alt="Avatar Preview"
            fill
            className="rounded-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        )}

        {/* Placeholder */}
        {!preview && !loading && (
          <div className="flex h-full w-full items-center justify-center px-2 text-center text-sm text-white/70">
            <span className="leading-snug">{t("uploadImage")}</span>
          </div>
        )}

        {/* Spinner while loading */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full">
            <CircularProgress size={100} />
          </div>
        )}
      </div>

      <p className="text-sm text-white/70">{title}</p>
    </div>
  );
}
