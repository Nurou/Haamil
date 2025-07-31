import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import createRouter from "@/api/lib/create-router";
import { auth } from "@/api/lib/auth";

const router = createRouter();

router.openapi(
  createRoute({
    tags: ["Auth"],
    method: "get",
    path: "/auth/health",
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        createMessageObjectSchema("Auth service is running"),
        "Auth service is running"
      ),
    },
  }),
  (c) => {
    return c.json(
      {
        message: "Auth service is running",
      },
      HttpStatusCodes.OK
    );
  }
);

router.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

export default router;
