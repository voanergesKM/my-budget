import { useTranslations } from "next-intl";

import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import { StatCard } from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/index";
import { StatsBlock, StatsValue } from "@/app/lib/types/vehicle";

function ExpensesByCategory({
  cardValue,
  currency,
}: {
  cardValue: StatsBlock;
  currency: string;
}) {
  const t = useTranslations("Vehicles");
  const tc = useTranslations("VehicleExpenseCategory");

  const title = t("expensesByCategory");

  return (
    <StatCard>
      <>
        <div className="text-md flex items-center gap-2 text-muted-foreground">
          <span>{title}</span>
        </div>

        <div
          className={
            "grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2 text-text-secondary"
          }
        >
          {Object.entries(cardValue).map(
            ([key, value]: [string, StatsValue]) => {
              return (
                <div key={key} className={`text-muted-foreground`}>
                  <p>{tc(key)}:</p>
                  <p className={"text-sm"}>
                    {getFormattedAmount(currency, value as number)}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </>
    </StatCard>
  );
}

export default ExpensesByCategory;
