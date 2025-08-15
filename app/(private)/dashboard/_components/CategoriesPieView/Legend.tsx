import { CategoryStat } from "@/app/lib/definitions";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import ShowcaseItem from "@/app/ui/components/common/ShowcaseItem";

import { categoryIcons } from "@/app/ui/icons/categories";

export const Legend = ({
  items,
  selectedCategoryId,
  onClick,
}: {
  items: CategoryStat[];
  selectedCategoryId?: string | null;
  onClick?: (categoryId: string) => void;
}) => {
  const totalSum = items.reduce(
    (s, it) => s + (it.amountInBaseCurrency ?? 0),
    0
  );

  return (
    <ul className="flex max-h-[220px] w-full flex-col gap-0 overflow-auto rounded-xl border p-2">
      {items.map((item) => {
        const IconComp =
          categoryIcons[item.categoryIcon as keyof typeof categoryIcons];
        const percent = totalSum
          ? ((item.amountInBaseCurrency / totalSum) * 100).toFixed(1)
          : "0.0";

        return (
          <li
            key={`${item.categoryId}-${item.currency}`}
            className={`flex cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-primary/80 ${
              selectedCategoryId === item.categoryId ? "bg-primary/50" : ""
            }`}
            onClick={() => onClick?.(item.categoryId)}
          >
            <ShowcaseItem<CategoryStat>
              data={item}
              icon={
                <div
                  className="flex size-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: item.categoryColor }}
                >
                  <IconComp className="size-4 text-text-primary" />
                </div>
              }
              titleExpression={() => (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-text-primary">
                    {item.categoryName}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {percent}% • {item.currency}
                  </span>
                </div>
              )}
            />
            <div className="text-right">
              <div className="text-sm font-medium text-text-secondary">
                {getFormattedAmount(item.currency, item.total)}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
