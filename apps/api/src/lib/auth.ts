import { betterAuth } from "better-auth";
import { config as dotenvConfig } from "dotenv";
import { Pool } from "pg";
dotenvConfig();

console.log(process.env.DATABASE_URL);

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [],
  secret: process.env.BETTER_AUTH_SECRET,
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
