import assert from "node:assert/strict";
import test from "node:test";
import { calculateFuelHistory } from "../app/lib/vehicle/fuelHistory.ts";

const fill = (odometer, liters, amount, fullTank, currency = "UAH") => ({
  odometer,
  liters,
  amount,
  fullTank,
  currency,
  createdAt: new Date(Date.UTC(2025, 0, odometer / 100)),
});

test("calculates weighted interval statistics including partial fills", () => {
  const stats = calculateFuelHistory([
    fill(100, 30, 1500, true),
    fill(200, 10, 500, false),
    fill(400, 20, 1000, true),
    fill(800, 20, 1200, true),
    fill(900, 10, 700, false),
  ]);
  assert.equal(stats.all.consumption.count, 2);
  assert.equal(stats.all.kmPerLiter.count, 2);
  assert.equal(stats.all.kmPerLiter.avg, 14);
  assert.equal(stats.all.kmPerLiter.min, 10);
  assert.equal(stats.all.kmPerLiter.max, 20);
  assert.equal(stats.last.kmPerLiter.avg, 20);
  assert.equal(stats["3"].kmPerLiter.count, 2);
  assert.ok(Math.abs(stats.all.consumption.avg - 5000 / 700) < 1e-10);
  assert.ok(Math.abs(stats.all.costPerKm.avg - 2700 / 700) < 1e-10);
  assert.equal(stats.last.consumption.avg, 5);
  assert.equal(stats.last.refuelCost.avg, 700);
  assert.equal(stats["3"].consumption.count, 2);
  assert.equal(stats["3"].consumption.total, 3);
});

test("does not calculate an interval before the first full tank or combine currencies", () => {
  const stats = calculateFuelHistory([
    fill(100, 10, 20, false, "EUR"),
    fill(200, 30, 60, true, "EUR"),
    fill(300, 10, 500, false, "UAH"),
    fill(400, 10, 20, true, "EUR"),
  ]);
  assert.equal(stats.all.consumption.count, 1);
  assert.equal(stats.all.consumption.avg, 10);
  assert.equal(stats.all.kmPerLiter.avg, 10);
  assert.equal(stats.all.costPerKm.count, 0);
  assert.equal(stats.all.refuelCost.count, 3);
  assert.equal(stats.all.refuelCost.avg, 100 / 3);
  assert.equal(stats.all.pricePerLiter.count, 3);
});

test("handles empty data and intervals with invalid distance or liters", () => {
  assert.equal(calculateFuelHistory([]).last.consumption.avg, null);
  assert.equal(calculateFuelHistory([]).last.kmPerLiter.avg, null);
  const stats = calculateFuelHistory([
    fill(100, 10, 500, true),
    fill(100, 10, 500, true),
    fill(200, 0, 0, true),
  ]);
  assert.equal(stats.all.consumption.count, 0);
  assert.equal(stats.all.kmPerLiter.count, 0);
  assert.equal(stats.last.consumption.lastAt, null);
});

test("normalizes mile and US gallon records for metric statistics", () => {
  const stats = calculateFuelHistory(
    [fill(100, 10, 30, true), fill(200, 10, 40, true)],
    { distance: "mi", fuel: "us_gal" }
  );
  assert.ok(Math.abs(stats.last.consumption.avg - 23.521458333) < 1e-8);
  assert.ok(
    Math.abs(stats.last.kmPerLiter.avg - 160.9344 / 37.85411784) < 1e-10
  );
  assert.ok(Math.abs(stats.last.costPerKm.avg - 40 / 160.9344) < 1e-10);
  assert.ok(Math.abs(stats.last.pricePerLiter.avg - 40 / 37.85411784) < 1e-10);
});
