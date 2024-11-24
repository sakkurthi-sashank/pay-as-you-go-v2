import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { storageUserPurchase, storageFiles } from "@/server/db/schema";
import { gt, sql, and, eq } from "drizzle-orm";
import { sum } from "drizzle-orm";

export const purchaseRouter = createTRPCRouter({
  avaliableStorage: protectedProcedure.query(async ({ ctx }) => {
    const avaliableStorageFromPurchase = await ctx.db
      .select({
        sum: sql<number>`CAST(COALESCE(${sum(storageUserPurchase.storageSize)}, 0) AS float)`,
      })
      .from(storageUserPurchase)
      .where(
        and(
          gt(storageUserPurchase.expiresAt, new Date()),
          eq(storageUserPurchase.userId, ctx.session.user.id),
        ),
      )
      .execute();

    const usedStorage = await ctx.db
      .select({
        sum: sql<number>`CAST(COALESCE(${sum(storageFiles.fileSize)}, 0) AS float)`,
      })
      .from(storageFiles)
      .where(eq(storageFiles.ownerId, ctx.session.user.id))
      .execute();

    const BYTES_TO_GB = 1024 * 1024 * 1024;

    const purchasedStorageNum = Number(
      avaliableStorageFromPurchase[0]?.sum ?? 0,
    );
    const usedStorageNum = Number(usedStorage[0]?.sum ?? 0) / BYTES_TO_GB;
    const availableStorageNum = purchasedStorageNum - usedStorageNum;

    return {
      totalPurchasedStorage: purchasedStorageNum.toFixed(4),
      totalUsedStorage: usedStorageNum.toFixed(4),
      availableStorage: availableStorageNum.toFixed(4),
      isStorageFull: availableStorageNum <= 0,
      usedStorageBytes: usedStorage[0]?.sum ?? 0,
    };
  }),
});
