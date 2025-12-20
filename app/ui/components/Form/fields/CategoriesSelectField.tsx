import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import { Category } from "@/app/lib/definitions";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { listAllCategories } from "@/app/lib/api/categories/listAllCategories";

import { categoryIcons } from "@/app/ui/icons/categories";

import { SelectField } from "./common/SelectField";

export const CategoriesSelectField = ({ name }: { name: string }) => {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const origin = searchParams.get("origin") ?? "outgoing";

  const t = useTranslations("Common.selectors");

  const { data } = useQuery({
    queryKey: [QueryKeys.categoriesList, groupId ?? "all", origin],
    queryFn: () => listAllCategories(origin, groupId ?? null),
  });

  return (
    <SelectField<string, Category>
      label={t("categoryLabel")}
      placeholder={t("categoryPlaceholder")}
      options={data?.data || []}
      getValue={(c) => c?._id}
      displayValue={(c) => {
        const Icon = c && categoryIcons[c.icon as keyof typeof categoryIcons];
        return c ? (
          <div className="flex items-center gap-4">
            <div
              className="flex size-6 items-center justify-center rounded-full"
              style={{ backgroundColor: c.color }}
            >
              {Icon && <Icon className="size-4 text-text-primary" />}
            </div>
            {c.name}
          </div>
        ) : null;
      }}
      renderOption={(c) => {
        const Icon = categoryIcons[c.icon as keyof typeof categoryIcons];
        return (
          <div className="flex items-center gap-4">
            <div
              className="flex size-6 items-center justify-center rounded-full"
              style={{ backgroundColor: c.color }}
            >
              <Icon className="size-4 text-text-primary" />
            </div>
            {c.name}
          </div>
        );
      }}
    />
  );
};
