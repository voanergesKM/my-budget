import assert from "node:assert/strict";
import test from "node:test";
import { affectedFullTankIds } from "../app/lib/vehicle/fuelConsumption.ts";

test("import only selects inserted full tanks and immediately following full tanks", () => {
  const full = [
    { id: "old-100", odometer: 100 },
    { id: "new-250", odometer: 250 },
    { id: "old-300", odometer: 300 },
    { id: "old-400", odometer: 400 },
  ];
  const imported = [
    { id: "new-partial", odometer: 150, fullTank: false },
    { id: "new-250", odometer: 250, fullTank: true },
  ];
  assert.deepEqual(affectedFullTankIds(imported, full).sort(), [
    "new-250",
    "old-300",
  ]);
});

test("imported partial after final full tank changes no completed interval", () => {
  assert.deepEqual(
    affectedFullTankIds(
      [{ id: "partial", odometer: 400, fullTank: false }],
      [{ id: "old", odometer: 300 }]
    ),
    []
  );
});

test("same-odometer records do not select a full tank at the same distance", () => {
  assert.deepEqual(
    affectedFullTankIds(
      [{ id: "partial", odometer: 300, fullTank: false }],
      [
        { id: "equal", odometer: 300 },
        { id: "later", odometer: 400 },
      ]
    ),
    ["later"]
  );
});
