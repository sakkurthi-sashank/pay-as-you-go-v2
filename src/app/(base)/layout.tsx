"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, status } = useSession();
  const router = useRouter();

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
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
