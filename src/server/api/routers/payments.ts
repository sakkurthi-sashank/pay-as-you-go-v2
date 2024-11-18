import Razorpay from "razorpay";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const paymentsRouter = createTRPCRouter({
  createOrder: protectedProcedure
    .input(z.object({ amount: z.number().int() }))
    .mutation(async ({ input }) => {
      const instance = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID ?? "",
        key_secret: process.env.RAZOR_PAY_KEY_SECRET ?? "",
      });

      const order = await instance.orders.create({
        amount: input.amount * 100,
        currency: "INR",
        receipt: `order_${Date.now()}`,
      });

      return order;
    }),
});
