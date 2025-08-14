import { CategoryStat } from "@/app/lib/definitions";

import { ChartConfig } from "@/app/ui/shadcn/Chart";

export const getPieChartConfig = (data: CategoryStat[] | undefined) => {
  return data
    ? data.reduce((acc: { [key: string]: any }, item: CategoryStat) => {
        const key = `${item.categoryName} (${item.currency})`;

        acc[key] = {
          categoryName: key,
          categoryIcon: item.categoryIcon,
          categoryColor: item.categoryColor,
          currency: item.currency,
          total: item.total,
          label: `${item.categoryName} (${item.currency})`,
        };

        return acc;
      }, {} as ChartConfig)
    : ({} as ChartConfig);
};
