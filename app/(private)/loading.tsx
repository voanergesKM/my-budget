import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    // <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center">
    <div className="mt-[150px] flex flex-col items-center text-primary">
      <Loader2 className="mb-4 h-10 w-10 animate-spin" />
      <p className="text-base font-medium text-primary">Loading...</p>
    </div>
    // </div>
  );
}
