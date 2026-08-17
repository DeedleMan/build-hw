import { greet } from "../utils";

export const render = (): string => {
  return `<h1>Home</h1>\n<p>${greet("Home visitor")}</p>`;
};