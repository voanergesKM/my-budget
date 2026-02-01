import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { SelectField } from "./common/SelectField";

const fuelTypes = ["petrol", "diesel", "gas", "electric", "hybrid"];

export const FuelTypeSelectField = () => {
  const t = useTranslations("Common.selectors");
  const tf = useTranslations("FuelTypes");

  const options = useMemo(() => {
    return fuelTypes.map((f) => ({ value: f, label: tf(f) }));
  }, [tf]);

  return (
    <SelectField<String, { value: string; label: string }>
      label={t("fuelType")}
      options={options}
      getValue={(option) => option.value}
      displayValue={(option) => option?.label}
      renderOption={(o) => o.label}
    />
  );
};
