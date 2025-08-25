import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { Category } from "@/app/lib/definitions";

import { useCategoriesList } from "@/app/lib/hooks/useCategoriesList";

import SelectField from "@/app/ui/components/common/SelectField";

import { usePageFilter, usePageFilterActions } from ".";

export function CategoryFilter() {
  const { cid } = usePageFilter();
  const { setCategory } = usePageFilterActions();

  const ts = useTranslations("Common.selectors");

  const { data } = useCategoriesList();

  const selectedOption = useMemo(() => {
    return data?.data.find((option: Category) => option._id === cid);
  }, [data, cid]);

  const onChange = (option: string | null | Category) => {
    if (typeof option === "string") {
      setCategory(option);
    }
  };

  return (
    <SelectField<Category>
      options={data?.data || []}
      value={selectedOption || null}
      onChange={onChange}
      label={ts("categoryLabel")}
      placeholder={ts("categoryPlaceholder")}
      name="category"
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option._id}
      isSearchable={false}
    />
  );
}
