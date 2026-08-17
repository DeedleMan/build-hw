import { greet, formatCurrency } from "./utils";
import { resolveRoute } from "./routes";

const loadApp = async (): Promise<void> => {
  // Static imports: tree-shaking из всех утилит оставляет только greet и formatCurrency
  console.log(greet("Developer"));
  console.log(formatCurrency(42.50, "EUR"));

  // Dynamic import: code splitting: data.ts попадет в отдельный чанк
  const { processData } = await import("./data");
  const values = [10, 20, 30, 40];
  console.log("Average:", processData(values));

  // Route-based code splitting: в реальном приложении URI берётся из адресной строки
  const routeName = (process.env.ROUTE ?? "home") as "home" | "about";
  console.log(await resolveRoute(routeName));
};

loadApp();
