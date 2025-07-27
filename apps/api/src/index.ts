import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

app.use(
  cors({
    // allow all origins *
    origin: ["*"],
  })
);

app.get("/api", (c) => {
  return c.json({
    message: "Hello from Haamil!",
  });
});

app.use("*", async (c, next) => {
  if (c.req.path.startsWith("/api")) {
    return next();
  }
  console.log("Serving static file:", c.req.path);
  return serveStatic({ root: "./public" })(c, next);
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

if (process.env.NODE_ENV === "development") {
  console.log(`Server is running on http://localhost:${port}/api`);
}

serve({
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0",
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM - shutting down gracefully");
  process.exit(0);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught error:", err);
  process.exit(1);
});
