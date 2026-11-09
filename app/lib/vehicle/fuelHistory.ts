import type {
  FuelHistoryMetric,
  FuelHistoryPeriod,
  FuelHistoryStats,
  FuelHistoryValue,
} from "../types/vehicle";

export type FuelHistoryRecord = {
  odometer: number;
  liters: number;
  amount: number;
  currency?: string | null;
  fullTank: boolean;
  createdAt: Date | string;
};

type Measurement = {
  value: number;
  numerator: number;
  denominator: number;
  date: string;
  currency: string | null;
};

type Measurements = Record<FuelHistoryMetric, Measurement | null>;

const positive = (value: number) => Number.isFinite(value) && value > 0;
const nonNegative = (value: number) => Number.isFinite(value) && value >= 0;
const metrics: FuelHistoryMetric[] = [
  "consumption",
  "kmPerLiter",
  "pricePerLiter",
  "refuelCost",
  "costPerKm",
];
const periods: FuelHistoryPeriod[] = ["last", "3", "6", "12", "all"];

// Each interval ends at a full tank and includes all fills since the preceding full tank.
export function calculateFuelHistory(
  records: FuelHistoryRecord[]
): FuelHistoryStats {
  const ordered = [...records].sort(
    (a, b) =>
      a.odometer - b.odometer ||
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  let previousFull: FuelHistoryRecord | null = null;
  let interval: FuelHistoryRecord[] = [];

  const rows = ordered.map((record) => {
    const date = new Date(record.createdAt).toISOString();
    const currency = record.currency || null;
    const row: Measurements = {
      consumption: null,
      kmPerLiter: null,
      pricePerLiter: null,
      refuelCost: null,
      costPerKm: null,
    };
    if (positive(record.liters) && nonNegative(record.amount) && currency) {
      row.pricePerLiter = {
        value: record.amount / record.liters,
        numerator: record.amount,
        denominator: record.liters,
        date,
        currency,
      };
    }
    if (nonNegative(record.amount) && currency) {
      row.refuelCost = {
        value: record.amount,
        numerator: record.amount,
        denominator: 1,
        date,
        currency,
      };
    }
    if (previousFull) interval.push(record);
    if (record.fullTank) {
      if (previousFull) {
        const distance = record.odometer - previousFull.odometer;
        const validLiters = interval.every((fill) => positive(fill.liters));
        const liters = interval.reduce((sum, fill) => sum + fill.liters, 0);
        if (positive(distance) && validLiters && positive(liters)) {
          row.consumption = {
            value: (100 * liters) / distance,
            numerator: 100 * liters,
            denominator: distance,
            date,
            currency: null,
          };
          row.kmPerLiter = {
            value: distance / liters,
            numerator: distance,
            denominator: liters,
            date,
            currency: null,
          };
          if (
            currency &&
            interval.every(
              (fill) => fill.currency === currency && nonNegative(fill.amount)
            )
          ) {
            const amount = interval.reduce((sum, fill) => sum + fill.amount, 0);
            row.costPerKm = {
              value: amount / distance,
              numerator: amount,
              denominator: distance,
              date,
              currency,
            };
          }
        }
      }
      previousFull = record;
      interval = [];
    }
    return row;
  });

  return Object.fromEntries(
    periods.map((period) => {
      const window =
        period === "all" || period === "last"
          ? rows
          : rows.slice(-Number(period));
      const latestCurrency = ordered.at(-1)?.currency || null;
      const values = Object.fromEntries(
        metrics.map((metric) => {
          let available = window
            .map((row) => row[metric])
            .filter((value): value is Measurement => value !== null);
          if (period === "last") {
            available =
              metric === "consumption" ||
              metric === "kmPerLiter" ||
              metric === "costPerKm"
                ? available.slice(-1)
                : rows.at(-1)?.[metric]
                  ? [rows.at(-1)![metric]!]
                  : [];
          } else if (metric !== "consumption" && metric !== "kmPerLiter")
            available = available.filter(
              (value) => value.currency === latestCurrency
            );
          const sumNumerator = available.reduce(
            (sum, value) => sum + value.numerator,
            0
          );
          const sumDenominator = available.reduce(
            (sum, value) => sum + value.denominator,
            0
          );
          const result: FuelHistoryValue = {
            min: available.length
              ? Math.min(...available.map((item) => item.value))
              : null,
            avg: sumDenominator > 0 ? sumNumerator / sumDenominator : null,
            max: available.length
              ? Math.max(...available.map((item) => item.value))
              : null,
            count: available.length,
            total: period === "last" ? (rows.length ? 1 : 0) : window.length,
            lastAt: available.at(-1)?.date || null,
            currency:
              metric === "consumption" || metric === "kmPerLiter"
                ? null
                : (period === "last"
                    ? available.at(-1)?.currency
                    : latestCurrency) || null,
          };
          return [metric, result];
        })
      ) as Record<FuelHistoryMetric, FuelHistoryValue>;
      return [period, values];
    })
  ) as FuelHistoryStats;
}
