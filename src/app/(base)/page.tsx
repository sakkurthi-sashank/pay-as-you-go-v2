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
import BlobUpload from "@/components/files/blob-upload";
import ImageGallery from "../_components/image-gallary";

export default async function Home() {
  return (
    <HydrateClient>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="fixed right-2 top-2 rounded-full shadow"
            variant="outline"
          >
            File upload
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Upload your files</DialogTitle>
            <DialogDescription className="text-center">
              The only file upload you will ever need
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <BlobUpload />
          </div>
        </DialogContent>
      </Dialog>
      <ImageGallery />
    </HydrateClient>
  );
}
