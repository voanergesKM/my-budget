import { useRef } from "react";
import { useTranslations } from "next-intl";
import { LucideScanQrCode } from "lucide-react";

import { useIsMobile } from "@/app/lib/hooks/use-mobile";

import { Button } from "@/app/ui/shadcn/Button";

export const TriggerButton = ({
  handleUpload,
}: {
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const isMobile = useIsMobile();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const tb = useTranslations("Common.buttons");
  const label = tb("recipeScan");

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button
        size={isMobile ? "icon" : "default"}
        className={"rounded-full p-2 md:rounded-md"}
        aria-label={label}
        onClick={triggerFileInput}
      >
        <LucideScanQrCode className="!size-6" />
        <span className="hidden md:inline">{label}</span>
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </>
  );
};
