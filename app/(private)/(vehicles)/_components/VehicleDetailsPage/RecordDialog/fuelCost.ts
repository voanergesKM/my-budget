type FuelValue = number | "";

function validNumber(value: FuelValue): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function roundCurrency(value: number): FuelValue {
  return Number.isFinite(value)
    ? Math.round((value + Number.EPSILON) * 100) / 100
    : "";
}

export function calculatePricePerLiter(
  amount: FuelValue,
  liters: FuelValue
): FuelValue {
  if (
    !validNumber(amount) ||
    amount === 0 ||
    !validNumber(liters) ||
    liters === 0
  )
    return "";
  return roundCurrency(amount / liters);
}

export function calculateFuelAmount(
  liters: FuelValue,
  pricePerLiter: FuelValue
): FuelValue {
  if (!validNumber(liters) || liters === 0 || !validNumber(pricePerLiter))
    return "";
  return roundCurrency(liters * pricePerLiter);
}
