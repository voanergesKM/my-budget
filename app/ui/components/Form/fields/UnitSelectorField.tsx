import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { SelectField } from "@/app/ui/components/Form/fields/common";

type Unit = {
  value: string;
  label: string;
};

type UnitGroup = {
  label: string;
  options: Unit[];
};

export function UnitSelectorField() {
  const tInputs = useTranslations("Common.inputs");
  const tUnits = useTranslations("Units");

  const groups: UnitGroup[] = useMemo(
    () => [
      {
        label: tUnits("groups.count"),
        options: [
          { value: "pcs", label: "pcs" },
          { value: "pack", label: "pack" },
          { value: "box", label: "box" },
          { value: "bag", label: "bag" },
          { value: "bottle", label: "bottle" },
          { value: "can", label: "can" },
        ],
      },
      {
        label: tUnits("groups.weight"),
        options: [
          { value: "g", label: "g" },
          { value: "kg", label: "kg" },
          { value: "oz", label: "oz" },
          { value: "lb", label: "lb" },
        ],
      },
      {
        label: tUnits("groups.volume"),
        options: [
          { value: "ml", label: "ml" },
          { value: "l", label: "l" },
        ],
      },
    ],
    [tUnits]
  );

  const options = useMemo(() => groups.flatMap((g) => g.options), [groups]);

  return (
    <SelectField<string, Unit>
      label={tInputs("unit")}
      options={options}
      getValue={(opt) => opt.value}
      displayValue={(opt) => (opt ? tUnits(opt.value) : null)}
      renderOption={(opt) => tUnits(opt.value)}
    />
  );
}
