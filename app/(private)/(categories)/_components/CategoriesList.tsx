"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Edit } from "lucide-react";

import { Category } from "@/app/lib/definitions";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { listAllCategories } from "@/app/lib/api/categories/listAllCategories";

import { Button } from "@/app/ui/shadcn/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/shadcn/Card";
import { TabsContent } from "@/app/ui/shadcn/tabs";

import { CategoryTypeTabs } from "@/app/ui/components/CategoryTypeTabs";
import { CategoriesSkeleton } from "@/app/ui/components/loaders/CategoriesSkeleton";

import { categoryIcons } from "@/app/ui/icons/categories";

import CategoryDialog from "./CategoryDialog";

const CategoriesList = () => {
  const searchParams = useSearchParams();

  const origin = searchParams.get("origin");
  const groupId = searchParams.get("groupId");

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.categoriesList, groupId ?? "all", origin],
    queryFn: () => listAllCategories(origin || "outgoing", groupId || null),
  });

  return (
    <div className="mt-4">
      <CategoryTypeTabs actions={<div />}>
        {isLoading ? (
          <CategoriesSkeleton />
        ) : (
          ["outgoing", "incoming"].map((origin) => (
            <Content
              key={origin}
              origin={(origin as "outgoing" | "incoming") || "outgoing"}
              list={data?.data || []}
            />
          ))
        )}
      </CategoryTypeTabs>
    </div>
  );
};

export default CategoriesList;

type ContentProps = {
  origin: "outgoing" | "incoming";
  list: Category[];
};

const Content = ({ origin, list }: ContentProps) => {
  const [editData, setEditData] = useState<Category | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const t = useTranslations("Categories");

  const handleEdit = (category: Category) => {
    setEditData(category);
    setOpenDialog(true);
  };

  const handleOpenDialogChange = () => {
    setEditData(null);
    setOpenDialog(false);
  };

  const TriggerIconComponent = categoryIcons.other;

  return (
    <>
      <CategoryDialog
        initial={editData}
        open={openDialog}
        onOpenChange={handleOpenDialogChange}
      />

      <TabsContent value={origin} className="space-y-5">
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(330px,1fr))]">
          <Card
            onClick={() => setOpenDialog(true)}
            className="cursor-py-0 flex cursor-pointer flex-row items-center justify-between"
          >
            <CardHeader className="flex flex-row items-center gap-4 py-4">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border md:h-16 md:w-16">
                <TriggerIconComponent className="size-6 text-text-primary md:size-8" />
              </div>
              <CardTitle className="!m-0 !p-0 text-lg">
                {t("createCategory")}
              </CardTitle>
            </CardHeader>
          </Card>

          {list.map((category: Category) => {
            const IconComponent =
              categoryIcons[category.icon as keyof typeof categoryIcons];

            return (
              <Card
                key={category._id}
                className="cursor-py-0 flex flex-row items-center justify-between"
              >
                <CardHeader className="flex flex-row items-center gap-4 py-4">
                  <div
                    className="relative flex h-12 w-12 items-center justify-center rounded-full md:h-16 md:w-16"
                    style={{ backgroundColor: category.color }}
                  >
                    <IconComponent className="size-6 text-text-primary md:size-8" />
                  </div>
                  <CardTitle className="!m-0 !p-0 text-lg">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row items-center p-0 pr-2">
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="text-text-primary md:[&_svg]:size-5"
                    onClick={() => handleEdit(category)}
                    aria-label="Edit category"
                  >
                    <Edit />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </TabsContent>
    </>
  );
};
