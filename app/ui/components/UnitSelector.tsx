import React from "react";
import SelectField from "@/app/ui/components/common/SelectField";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

type Unit = {
  value: string;
  label: string;
  title: string;
};

const unitOptions: Unit[] = [
  { value: "pcs", label: "pcs", title: "PCS" },
  { value: "kg", label: "kg", title: "KG" },
  { value: "l", label: "l", title: "L" },
  { value: "ml", label: "ml", title: "ML" },
  { value: "g", label: "g", title: "G" },
  { value: "each", label: "each", title: "EACH" },
];

function UnitSelector({ value, onChange }: Props) {
  const handleChange = (option: string | null | Unit) => {
    if (typeof option === "string") {
      onChange(option);
    }
  };

  return (
    <SelectField<Unit>
      options={unitOptions}
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
