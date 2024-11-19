"use server";

import { env } from "@/env";
import {
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  SASProtocol,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

const containerName = env.NEXT_PUBLIC_STORAGE_CONTAINER_NAME;
const account = env.NEXT_PUBLIC_STORAGE_ACCOUNT_NAME;
const accountKey = env.NEXT_PUBLIC_ACCOUNT_KEY;

if (!containerName || !account || !accountKey) {
  throw new Error("Missing environment variables for Azure Blob Storage");
}

export const generateTemporaryBlobLink = async (
  fileUuid: string,
  fileName: string,
) => {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    account,
    accountKey,
  );

  const permissions = new BlobSASPermissions();
  permissions.read = true;

  const expiresOn = new Date(new Date().valueOf() + 60 * 60 * 1000);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName: fileUuid,
      permissions,
      expiresOn,
      protocol: SASProtocol.Https,
      // contentDisposition: `inline; filename="${encodeURIComponent(fileName)}"`,
    },
    sharedKeyCredential,
  ).toString();

  const sasUrl = `https://${account}.blob.core.windows.net/${containerName}/${fileUuid}?${sasToken}`;

  return sasUrl;
};
