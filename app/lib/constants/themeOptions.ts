// Theme options for color schemes. No import to avoid circular dependencies.

export const COLOR_SCHEME_OPTIONS = [
  { value: "default", primary: "#2A5C70", secondary: "#5FA8AF" },
  { value: "graphite", primary: "#363840", secondary: "#6b7280" },
  // { value: "bronze", primary: "#C79873", secondary: "#8D6E63" },
] as const;

export const COLOR_SCHEME_VALUES = ["default", "graphite", "bronze"] as const;
