export const add = (a: number, b: number): number => {
  return a + b;
};

export const sum = (values: number[]): number => {
  return values.reduce(add, 0);
};

export const subtract = (a: number, b: number): number => {
  return a - b;
};

export const multiply = (a: number, b: number): number => {
  return a * b;
};

export const divide = (a: number, b: number): number => {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
};
