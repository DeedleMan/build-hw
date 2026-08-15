export const greet = (name: string): string => {
  return `Hello, ${name}!`;
};

export const formatCurrency = (amount: number, currency: string = "USD"): string => {
  return `${currency} ${amount.toFixed(2)}`;
};

export const calculateTotal = (items: number[], prices: number[]): number => {
  return items.reduce((sum, item) => sum + item, 0);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

export const deepClone = <T>(obj: T): T => {
  return structuredClone(obj);
};
