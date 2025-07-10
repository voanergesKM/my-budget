import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <AlertTriangle className="mb-4 h-16 w-16 text-red-500" />
      <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
      <p className="mt-2 text-lg text-gray-300">
        You don&apos;t have permission to view this page or resource.
      </p>

      <Link
        href="/dashboard"
        className="mt-6 rounded-lg bg-primary px-4 py-2 text-white transition hover:bg-opacity-80"
      >
        Go back
      </Link>
    </div>
  );
}
