import React, { JSX, useRef } from "react";
import Select, {
  components,
  ControlProps,
  GroupBase,
  MenuListProps,
  OptionProps,
  Props as ReactSelectProps,
  SelectInstance,
  SingleValueProps,
} from "react-select";

import { cn } from "@/app/lib/utils/utils";

import { ErrorMessage } from "@/app/ui/components/TextField";

import { getStyles } from "./getStyles";

export type SelectFieldProps<T> = {
  options?: readonly (T | GroupBase<T>)[];
  value: T | string | number | null;
  onChange: (option: T | null | string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => string;
  name?: string;
  label?: string;
  labelPosition?: "top" | "left";
  required?: boolean;
  maxHeight?: string;
  renderOption?: (option: T) => React.ReactNode;
  renderSingleValue?: (option: T) => React.ReactNode;
  hasError?: boolean;
  helperText?: string;
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
  labelPosition = "top",
  renderOption,
  renderSingleValue,
  hasError = false,
  helperText,
  ...rest
}: SelectFieldProps<T>) {
  const selectRef = useRef<SelectInstance<T>>(null);

  const resolveValue = (opt: T) => (getOptionValue ? getOptionValue(opt) : opt);

  const flatOptions = flattenOptions(options);

  const normalizedValue =
    typeof value === "string" || typeof value === "number"
      ? (flatOptions.find((opt) => resolveValue(opt) === value) ?? null)
      : value;

  const handleChange = (option: T | null) => {
    const val = option ? resolveValue(option) : null;
    onChange(val);
    selectRef.current?.blur();
  };

  function flattenOptions<T>(options: readonly (T | GroupBase<T>)[]): T[] {
    return options.flatMap((opt) => {
      if (opt && typeof opt === "object" && "options" in opt) {
        return opt.options;
      } else {
        return [opt];
      }
    });
  }

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2",
        labelPosition === "left" && "flex-row items-center"
      )}
    >
      <label
        htmlFor={name}
        className="block flex-shrink-0 text-sm font-medium text-[var(--text-primary)]"
      >
        {required ? `${label} *` : label}
      </label>
      <Select<T, false, GroupBase<T>>
        ref={selectRef}
        name={name}
        id={name}
        instanceId={name}
        className={cn("w-full flex-grow", className)}
        options={options}
        value={normalizedValue}
        onChange={handleChange}
        isDisabled={isDisabled}
        placeholder={placeholder}
        styles={getStyles(maxHeight, hasError)}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        components={{
          Control: (props) => <Control {...props} />,
          MenuList: (props) => <MenuList {...props} />,
          Option: (props) => (
            <CustomOption {...props} renderOption={renderOption} />
          ),
          SingleValue: (props) => (
            <CustomSingleValue
              {...props}
              renderSingleValue={renderSingleValue}
              getOptionLabel={getOptionLabel}
            />
          ),
        }}
        menuPlacement="auto"
        {...rest}
      />
      {hasError && <ErrorMessage message={helperText} />}
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

function CustomOption<T>({
  renderOption,
  ...props
}: OptionProps<T, false, GroupBase<T>> & {
  renderOption?: (option: T) => React.ReactNode;
}) {
  return (
    <components.Option {...props}>
      {renderOption ? renderOption(props.data) : String(props.label)}
    </components.Option>
  );
}

function CustomSingleValue<T>({
  renderSingleValue,
  getOptionLabel,
  ...props
}: SingleValueProps<T, false> & {
  renderSingleValue?: (option: T) => React.ReactNode;
  getOptionLabel?: (option: T) => string;
}) {
  const label = getOptionLabel?.(props.data) ?? String(props.data as string);

  return (
    <components.SingleValue {...props}>
      {renderSingleValue ? renderSingleValue(props.data) : label}
    </components.SingleValue>
  );
}
