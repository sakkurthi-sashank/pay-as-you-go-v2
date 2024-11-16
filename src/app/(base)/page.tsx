import { HydrateClient } from "@/trpc/server";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/files/upload";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center space-y-4">
        <h1 className="text-5xl font-semibold">File Vault</h1>
        <p className="text-muted-foreground">File upload component for React</p>
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full shadow" variant="outline">
                File upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-center">
                  Upload your files
                </DialogTitle>
                <DialogDescription className="text-center">
                  The only file upload you will ever need
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <ImageUpload />
              </div>
            </DialogContent>
          </Dialog>
          <Link
            className="flex items-center gap-1"
            href="https://github.com/ManishBisht777/file-vault"
          >
            Github
            <MoveRight size={15} />
          </Link>
        </div>
      </main>
    </HydrateClient>
  );
}
