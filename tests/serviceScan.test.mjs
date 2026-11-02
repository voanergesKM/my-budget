import assert from "node:assert/strict";
import test from "node:test";
import {
  prepareServiceScanRows,
  sumScanAmounts,
} from "../app/(private)/(vehicles)/_components/VehicleDetailsPage/RecordDialog/serviceScanUtils.ts";

test("groups matched and unmatched rows by category without losing costs or detail", () => {
  const rows = prepareServiceScanRows(
    [
      {
        title: "Filter",
        category: "maintenance",
        parts: [
          {
            name: "Filter",
            article: "A1",
            quantity: 2,
            unitPrice: 5,
            total: 10,
          },
        ],
        labor: [],
      },
      {
        title: "Oil",
        category: "maintenance",
        parts: [],
        labor: [{ name: "Replace oil", total: 4.5 }],
      },
      {
        title: "Alignment",
        category: "repair",
        parts: [],
        labor: [{ name: "Alignment", total: 7 }],
      },
    ],
    (key) => key,
    (key) => key
  );
  assert.equal(rows.length, 2);
  assert.equal(rows[0].amount, "14.5");
  assert.match(rows[0].notes, /Filter \(A1\)/);
  assert.match(rows[0].notes, /Replace oil/);
  assert.equal(rows[1].amount, "7");
});

test("leaves missing costs unknown and sums decimal amounts accurately", () => {
  assert.equal(sumScanAmounts([0.1, 0.2]), 0.3);
  assert.equal(sumScanAmounts([5, null]), null);
  const rows = prepareServiceScanRows(
    [
      {
        title: "Part",
        category: "repair",
        parts: [
          {
            name: "Part",
            article: null,
            quantity: null,
            unitPrice: null,
            total: null,
          },
        ],
        labor: [],
      },
    ],
    (key) => key,
    (key) => key
  );
  assert.equal(rows[0].amount, "");
  assert.match(rows[0].notes, /unknown/);
});
