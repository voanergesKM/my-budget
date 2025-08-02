"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Edit } from "lucide-react";

import { Category } from "@/app/lib/definitions";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { listAllCategories } from "@/app/lib/api/categories/listAllCategories";

import { Button } from "@/app/ui/shadcn/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/shadcn/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/ui/shadcn/tabs";

import { categoryIcons } from "@/app/ui/icons/categories";

import CategoryDialog from "./CategoryDialog";

const CategoriesList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const origin = searchParams.get("origin");
  const groupId = searchParams.get("groupId");

  const { data } = useQuery({
    queryKey: [QueryKeys.categoriesList, groupId ?? "all", origin],
    queryFn: () => listAllCategories(origin || "outgoing", groupId || null),
  });

  const onValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("origin", value);

    router.push(`?${params.toString()}`);
  };

  const tabValue = origin ?? "outgoing";

  return (
    <>
      <Tabs
        defaultValue={"outgoing"}
        value={tabValue}
        onValueChange={onValueChange}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
          <TabsTrigger value="incoming">Incoming</TabsTrigger>
        </TabsList>
        {["outgoing", "incoming"].map((origin) => (
          <Content
            key={origin}
            origin={(origin as "outgoing" | "incoming") || "outgoing"}
            list={data?.data || []}
          />
        ))}
      </Tabs>
    </>
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
                Add new category
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
