"use client";

import { useTranslations } from "next-intl";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { useIsMobile } from "@/app/lib/hooks/use-mobile";
import { usePaginationParams } from "@/app/lib/hooks/usePaginationParams";

import { Button } from "@/app/ui/shadcn/Button";

import SelectField from "./SelectField";

type PaginationControlsProps = {
  totalPages: number;
  hasMore: boolean;
  pageSizeOptions?: number[];
};

export default function PaginationControls({
  totalPages,
  hasMore,
  pageSizeOptions = [5, 10, 20, 50],
}: PaginationControlsProps) {
  const { currentPage, pageSize, setPage, setPageSize } = usePaginationParams();
  const isMobile = useIsMobile();

  const t = useTranslations("Table");

  const pagesToShow = generatePaginationCrumbs(currentPage, totalPages);

  const sizeOptions = pageSizeOptions.map((opt) => ({ id: opt, value: opt }));

  const rowsPerPage =
    sizeOptions.find((opt) => opt.id === pageSize) || pageSizeOptions[0];

  return (
    <div className="mt-6 flex items-end justify-end gap-4">
      {/* Page size selector */}
      <SelectField
        value={rowsPerPage}
        isSearchable={false}
        onChange={(option) => setPageSize(option as number)}
        options={sizeOptions}
        name="pageSize"
        label={t("pageSize")}
        labelPosition="left"
        getOptionLabel={(option) =>
          (option as { id: number; value: number }).id.toString()
        }
        getOptionValue={(option) =>
          (option as { id: number; value: number }).value.toString()
        }
      />

      {/* Pagination buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-full p-2 text-text-primary"
          aria-label="Previous page"
        >
          {/* Previous */}
          <ArrowLeftIcon />
        </Button>

        {!isMobile &&
          pagesToShow.map((page, i) =>
            page === "..." ? (
              <span key={`ellipsis-${i}`} className="px-2 text-text-primary">
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(page)}
                aria-label={"Page number"}
              >
                {page}
              </Button>
            )
          )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPage(currentPage + 1)}
          disabled={!hasMore}
          className="rounded-full p-2 text-text-primary"
          aria-label={"Next page"}
        >
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}

function generatePaginationCrumbs(
  current: number,
  total: number,
  delta: number = 1
): (number | "...")[] {
  const pages: (number | "...")[] = [];

  const start = Math.max(2, current - delta);
  const end = Math.min(total - 1, current + delta);

  pages.push(1); // Always show first page

  if (start > 2) {
    pages.push("..."); // Left ellipsis
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < total - 1) {
    pages.push("..."); // Right ellipsis
  }

  if (total > 1) {
    pages.push(total); // Always show last page (if more than one page)
  }

  return pages;
}
