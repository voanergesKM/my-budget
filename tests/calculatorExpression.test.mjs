import assert from "node:assert/strict";
import test from "node:test";

import { evaluateCalculatorExpression } from "../app/ui/components/Form/fields/common/calculatorExpression.ts";

test("respects precedence, parentheses, and unary operators", () => {
  assert.equal(evaluateCalculatorExpression("2+2*3"), 8);
  assert.equal(evaluateCalculatorExpression("(2+2)*3"), 12);
  assert.equal(evaluateCalculatorExpression("-2 * (3 + +4)"), -14);
  assert.equal(evaluateCalculatorExpression("12/3/2"), 2);
});

test("accepts decimal commas and handles common floating-point artifacts", () => {
  assert.equal(evaluateCalculatorExpression("1,2 + 0.3"), 1.5);
  assert.equal(evaluateCalculatorExpression("0.1+0.2"), 0.3);
});

test("rejects invalid, incomplete, and non-finite expressions", () => {
  for (const expression of [
    "",
    "2+",
    "2(3)",
    "(1+2",
    "1/0",
    "1/(-0)",
    "2**3",
    "foo",
    "1e309",
  ]) {
    assert.throws(() => evaluateCalculatorExpression(expression), expression);
  }
});
