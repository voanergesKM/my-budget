import { Transaction } from "@/app/lib/definitions";

import { FuelRecordType } from "@/app/lib/types/vehicle";

export function mapFuelioRowToFuelRecord(row: any) {
  return {
    odometer: Number(row["Odo (km)"]),
    liters: Number(row["Fuel (litres)"]),
    amount: Number(row["Price (optional)"] || 0),
    consumption: Number(row["l/100km (optional)"] || 0),

    fullTank: row["Full"] === "1",
    isMissed: row["Missed"] === "1",

    station: row["StationID (optional)"] || null,
    location: row["City (optional)"] || null,
    notes: row["Notes (optional)"] || null,

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
  const { location, notes } = fuelRow;

  const locationWithNotest = [location, notes]
    .filter((v): v is string => !!v?.trim())
    .join(",");

  const pricePerLiter = Number(fuelRow.amount / fuelRow.liters).toFixed(2);

  return `${locationWithNotest} (${fuelRow.odometer}km | ${fuelRow.liters}l | ${pricePerLiter} per/l)`;
}
