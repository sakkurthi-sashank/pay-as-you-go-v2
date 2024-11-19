"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import { env } from "@/env";

type BillingData = {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  isShared: boolean;
  createdAt: string;
  amount: number;
  expiresAt: string | null;
  paymentStatus: "paid" | "pending" | "overdue";
};

const fetchBillingData = async (): Promise<BillingData[]> => {
  return [
    {
      id: "1",
      fileName: "document.pdf",
      fileSize: 1024000,
      mimeType: "application/pdf",
      isShared: false,
      createdAt: "2023-06-01T12:00:00Z",
      amount: 5.99,
      expiresAt: "2023-07-01T12:00:00Z",
      paymentStatus: "pending",
    },
    {
      id: "2",
      fileName: "image.jpg",
      fileSize: 2048000,
      mimeType: "image/jpeg",
      isShared: true,
      createdAt: "2023-06-02T14:30:00Z",
      amount: 9.99,
      expiresAt: null,
      paymentStatus: "paid",
    },
    {
      id: "3",
      fileName: "video.mp4",
      fileSize: 5120000,
      mimeType: "video/mp4",
      isShared: false,
      createdAt: "2023-05-30T10:00:00Z",
      amount: 14.99,
      expiresAt: "2023-06-30T10:00:00Z",
      paymentStatus: "overdue",
    },
  ];
};

export default function BillingPage() {
  const [billingData, setBillingData] = useState<BillingData[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { data } = useSession();
  const order = api.payments.createOrder.useMutation({
    onSuccess(data) {
      setOrderId(data.id);
    },
  });

  const handlePayment = (id: string) => {
    const options = {
      key: env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID,
      amount: 10,
      currency: "INR",
      name: data?.user?.email?.split("@")[0],
      description: "Payment for your videos",
      image: "/favicon.ico",
      order_id: orderId,
      handler: async function (response: any) {},
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

  useEffect(() => {
    const loadBillingData = async () => {
      const data = await fetchBillingData();
      setBillingData(data);
    };
    loadBillingData();
  }, []);

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getPaymentStatusBadge = (status: BillingData["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "overdue":
        return <Badge className="bg-red-500">Overdue</Badge>;
    }
  };

  return (
    <div className="mt-10 flex w-full justify-center">
      <Card className="max-w-6xl">
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              A list of your recent bills for stored files.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Shared</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.fileName}</TableCell>
                  <TableCell>{formatFileSize(item.fileSize)}</TableCell>
                  <TableCell>{item.mimeType}</TableCell>
                  <TableCell>{item.isShared ? "Yes" : "No"}</TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell>${item.amount.toFixed(2)}</TableCell>
                  <TableCell>{formatDate(item.expiresAt)}</TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(item.paymentStatus)}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        order.mutate({ amount: 10 });
                        handlePayment(item.id);
                      }}
                      disabled={item.paymentStatus === "paid"}
                    >
                      {item.paymentStatus === "paid" ? "Paid" : "Pay"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
