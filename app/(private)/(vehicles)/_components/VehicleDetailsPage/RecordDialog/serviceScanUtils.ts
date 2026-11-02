export type Part = {
  name: string;
  article: string | null;
  quantity: number | null;
  unitPrice: number | null;
  total: number | null;
};
export type Labor = { name: string; total: number | null };
export type Group = {
  title: string;
  category: string;
  parts: Part[];
  labor: Labor[];
};
export type Scan = {
  date: string | null;
  odometer: number | null;
  currency: string | null;
  printedParts: number | null;
  printedLabor: number | null;
  printedTotal: number | null;
  groups: Group[];
};
export type ScanRow = {
  title: string;
  category: string;
  amount: string;
  notes: string;
};

export function sumScanAmounts(values: (number | null)[]): number | null {
  return values.some((value) => value === null)
    ? null
    : values.reduce<number>(
        (total, value) => total + Math.round(value! * 100),
        0
      ) / 100;
}

export function prepareServiceScanRows(
  groups: Group[],
  label: (key: string) => string,
  categoryLabel: (category: string) => string
): ScanRow[] {
  const format = (value: number | null) =>
    value === null ? label("unknown") : value.toFixed(2);
  return [...new Set(groups.map((group) => group.category))].map((category) => {
    const items = groups.filter((group) => group.category === category);
    const amount = sumScanAmounts(
      items.flatMap((group) => [
        ...group.parts.map((part) => part.total),
        ...group.labor.map((work) => work.total),
      ])
    );
    const notes = items
      .map((group) =>
        [
          group.title,
          ...group.parts.map(
            (part) =>
              `${label("part")}: ${part.name}${part.article ? ` (${part.article})` : ""}; ${label("quantity")}: ${part.quantity ?? "?"}; ${label("unitPrice")}: ${format(part.unitPrice)}; ${label("cost")}: ${format(part.total)}`
          ),
          ...group.labor.map(
            (work) =>
              `${label("work")}: ${work.name}; ${label("cost")}: ${format(work.total)}`
          ),
        ].join("\n")
      )
      .join("\n\n");
    return {
      title: categoryLabel(category),
      category,
      amount: amount === null ? "" : String(amount),
      notes,
    };
  });
}
