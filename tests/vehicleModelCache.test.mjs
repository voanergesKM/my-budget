import assert from "node:assert/strict";
import test from "node:test";
import mongoose from "mongoose";
import { getCurrentModel } from "../app/lib/db/models/getCurrentModel.ts";

test("recompiles a stale cached vehicle model when metric settings are added", () => {
  const name = "VehicleSchemaHotReloadTest";
  const stale = mongoose.model(name, new mongoose.Schema({ name: String }));
  const schema = new mongoose.Schema({
    name: String,
    showMetricUnits: { type: Boolean, default: false },
  });
  const model = getCurrentModel(name, schema, ["showMetricUnits"]);
  assert.notEqual(model, stale);
  assert.equal(new model({ showMetricUnits: true }).showMetricUnits, true);
  const query = model.updateOne({}, { showMetricUnits: true });
  assert.deepEqual(query._castUpdate(query.getUpdate()), {
    $set: { showMetricUnits: true },
  });
  assert.equal(getCurrentModel(name, schema, ["showMetricUnits"]), model);
  mongoose.deleteModel(name);
});
