"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  variant?: "outlined" | "contained";
  size?: "small" | "medium" | "large";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  color?: "primary" | "secondary";
  href?: string;
  children: ReactNode;
  classes?: {
    root?: string;
    startIcon?: string;
    endIcon?: string;
  };
} & (
  | ButtonHTMLAttributes<HTMLButtonElement>
  | AnchorHTMLAttributes<HTMLAnchorElement>
);

export default function Button({
  variant = "contained",
  size = "medium",
  startIcon,
  endIcon,
  color = "primary",
  href,
  children,
  classes,
  type = "button",
  ...props
}: ButtonProps) {
  const pathname = usePathname();
  const isActive = href
    ? pathname === href || pathname.startsWith(href + "/")
    : false;

  const baseStyles =
    "flex items-center justify-center gap-3 font-medium rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";
  const sizeStyles = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  const variantStyles = {
    contained: `text-[var(--button-text)] bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] shadow-md hover:shadow-lg`,
    outlined: `border border-[var(--button-text)] text-[var(--button-text)] hover:bg-[var(--button-hover-bg)]`,
  };

  const activeStyles = isActive
    ? "bg-[var(--button-hover-bg)] text-[var(--text-primary)] shadow-md"
    : "";

  if (href) {
    return (
      <Link
        href={href}
        className={clsx(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          activeStyles,
          classes?.root
        )}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {startIcon && (
          <span className={clsx(classes?.startIcon, "w-5 h-5 flex align-center justify-center")}>
            {startIcon}
          </span>
        )}
        {children}
        {endIcon && (
          <span className={clsx(classes?.endIcon, "w-5 h-5")}>{endIcon}</span>
        )}
      </Link>
    );
  }

  return (
    <button
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        classes?.root
      )}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {startIcon && <span className="w-5 h-5">{startIcon}</span>}
      {children}
      {endIcon && <span className="w-5 h-5">{endIcon}</span>}
    </button>
  );
}

