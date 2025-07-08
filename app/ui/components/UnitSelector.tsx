import React from "react";
import { GroupBase } from "react-select";
import SelectField from "@/app/ui/components/common/SelectField";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

type Unit = {
  value: string;
  label: string;
};

const groupedUnitOptions: GroupBase<Unit>[] = [
  {
    label: "Count",
    options: [
      { value: "pcs", label: "pcs" },
      { value: "each", label: "each" },
      { value: "pack", label: "pack" },
      { value: "box", label: "box" },
      { value: "bag", label: "bag" },
      { value: "bottle", label: "bottle" },
      { value: "can", label: "can" },
    ],
  },
  {
    label: "Weight",
    options: [
      { value: "g", label: "g" },
      { value: "kg", label: "kg" },
      { value: "oz", label: "oz" },
      { value: "lb", label: "lb" },
    ],
  },
  {
    label: "Volume",
    options: [
      { value: "ml", label: "ml" },
      { value: "l", label: "l" },
      { value: "cup", label: "cup" },
      { value: "tsp", label: "tsp" },
      { value: "tbsp", label: "tbsp" },
    ],
  },
];

function UnitSelector({ value, onChange }: Props) {
  const handleChange = (option: string | null | Unit) => {
    console.log("option", option);
    if (typeof option === "string") {
      onChange(option);
    }
  };

  return (
    <SelectField<Unit>
      options={groupedUnitOptions}
      value={value as ((string | Unit) & (Unit | undefined)) | null}
      onChange={handleChange}
      getOptionLabel={(opt) => opt.label}
      getOptionValue={(opt) => opt.value}
      name="unit"
      label="Unit"
    />
  );
}

export default UnitSelector;
