export const routes = {
  home: () => import("./pages/home"),
  about: () => import("./pages/about"),
};

export type TRouteName = keyof typeof routes;

export const resolveRoute = async (name: TRouteName): Promise<string> => {
  const page = await routes[name]();
  return page.render();
};