import Razorpay from "razorpay";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { env } from "@/env";
import { storageUserPurchase } from "@/server/db/schema";

export const paymentsRouter = createTRPCRouter({
  createOrder: protectedProcedure
    .input(z.object({ amount: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const instance = new Razorpay({
          key_id: env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID ?? "",
          key_secret: env.RAZOR_PAY_KEY_SECRET ?? "",
        });

        const order = await instance.orders.create({
          amount: input.amount * 100,
          currency: "INR",
          receipt: `order_${Date.now()}`,
        });

        return order;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create order");
      }
    }),
  captureOrder: protectedProcedure
    .input(
      z.object({
        razorpay_payment_id: z.string(),
        razorpay_order_id: z.string(),
        razorpay_signature: z.string(),
        totalAmount: z.number(),
        storageSize: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await ctx.db
          .insert(storageUserPurchase)
          .values({
            price: input.totalAmount,
            userId: ctx.session.user.id,
            storageSize: input.storageSize,
            razorpayOrderId: input.razorpay_order_id,
            razorpayPaymentId: input.razorpay_payment_id,
            razorpaySignature: input.razorpay_signature,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          })
          .execute();

        return data;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to capture order");
      }
    }),
});
