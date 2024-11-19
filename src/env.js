import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */

  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    RAZOR_PAY_KEY_SECRET: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_STORAGE_CONTAINER_NAME: z.string(),
    NEXT_PUBLIC_STORAGE_ACCOUNT_NAME: z.string(),
    NEXT_PUBLIC_ACCOUNT_KEY: z.string(),
    NEXT_PUBLIC_AZURE_STORAGE_SAS_TOKEN: z.string(),
    NEXT_PUBLIC_RAZOR_PAY_KEY_ID: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_STORAGE_CONTAINER_NAME:
      process.env.NEXT_PUBLIC_STORAGE_CONTAINER_NAME,
    NEXT_PUBLIC_STORAGE_ACCOUNT_NAME:
      process.env.NEXT_PUBLIC_STORAGE_ACCOUNT_NAME,
    NEXT_PUBLIC_ACCOUNT_KEY: process.env.NEXT_PUBLIC_ACCOUNT_KEY,
    NEXT_PUBLIC_AZURE_STORAGE_SAS_TOKEN:
      process.env.NEXT_PUBLIC_AZURE_STORAGE_SAS_TOKEN,
    NEXT_PUBLIC_RAZOR_PAY_KEY_ID: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
