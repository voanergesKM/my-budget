import Select, {
  components,
  ControlProps,
  MenuListProps,
  GroupBase,
  Props as ReactSelectProps,
  SelectInstance,
} from "react-select";
import React, { useRef } from "react";
import { cn } from "@/app/lib/utils/utils";
import { getStyles } from "./getStyles";

export type SelectFieldProps<T> = {
  options?: T[];
  value: T | string | null;
  onChange: (option: T | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => string;
  name?: string;
  label?: string;
  required?: boolean;
  maxHeight?: string;
} & Partial<ReactSelectProps<T, false, GroupBase<T>>>;

function SelectField<T>({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  isDisabled = false,
  className,
  getOptionLabel,
  getOptionValue,
  name,
  label,
  required = false,
  maxHeight = "200px",
  ...rest
}: SelectFieldProps<T>) {
  const selectRef = useRef<SelectInstance<T>>(null);

  const normalizedValue =
    typeof value === "string"
      ? (options.find((opt) => getOptionValue(opt) === value) ?? null)
      : value;

  const handleChange = (option: T | null) => {
    onChange(option ?? null);

    if (selectRef.current) {
      selectRef.current.blur();
    }
  };

  return (
    <div className="relative w-full">
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
        {required ? `${label} *` : label}
      </label>
      <Select<T, false, GroupBase<T>>
        ref={selectRef}
        name={name}
        className={cn(" w-full", className)}
        options={options}
        value={normalizedValue}
        onChange={handleChange}
        isDisabled={isDisabled}
        placeholder={placeholder}
        styles={getStyles(maxHeight)}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        components={{
          Control: (props) => <Control {...props} />,
          MenuList: (props) => <MenuList {...props} />,
        }}
        {...rest}
      />
    </div>
  );
}

export default SelectField;

function Control<T>(props: ControlProps<T, false, GroupBase<T>>) {
  return <components.Control {...props} />;
}

function MenuList<T>(props: MenuListProps<T, false, GroupBase<T>>) {
  return <components.MenuList {...props}>{props.children}</components.MenuList>;
}
