"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <>
      <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div
            className="absolute inset-0 bg-neutral-950"
            style={{
              backgroundSize: "cover",
              backgroundImage:
                "url(https://images.unsplash.com/photo-1518355077561-4af7abce973d?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
            }}
          ></div>
        </div>

        <div className="flex h-screen items-center justify-center lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-10 sm:w-[500px]">
            <div className="flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-700">PayDrive</span>
            </div>
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Sign in to your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back! Sign in to your account to continue using
                PayDrive.
              </p>
            </div>

            <form
              action={async () => {
                await signIn("google", {
                  redirectTo: "/",
                });
              }}
              className="flex w-full flex-col items-center justify-center space-y-6"
            >
              <Button
                size={"lg"}
                variant="outline"
                className="w-full max-w-[300px] space-x-2 rounded-full border border-gray-300 text-gray-700 shadow-md"
              >
                <FcGoogle size={20} />
                <span className="text-base">Sign In with Google</span>
              </Button>
            </form>

            <p className="px-8 text-center text-sm text-muted-foreground">
              By continuing, you are indicating that you accept our Terms of
              Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
