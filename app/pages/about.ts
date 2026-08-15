import { generateId } from "../utils";

export const render = (): string => {
  return `<h1>About</h1>\n<p>Page id: ${generateId()}</p>`;
};