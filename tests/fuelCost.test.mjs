import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateFuelAmount,
  calculatePricePerLiter,
} from "../app/(private)/(vehicles)/_components/VehicleDetailsPage/RecordDialog/fuelCost.ts";

test("calculates price and total with decimal rounding", () => {
  assert.equal(calculatePricePerLiter(1500, 30), 50);
  assert.equal(calculatePricePerLiter(100, 3), 33.33);
  assert.equal(calculateFuelAmount(10.25, 56.89), 583.12);
  assert.equal(calculateFuelAmount(0.1, 0.2), 0.02);
});

test("leaves derived values empty for missing, invalid, or zero liters", () => {
  for (const liters of ["", 0, -1, NaN]) {
    assert.equal(calculatePricePerLiter(100, liters), "");
    assert.equal(calculateFuelAmount(liters, 50), "");
  }
  assert.equal(calculatePricePerLiter("", 10), "");
  assert.equal(calculatePricePerLiter(0, 10), "");
  assert.equal(calculateFuelAmount(10, ""), "");
});
