import { serve } from "@hono/node-server";

import app from "./app";

const port = Number(process.env.PORT) || 3001;
console.log(`Server is running on port http://localhost:${port}`);

const server = serve({
  fetch: app.fetch,
  port,
});

process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
