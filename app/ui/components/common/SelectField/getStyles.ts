import { StylesConfig } from "react-select";
import { is } from "date-fns/locale";

export function getStyles<T>(maxHeight: string): StylesConfig<T, false> {
  return {
    control: (base, state) => {
      return {
        ...base,
        backgroundColor: "transparent",
        border: "1px solid var(--button-bg)",
        borderBottom: state.isFocused ? "none" : "1px solid",
        borderBottomLeftRadius: state.isFocused ? "0" : "0.5rem",
        borderBottomRightRadius: state.isFocused ? "0" : "0.5rem",
        outline: "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
        minHeight: "38px",
        borderRadius: "0.5rem",
        padding: "2px 4px",
        color: "var(--text-primary)",
        "&:focus": {
          borderColor: "var(--button-bg)",
        },
        "&:hover": {
          borderColor: "none",
        },
      };
    },
    placeholder: (base) => ({
      ...base,
      color: "var(--text-secondary)",
      fontSize: "0.875rem",
    }),
    input: (base) => ({
      ...base,
      color: "var(--text-primary)",
    }),
    singleValue: (base) => ({
      ...base,
      color: "var(--text-primary)",
    }),
    menu: (base, state) => {
      const isTop = state.placement?.startsWith("top");

      return {
        ...base,
        border: "1px solid var(--button-bg)",
        borderTop: isTop ? "1px solid var(--button-bg)" : "none",
        borderBottom: isTop ? "none" : "1px solid var(--button-bg)",
        borderTopLeftRadius: isTop ? "4px" : "0",
        borderTopRightRadius: isTop ? "4px" : "0",
        borderBottomLeftRadius: isTop ? "0" : "4px",
        borderBottomRightRadius: isTop ? "0" : "4px",
        marginTop: "0px",
        marginBottom: "0px",
        backgroundColor: "var(--dropdown-menu-bg)",
        padding: "4px 0",
        zIndex: 20,
      };
    },
    groupHeading: (base: any) => ({
      ...base,
      marginLeft: "8px",
      fontWeight: 600,
      textTransform: "uppercase",
      fontSize: "0.75rem",
      color: "var(--text-secondary)",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "hsl(var(--primary))"
        : state.isFocused
          ? "var(--button-hover-bg)"
          : "transparent",
      color: "var(--text-primary)",
      cursor: "pointer",
      padding: "8px 12px",
      "&:hover": {
        backgroundColor: "var(--button-hover-bg)",
        color: "var(--button-text)",
      },
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
      maxHeight: maxHeight,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "var(--text-secondary)",
      "&:hover": {
        color: "var(--text-primary)",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    clearIndicator: (base) => ({
      ...base,
      color: "var(--text-secondary)",
      "&:hover": {
        color: "var(--text-primary)",
      },
    }),
  };
}
