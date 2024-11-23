"use client";

import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import { env } from "@/env";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { HardDrive, Shield, Zap, Clock } from "lucide-react";

export default function StoragePurchasePage() {
  const [storageSize, setStorageSize] = useState(15);
  const pricePerGB = 2;
  const totalPrice = storageSize * pricePerGB;
  const { data } = useSession();
  const [orderId, setOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  const order = api.payments.createOrder.useMutation({
    onSuccess(data) {
      setOrderId(data.id);
    },
  });

  const captureOrder = api.payments.captureOrder.useMutation({
    onSuccess(data, variables, context) {
      toast({
        title: "Payment Successful",
        description: "Your payment was successful",
        variant: "default",
      });
    },
    onError(error) {
      toast({
        title: "Payment Failed",
        description: "Your payment failed",
        variant: "destructive",
      });
    },
  });

  const handleSliderChange = (value: number[]) => {
    setStorageSize(value[0]);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= 1000) {
      setStorageSize(value);
    }
  };

  const handlePayment = () => {
    const options = {
      key: env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID,
      amount: totalPrice * 100,
      currency: "INR",
      name: data?.user?.email?.split("@")[0],
      description: "Payment for your videos",
      image: "/favicon.ico",
      order_id: orderId,
      handler: async function (response: any) {
        console.log(response);
        const data = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          totalAmount: totalPrice,
          storageSize: storageSize,
        };
        captureOrder.mutate(data);
      },
      prefill: {
        name: data?.user?.email?.split("@")[0],
        email: data?.user?.email,
        contact: "9999999999",
      },
      notes: {
        address: "PayDrive",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="m-3 min-h-screen rounded-lg bg-gray-50 p-6">
      <div className="mx-auto">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
            Expand Your Storage Space
          </h1>
          <p className="text-lg text-gray-600">
            Get the storage you need with our flexible pricing plans
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold text-blue-600">
                Flexible Storage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center">
                <p className="text-lg text-gray-600">
                  Choose any amount from 1GB to 1000GB to match your needs
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold text-blue-600">
                Secure Storage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center">
                <p className="text-lg text-gray-600">
                  Your data is protected with enterprise-grade security
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold text-blue-600">
                High Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center">
                <p className="text-lg text-gray-600">
                  Fast upload and download speeds for all your files
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold">
                Select Your Storage Plan
              </CardTitle>
              <p className="text-center text-gray-600">
                ₹{pricePerGB}/GB per month
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center">
                <span className="text-6xl font-bold text-blue-600">
                  ₹{totalPrice}
                </span>
                <span className="text-xl text-gray-600">/month</span>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Storage Amount</span>
                    <span className="text-sm text-gray-600">
                      {storageSize} GB
                    </span>
                  </div>
                  <Slider
                    min={1}
                    max={1000}
                    step={1}
                    value={[storageSize]}
                    onValueChange={handleSliderChange}
                    className="py-4"
                  />
                </div>

                <div className="flex w-full items-center space-x-2">
                  <Input
                    type="number"
                    value={storageSize}
                    onChange={handleInputChange}
                    min={1}
                    max={1000}
                    className="text-center"
                  />
                  <span className="text-gray-600">GB</span>
                </div>
              </div>

              <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    Instant activation after payment
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    Secure payment processing
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-blue-600 py-6 text-lg font-semibold hover:bg-blue-700"
                onClick={() => {
                  order.mutate({
                    amount: Number(totalPrice),
                  });
                  handlePayment();
                }}
              >
                Purchase {storageSize}GB for ₹{totalPrice}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Need help choosing the right storage plan? Contact our support team
            24/7
          </p>
        </div>
      </div>
    </div>
  );
}
