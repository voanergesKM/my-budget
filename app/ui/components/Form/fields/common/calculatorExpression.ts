/** Evaluate basic arithmetic with standard operator precedence. */
export function evaluateCalculatorExpression(expression: string): number {
  const input = expression.replace(/\s+/g, "").replace(/,/g, ".");
  let position = 0;

  function parseExpression(): number {
    let value = parseTerm();
    while (input[position] === "+" || input[position] === "-") {
      const operator = input[position++];
      const right = parseTerm();
      value = operator === "+" ? value + right : value - right;
    }
    return value;
  }

  function parseTerm(): number {
    let value = parseFactor();
    while (input[position] === "*" || input[position] === "/") {
      const operator = input[position++];
      const right = parseFactor();
      if (operator === "/" && right === 0) throw new Error("Division by zero");
      value = operator === "*" ? value * right : value / right;
    }
    return value;
  }

  function parseFactor(): number {
    if (input[position] === "+" || input[position] === "-") {
      const operator = input[position++];
      const value = parseFactor();
      return operator === "-" ? -value : value;
    }
    if (input[position] === "(") {
      position++;
      const value = parseExpression();
      if (input[position++] !== ")")
        throw new Error("Missing closing parenthesis");
      return value;
    }
    const match = input.slice(position).match(/^(?:\d+\.?\d*|\.\d+)/);
    if (!match) throw new Error("Invalid expression");
    position += match[0].length;
    return Number(match[0]);
  }

  const result = parseExpression();
  if (position !== input.length || !Number.isFinite(result)) {
    throw new Error("Invalid expression");
  }
  // Remove common floating-point artifacts without imposing currency rounding.
  return Number(result.toPrecision(15));
}
