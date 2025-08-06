import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Category } from "@/app/lib/definitions";
import { buildHref } from "@/app/lib/utils/buildHref";
import QueryKeys from "@/app/lib/utils/queryKeys";
import { cn } from "@/app/lib/utils/utils";

import { listAllCategories } from "@/app/lib/api/categories/listAllCategories";

import { Button } from "@/app/ui/shadcn/Button";

import SelectField from "@/app/ui/components/common/SelectField";

import { categoryIcons } from "@/app/ui/icons/categories";

interface CategorySelectProps {
  value: string;
  onChange: (option: string | Category | null) => void;
  className?: string;
  hasError?: boolean;
  helperText?: string;
}

export const UserCategoriesSelect = ({
  value,
  onChange,
  hasError,
  helperText,
}: CategorySelectProps) => {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const origin = searchParams.get("origin");

  const { data } = useQuery({
    queryKey: [QueryKeys.categoriesList, groupId ?? "all", origin],
    queryFn: () => listAllCategories(origin || "outgoing", groupId || null),
  });

  const selectedOption =
    !!data && data.data.find((option: Category) => option._id === value);

  return (
    <SelectField<Category>
      options={data?.data || []}
      value={selectedOption || null}
      onChange={onChange}
      placeholder={"Select category..."}
      label={"Category"}
      name="category"
      isSearchable={false}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option._id}
      renderOption={(option) => <RenderOption option={option} />}
      renderSingleValue={(option) => (
        <RenderOption option={option} singleValue={true} />
      )}
      hasError={hasError}
      helperText={helperText}
      noOptionsMessage={() => (
        <span>
          No categories.
          <Button
            variant={"link"}
            href={buildHref("/categories/", { origin, groupId })}
            className="text-text-primary"
          >
            Create one
          </Button>
        </span>
      )}
    />
  );
};

const RenderOption = ({
  option,
  singleValue,
}: {
  option: Category;
  singleValue?: boolean;
}) => {
  const IconComponent =
    categoryIcons[option.icon as keyof typeof categoryIcons];

  return (
    <div className={cn("flex items-center gap-2", singleValue && "gap-3 py-2")}>
      <div
        className={cn(
          "flex size-8 items-center justify-center rounded-full",
          singleValue && "size-10"
        )}
        style={{ backgroundColor: option.color }}
      >
        <IconComponent className="size-4 text-text-primary" />
      </div>
      <div className="text-md">{option.name}</div>
    </div>
  );
};
