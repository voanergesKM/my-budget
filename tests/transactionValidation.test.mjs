import assert from "node:assert/strict";
import test from "node:test";
import { FieldApi, FormApi } from "@tanstack/react-form";

import {
  createTransactionSchema,
  validateTransactionForm,
} from "../app/lib/schema/transaction.schema.ts";

test("transaction submission assigns validation errors to the corresponding fields", async () => {
  const schema = createTransactionSchema((key) => key);
  let submitted = false;
  const form = new FormApi({
    defaultValues: {
      type: "outgoing",
      createdAt: "2026-01-01T00:00:00.000Z",
      category: "",
      amount: 0,
      currency: "UAH",
      description: "",
      amountInBaseCurrency: 0,
    },
    validators: {
      onSubmit: ({ value }) => validateTransactionForm(schema, value),
    },
    onSubmit: () => {
      submitted = true;
    },
  });
  const unmountForm = form.mount();
  const category = new FieldApi({ form, name: "category" });
  const amount = new FieldApi({ form, name: "amount" });
  const unmountCategory = category.mount();
  const unmountAmount = amount.mount();

  await form.handleSubmit();
  assert.equal(submitted, false);
  assert.equal(category.state.meta.isValid, false);
  assert.equal(category.state.meta.errors[0].message, "categoryRequired");
  assert.equal(amount.state.meta.isValid, false);
  assert.equal(amount.state.meta.errors[0].message, "baseRequired");

  category.handleChange("category-id");
  amount.handleChange(42);
  await form.handleSubmit();
  assert.equal(submitted, true);
  assert.equal(category.state.meta.isValid, true);
  assert.equal(amount.state.meta.isValid, true);
  unmountAmount();
  unmountCategory();
  unmountForm();
});
