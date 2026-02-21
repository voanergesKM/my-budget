import { Transaction, TranslateFunction } from "@/app/lib/definitions";

import { FuelRecordType, ServiceRecordType } from "@/app/lib/types/vehicle";

export function mapFuelioRowToFuelRecord(row: any, trip: number) {
  return {
    odometer: Number(row["Odo (km)"]),
    liters: Number(row["Fuel (litres)"]),
    amount: Number(row["Price (optional)"] || 0),
    consumption: Number(row["l/100km (optional)"] || 0),

    fullTank: row["Full"] === "1",
    isMissed: row["Missed"] === "1",

    station: row["StationID (optional)"] || null,
    city: row["City (optional)"] || null,
    notes: row["Notes (optional)"] || null,

    latitude: row["latitude (optional)"] || null,
    longitude: row["longitude (optional)"] || null,

    trip,

    createdAt: new Date(row["Data"]),
    imported: `fuelio`,
  };
}

export function mapFuelRowToTransaction(
  fuelRow: FuelRecordType,
  currency?: string,
  category?: string,
  amountInBaseCurrency?: number,
  imported?: string
): Partial<Transaction> {
  return {
    description: getFuelRowTransactionDescription(fuelRow),
    amount: fuelRow.amount,
    type: "outgoing",
    createdAt: fuelRow.createdAt,
    ...(currency && { currency }),
    ...(amountInBaseCurrency && { amountInBaseCurrency }),
    ...(category && { category }),
    ...(imported && { imported }),
  };
}

function getFuelRowTransactionDescription(fuelRow: FuelRecordType) {
  const { city, notes } = fuelRow;

  const locationWithNotest = [city, notes]
    .filter((v): v is string => !!v?.trim())
    .join(",");

  const pricePerLiter = Number(fuelRow.amount / fuelRow.liters).toFixed(2);

  return `${locationWithNotest} (${fuelRow.odometer}km | ${fuelRow.liters}l | ${pricePerLiter} per/l)`;
}

export function mapServiceRowToTransaction(
  t: TranslateFunction,
  serviceRow: ServiceRecordType,
  currency?: string,
  category?: string,
  amountInBaseCurrency?: number,
  imported?: string
): Partial<Transaction> {
  const description = getServiceRowTransactionDescription(serviceRow, t);

  return {
    description,
    amount: serviceRow.amount,
    type: "outgoing",
    createdAt: serviceRow.createdAt,
    ...(currency && { currency }),
    ...(category && { category }),
    ...(amountInBaseCurrency && { amountInBaseCurrency }),
    ...(imported && { imported }),
  };
}

function getServiceRowTransactionDescription(
  serviceRow: ServiceRecordType,
  t: TranslateFunction
) {
  const { title, category, odometer, amount, notes } = serviceRow;

  return [
    title && `${t("Common.inputs.title")}: ${title}`,
    category &&
      `${t("Common.selectors.categoryLabel")}: ${t(`VehicleExpenseCategory.${category}`)}`,
    odometer ? `${t("Common.inputs.odometer")}: ${odometer} km` : null,
    `${t("Common.inputs.amount")}: ${amount}`,
    notes && `${t("Table.notes")}: ${notes}`,
  ]
    .filter((v) => v !== null)
    .join(", ");
}
