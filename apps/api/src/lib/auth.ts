import { betterAuth } from "better-auth";
import { config as dotenvConfig } from "dotenv";
import { Pool } from "pg";

dotenvConfig();

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [],
  secret: process.env.BETTER_AUTH_SECRET,
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
