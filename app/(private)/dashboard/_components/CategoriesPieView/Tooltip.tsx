import { CategoryStat } from "@/app/lib/definitions";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import ShowcaseItem from "@/app/ui/components/common/ShowcaseItem";

import { categoryIcons } from "@/app/ui/icons/categories";

export const Tooltip = (props: any) => {
  const item = props.item.payload;
  const categoryIcon = item.categoryIcon;
  const categoryColor = item.categoryColor;
  const IconComponent =
    categoryIcons[categoryIcon as keyof typeof categoryIcons];

  return (
    <div>
      <ShowcaseItem<CategoryStat>
        data={item}
        icon={
          <div
            className="flex size-8 items-center justify-center rounded-full"
            style={{ backgroundColor: categoryColor }}
          >
            <IconComponent className="size-4 text-text-primary" />
          </div>
        }
        titleExpression={(category) => category.categoryName}
      />
      <div className="mt-3 flex gap-2">
        <span className="font-semibold">Total:</span>
        <span>{getFormattedAmount(item.currency, item.total)}</span>
      </div>
    </div>
  );
};
