import React, { useMemo } from "react";
import { GroupBase } from "react-select";
import { useTranslations } from "next-intl";

import SelectField from "@/app/ui/components/common/SelectField";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

type Unit = {
  value: string;
  label: string;
};

const countOptions = [
  { value: "pcs", label: "pcs" },
  { value: "pack", label: "pack" },
  { value: "box", label: "box" },
  { value: "bag", label: "bag" },
  { value: "bottle", label: "bottle" },
  { value: "can", label: "can" },
];

const weightOptions = [
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
  { value: "oz", label: "oz" },
  { value: "lb", label: "lb" },
];

const volumeOptions = [
  { value: "ml", label: "ml" },
  { value: "l", label: "l" },
  { value: "cup", label: "cup" },
  { value: "tsp", label: "tsp" },
  { value: "tbsp", label: "tbsp" },
];

function UnitSelector({ value, onChange }: Props) {
  const tInputs = useTranslations("Common.inputs");
  const tUnits = useTranslations("Units");

  const groupedUnitOptions: GroupBase<Unit>[] = useMemo(() => {
    return [
      {
        label: tUnits("groups.count"),
        options: countOptions,
      },
      {
        label: tUnits("groups.weight"),
        options: weightOptions,
      },
      {
        label: tUnits("groups.volume"),
        options: volumeOptions,
      },
    ];
  }, [tUnits]);

  const handleChange = (option: string | null | Unit) => {
    if (typeof option === "string") {
      onChange(option);
    }
  };

  return (
    <SelectField<Unit>
      options={groupedUnitOptions}
      value={value as ((string | Unit) & (Unit | undefined)) | null}
      onChange={handleChange}
      getOptionLabel={(opt) => tUnits(`${opt.value}`)}
      getOptionValue={(opt) => opt.value}
      name="unit"
      label={tInputs("unit")}
    />
  );
}

export default UnitSelector;
