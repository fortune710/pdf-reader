import { getDocumentById } from "./documents";
import { head as getFileBlob } from "@vercel/blob"

export async function getFileUrl(documentId: string) {
    //Get document metadata first for fetching file blob
    const { key } = await getDocumentById(documentId);

    //Get file blob which includes file url
    const blob = await getFileBlob(key);

    return {
        url: blob.downloadUrl
    }
}
  