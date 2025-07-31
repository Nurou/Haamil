import { env as envAdapter } from "hono/adapter";
import type { AppEnv } from "./types";

export const env = envAdapter<AppEnv["Bindings"]>;
