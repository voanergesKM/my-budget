"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import { Transaction } from "@/app/lib/definitions";

import { getTransactionsList } from "@/app/lib/api/transactions/getTransactionsList";

import { usePaginationParams } from "@/app/lib/hooks/usePaginationParams";

import { CategoryTypeTabs } from "@/app/ui/components/CategoryTypeTabs";
import PageFilter from "@/app/ui/components/common/PageFilter";

import { withUserAndGroupContext } from "@/app/ui/hoc/withUserAndGroupContext";

import { useQueryKeys } from "./hooks/useQueryKeys";
import { Content } from "./Content";
import { TransactionDialog } from "./TransactionDialog";

function HomePage() {
  const searchParams = useSearchParams();

  const groupId = searchParams.get("groupId");
  const origin = searchParams.get("origin");

  const t = useTranslations("Common.buttons");

  const { currentPage: page, pageSize } = usePaginationParams();

  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<Transaction | null>(null);

  const queryKeys = useQueryKeys();

  const { data: transactions, isLoading } = useQuery({
    queryKey: queryKeys,
    queryFn: () =>
      getTransactionsList(
        groupId || null,
        origin || "outgoing",
        (page ?? 1).toString(),
        (pageSize ?? 10).toString()
      ),
  });

  const handleEditTransaction = (data: Transaction) => {
    setEditData(data);
    setOpenDialog(true);
  };

  const onCloseDialog = () => {
    setEditData(null);
    setOpenDialog(false);
  };

  return (
    <div className="mt-4">
      <CategoryTypeTabs
        actions={
          <div className="flex items-start gap-4">
            <TransactionDialog
              open={openDialog}
              onCloseDialog={onCloseDialog}
              initial={editData}
              setOpenDialog={setOpenDialog}
            />
            {/* <PageFilter>
              <PageFilter.DateFilter />
            </PageFilter> */}
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
