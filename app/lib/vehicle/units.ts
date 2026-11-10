export type DistanceUnit = "km" | "mi";
export type FuelUnit = "l" | "us_gal";

export const KILOMETERS_PER_MILE = 1.609344;
export const LITERS_PER_US_GALLON = 3.785411784;

export function convertDistance(
  value: number,
  from: DistanceUnit,
  to: DistanceUnit
): number {
  return from === to
    ? value
    : from === "mi"
      ? value * KILOMETERS_PER_MILE
      : value / KILOMETERS_PER_MILE;
}

export function convertFuel(
  value: number,
  from: FuelUnit,
  to: FuelUnit
): number {
  return from === to
    ? value
    : from === "us_gal"
      ? value * LITERS_PER_US_GALLON
      : value / LITERS_PER_US_GALLON;
}

export function consumptionLitersPer100Km(
  distance: number,
  fuel: number,
  distanceUnit: DistanceUnit,
  fuelUnit: FuelUnit
): number | null {
  const km = convertDistance(distance, distanceUnit, "km");
  const liters = convertFuel(fuel, fuelUnit, "l");
  return Number.isFinite(km) && Number.isFinite(liters) && km > 0 && liters > 0
    ? (100 * liters) / km
    : null;
}

export function distancePerFuelFromConsumption(
  consumption: number | null | undefined,
  distanceUnit: DistanceUnit,
  fuelUnit: FuelUnit
): number | null {
  if (consumption == null || !Number.isFinite(consumption) || consumption <= 0)
    return null;
  return (
    convertDistance(100 / consumption, "km", distanceUnit) *
    convertFuel(1, fuelUnit, "l")
  );
}
