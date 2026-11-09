import assert from "node:assert/strict";
import test from "node:test";
import {
  convertDistance,
  convertFuel,
  consumptionLitersPer100Km,
  distancePerFuelFromConsumption,
} from "../app/lib/vehicle/units.ts";

test("converts distances and US gallons without premature rounding", () => {
  assert.equal(convertDistance(100, "mi", "km"), 160.9344);
  assert.equal(convertFuel(1, "us_gal", "l"), 3.785411784);
  assert.ok(
    Math.abs(
      convertDistance(convertDistance(12345, "mi", "km"), "km", "mi") - 12345
    ) < 1e-10
  );
});

test("calculates equivalent consumption for each input unit", () => {
  const l100 = consumptionLitersPer100Km(100, 10, "mi", "us_gal");
  assert.ok(Math.abs(l100 - 23.521458333) < 1e-8);
  assert.ok(
    Math.abs(distancePerFuelFromConsumption(l100, "mi", "us_gal") - 10) < 1e-10
  );
  assert.equal(distancePerFuelFromConsumption(0, "mi", "us_gal"), null);
  assert.equal(consumptionLitersPer100Km(0, 10, "mi", "l"), null);
});

test("all unit combinations preserve the same physical consumption", () => {
  for (const distanceUnit of ["km", "mi"]) {
    for (const fuelUnit of ["l", "us_gal"]) {
      const distance = convertDistance(500, "km", distanceUnit);
      const volume = convertFuel(40, "l", fuelUnit);
      const consumption = consumptionLitersPer100Km(
        distance,
        volume,
        distanceUnit,
        fuelUnit
      );
      assert.ok(Math.abs(consumption - 8) < 1e-10);
      assert.ok(
        Math.abs(
          distancePerFuelFromConsumption(consumption, distanceUnit, fuelUnit) -
            distance / volume
        ) < 1e-10
      );
    }
  }
});
