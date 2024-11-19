import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { paymentsRouter } from "./routers/payments";
import { storageFilesRouter } from "./routers/storageFiles";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  payments: paymentsRouter,
  files: storageFilesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
