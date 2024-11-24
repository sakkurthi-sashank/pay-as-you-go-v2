"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BlobUpload from "@/components/files/blob-upload";
import ImageGallery from "../_components/image-gallary";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Upload } from "lucide-react";

export default function Home() {
  const availableStorage = api.purchase.avaliableStorage.useQuery();

  return (
    <div>
      <div className="fixed right-3 top-2 flex h-12 items-center justify-center space-x-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              disabled={availableStorage.data?.isStorageFull}
            >
              <Upload className="mr-2 h-6 w-6" />
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
              <BlobUpload />
            </div>
          </DialogContent>
        </Dialog>
        <Card className="rounded-lg bg-white shadow-sm">
          <CardContent className="px-4 py-2">
            <div className="flex items-center justify-between space-x-2">
              <span className="text-sm font-medium text-gray-600">
                Available Storage
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {availableStorage.data?.availableStorage ?? 0} GB
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-lg bg-white shadow-sm">
          <CardContent className="px-4 py-2">
            <div className="flex items-center justify-between space-x-2">
              <span className="text-sm font-medium text-gray-600">
                Used Storage
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {availableStorage.data?.totalUsedStorage ?? 0} GB
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-lg bg-white shadow-sm">
          <CardContent className="px-4 py-2">
            <div className="flex items-center justify-between space-x-2">
              <span className="text-sm font-medium text-gray-600">
                Your Purchased Storage
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {availableStorage.data?.totalPurchasedStorage ?? 0} GB
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      <ImageGallery />
    </div>
  );
}
