import { notFound, onError } from "stoker/middlewares";

import type { AppOpenAPI } from "./types";

import { BASE_PATH } from "./constants";
import createRouter from "./create-router";

export default function createApp() {
  const app = createRouter()
    .use("*", (c, next) => {
      if (c.req.path.startsWith(BASE_PATH)) {
        return next();
      }
      // SPA redirect to /index.html
      const requestUrl = new URL(c.req.raw.url);
      return c.env.ASSETS.fetch(new URL("/index.html", requestUrl.origin));
    })
    .basePath(BASE_PATH) as AppOpenAPI;

  app
    .use("*", async (c, next) => {
      return next();
    })
    .notFound(notFound)
    .onError(onError);

  return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().route("/", router);
}
