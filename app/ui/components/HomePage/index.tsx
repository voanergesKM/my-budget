"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Plus, ScanLine } from "lucide-react";

import { Transaction } from "@/app/lib/definitions";

import { getTransactionsList } from "@/app/lib/api";

import { usePaginationParams } from "@/app/lib/hooks/usePaginationParams";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/ui/shadcn/DropdownMenu";

import { CategoryTypeTabs } from "@/app/ui/components/CategoryTypeTabs";
import { CreateEntityButton } from "@/app/ui/components/common/CreateEntityButton";
import PageFilter from "@/app/ui/components/common/PageFilter";
import SidebarGroupSelector from "@/app/ui/components/SidebarGroupSelector";

import { withUserAndGroupContext } from "@/app/ui/hoc/withUserAndGroupContext";

import { useQueryKeys } from "./hooks/useQueryKeys";
import { Content } from "./Content";
import TransactionBuilderDialog from "./TransactionBuilderDialog";
import { TransactionDialog } from "./TransactionDialog";

function HomePage() {
  const searchParams = useSearchParams();
  const t = useTranslations("Common.buttons");
  const fileInput = useRef<HTMLInputElement>(null);

  const groupId = searchParams.get("groupId");
  const origin = searchParams.get("origin");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const cid = searchParams.get("cid");
  const search = searchParams.get("q");

  const { currentPage: page, pageSize } = usePaginationParams();

  const [dialogData, setDialogData] = useState<Transaction | boolean>(false);
  const [scanFile, setScanFile] = useState<File | null>(null);

  const queryKeys = useQueryKeys();

  const { data: transactions, isLoading } = useQuery({
    queryKey: queryKeys,
    queryFn: () =>
      getTransactionsList(
        groupId || null,
        origin || "outgoing",
        (page ?? 1).toString(),
        (pageSize ?? 10).toString(),
        from,
        to,
        cid,
        search
      ),
  });

  const handleEditTransaction = (data: Transaction) => {
    setDialogData(data);
  };

  const onOpenDialogChange = (open: boolean) => {
    if (!open) setDialogData(false);
    else setDialogData((previous) => previous || true);
  };

  return (
    <div className="mt-4">
      <div className="mb-4 max-w-[300px] md:hidden">
        <SidebarGroupSelector />
      </div>

      <CategoryTypeTabs
        actions={
          <div className="flex items-start gap-4">
            {origin === "incoming" ? (
              <CreateEntityButton
                label={t("createTransaction")}
                onClick={() => setDialogData(true)}
              />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <CreateEntityButton label={t("createTransaction")} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onSelect={() => setDialogData(true)}>
                    <Plus className="mr-2 size-4" />
                    {t("createTransaction")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => fileInput.current?.click()}>
                    <ScanLine className="mr-2 size-4" />
                    {t("recipeScan")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="image/*,application/pdf,.pdf"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) setScanFile(file);
              }}
            />
            <TransactionDialog
              open={!!dialogData}
              data={dialogData}
              onOpenChange={onOpenDialogChange}
            />
            {scanFile && (
              <TransactionBuilderDialog
                source={{
                  type: "scan",
                  file: scanFile,
                  onClose: () => setScanFile(null),
                }}
              />
            )}
            <PageFilter>
              <PageFilter.DateFilter />
              <PageFilter.CategoryFilter />
            </PageFilter>
          </div>
        }
      >
        {["outgoing", "incoming"].map((origin) => (
          <Content
            key={origin}
            origin={(origin as "outgoing" | "incoming") || "outgoing"}
            data={transactions}
            onEdit={handleEditTransaction}
            isLoading={isLoading}
          />
        ))}
      </CategoryTypeTabs>
    </div>
  );
}

const HomePageWithProviders = withUserAndGroupContext(HomePage);

export default HomePageWithProviders;
