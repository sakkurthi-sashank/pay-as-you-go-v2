"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, status } = useSession();
  const router = useRouter();
  const availableStorage = api.purchase.avaliableStorage.useQuery();

  useEffect(() => {
    if (status !== "loading" && !data?.user) {
      router.push("/login");
    }
  }, [status, data?.user, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!data?.user) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Card className="w-64 bg-white shadow-sm">
              <CardContent className="px-4 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Available Storage
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {availableStorage.data?.sum ?? 0} GB
                  </span>
                </div>
              </CardContent>
            </Card>
          </header>
          {children}
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
}
