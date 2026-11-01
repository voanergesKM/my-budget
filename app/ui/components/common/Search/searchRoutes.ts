/** Routes that opt in to header search. Label values are keys in the Table namespace. */
const searchRoutes: {
  pathname: RegExp;
  label?: string;
  tabs?: Record<string, string>;
}[] = [
  { pathname: /^\/$/, label: "searchTransactions" },
  {
    pathname: /^\/vehicles\/(?!(?:create|update)\/?$)[^/]+\/?$/,
    tabs: {
      fuel: "searchVehicle.fuel",
      service: "searchVehicle.service",
      schedule: "searchVehicle.schedule",
    },
  },
];

export function getSearchRoute(pathname: string, tab: string | null) {
  const route = searchRoutes.find(({ pathname: pattern }) =>
    pattern.test(pathname)
  );
  if (!route) return null;

  const label = route.tabs
    ? tab && Object.hasOwn(route.tabs, tab)
      ? route.tabs[tab]
      : undefined
    : route.label;
  return label
    ? { label, key: route.tabs ? `${pathname}:${tab}` : pathname }
    : null;
}
