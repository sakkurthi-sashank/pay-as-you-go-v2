import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { storageFiles } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { generateTemporaryBlobLink } from "@/server/files/generate-pre-signed-url";

export const storageFilesRouter = createTRPCRouter({
  createFileEntry: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        fileName: z.string(),
        fileSize: z.string(),
        mineType: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const file = await db
        .insert(storageFiles)
        .values({
          id: input.id,
          ownerId: ctx.session.user.id,
          fileName: input.fileName,
          fileSize: input.fileSize,
          mimeType: input.mineType,
          isShared: false,
        })
        .returning({
          id: storageFiles.id,
          fileName: storageFiles.fileName,
        })
        .execute();

      if (!file || file.length === 0) {
        throw new Error("Failed to create file entry");
      }

      return file[0];
    }),
  getFiles: protectedProcedure.query(async ({ ctx }) => {
    const blobs = await db
      .select()
      .from(storageFiles)
      .where(eq(storageFiles.ownerId, ctx.session.user.id))
      .execute();

    const urlsIncludedBlob = [];
    for (const blob of blobs) {
      const url = await generateTemporaryBlobLink(blob.id, blob.fileName);
      urlsIncludedBlob.push({ ...blob, url });
    }

    return urlsIncludedBlob;
  }),
});
