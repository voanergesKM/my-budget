import React from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import { Group } from "@/app/lib/definitions";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { getUserGroups } from "@/app/lib/api/groups/getUserGroups";

import { SelectField } from "./common/SelectField";

export const GroupSelectField = ({ onChange }: { onChange: () => void }) => {
  const tc = useTranslations("Common");

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.groupsList],
    queryFn: getUserGroups,
  });

  const label = tc("selectors.linkGroup");
  const description = tc("selectors.linkGroupDescription");

  return (
    <SelectField<String, Group>
      showEmpty
      getValue={(g) => g._id}
      label={label}
      options={data || []}
      displayValue={(g) => g?.name}
      renderOption={(g) => g?.name}
      description={description}
      onChange={onChange}
    />
  );
};
