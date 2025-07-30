import { notFound, onError } from "stoker/middlewares";

import type { AppOpenAPI } from "./types";

import { BASE_PATH } from "./constants";
import createRouter from "./create-router";
import { cors } from "hono/cors";

import { env } from "hono/adapter";

export default function createApp() {
  const app = createRouter()
    .use(
      "*",
      cors({
        origin: (origin, c) => {
          const { ALLOWED_ORIGINS } = env(c);
          const allowedOrigins = ALLOWED_ORIGINS?.split(",") || [];
          if (!origin) {
            return "*";
          }
          const isAllowed = allowedOrigins.includes(origin);

          return isAllowed ? origin : ""; // Empty string denies invalid origins
        },
        credentials: true,
      })
    )
    .use("*", async (c, next) => {
      if (c.req.path.startsWith(BASE_PATH)) {
        return next();
      }
      return c.notFound();
    })
    .basePath(BASE_PATH) as AppOpenAPI;

  app
    .use("*", async (_c, next) => {
      return next();
    })
    .notFound(notFound)
    .onError(onError);

  return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().route("/", router);
}
