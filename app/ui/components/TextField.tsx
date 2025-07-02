"use client";

import clsx from "clsx";

type TextFieldProps = {
  label: string;
  value?: string;
  defaultValue?: string;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  hasError?: boolean;
  helperText?: string | string[];
  startAdornment?: React.ReactNode;
  type?: string;
  classes?: {
    root?: string;
    input?: string;
  };
};

export const TextField = ({
  label,
  value,
  onChange,
  hasError,
  helperText,
  startAdornment,
  type = "text",
  name,
  placeholder,
  required = false,
  classes,
  defaultValue,
}: TextFieldProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(event);
  };

  return (
    <div className={clsx(classes?.root, "relative w-full")}>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
        {required ? `${label} *` : label}
      </label>
      <div className="relative">
        {startAdornment && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 transform text-[var(--text-secondary)]">
            {startAdornment}
          </div>
        )}
        <input
          className={clsx(
            classes?.input,
            `peer block w-full rounded-md border ${hasError ? "border-red-500" : "border-[var(--text-secondary)]"} ${startAdornment ? "pl-10" : "pl-3"} bg-transparent py-2 pr-3 text-[16px] text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:ring-2 focus:ring-[var(--button-bg)]`
          )}
          required={required}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      </div>
      {hasError && <ErrorMessage message={helperText} />}
    </div>
  );
};

const ErrorMessage = ({ message }: { message?: string | string[] }) => {
  if (Array.isArray(message)) {
    return (
      <div>
        {message.map((el: string, i) => (
          <p key={i} className="mt-1 text-sm text-red-500">
            {el}
          </p>
        ))}
      </div>
    );
  }

  return <p className="mt-1 text-sm text-red-500">{message}</p>;
};
