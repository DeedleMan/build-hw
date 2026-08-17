export const processData = (values: number[]): number => {
  return values.reduce((a, b) => a + b, 0) / values.length;
};

export const processText = (text: string): string => {
  return text.trim().toUpperCase();
};

export const processDate = (date: Date): string => {
  return date.toISOString();
};
