import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { storageUserPurchase, storageFiles } from "@/server/db/schema";
import { gt, sql, and, eq } from "drizzle-orm";
import { sum } from "drizzle-orm";

export const purchaseRouter = createTRPCRouter({
  avaliableStorage: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db
      .select({
        sum: sum(storageUserPurchase.storageSize),
      })
      .from(storageUserPurchase)
      .where(
        and(
          gt(storageUserPurchase.expiresAt, new Date()),
          eq(storageUserPurchase.userId, ctx.session.user.id),
        ),
      )
      .execute();

    console.log(data[0]);

    return data[0];
  }),
});
