"use client";

import { useState } from "react";
import Image from "next/image";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { generateTemporaryBlobLink } from "@/server/files/generate-pre-signed-url";

export default function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState<{
    id: string;
    fileName: string;
    fileSize: string;
    url: string;
  }>();
  const [images] = api.files.getFiles.useSuspenseQuery();

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <div key={image.id} className="group relative">
            <Image
              src={"/image.png"}
              alt={`Image ${image.id}`}
              width={400}
              height={300}
              className="h-auto w-full rounded-lg"
              style={{ aspectRatio: "400/300", objectFit: "cover" }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={async () => {
                    const url = await generateTemporaryBlobLink(
                      image.id,
                      image.fileName,
                    );
                    setSelectedImage({ ...image, url });
                  }}
                >
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Image info</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Image Information</DialogTitle>
                </DialogHeader>
                <picture>
                  <img
                    src={selectedImage?.url ?? "/image.png"}
                    alt={`Image ${image.id}`}
                    width={400}
                    height={300}
                    className="h-auto w-full rounded-lg"
                    style={{ aspectRatio: "400/300", objectFit: "cover" }}
                  />
                </picture>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="font-medium">ID:</span>
                    <span className="col-span-3">{selectedImage?.id}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="font-medium">File Name:</span>
                    <span className="col-span-3">
                      {selectedImage?.fileName}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="font-medium">File Size:</span>
                    <span className="col-span-3">
                      {selectedImage?.fileSize &&
                        `${(parseInt(selectedImage.fileSize) / 1024 / 1024).toFixed(2)} MB`}
                    </span>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
}
