import { useMutation } from '@tanstack/react-query';
import { upload } from '@vercel/blob/client'
import { createDocument } from '@/actions/document'

export default function useFileUpload() {

    //Uplod file to Vercel Blob storage

    //Environment variable to support file upload as been provided 
    // and does not need to be passed in upload funtion
    async function uploadFile(file: File) {
        const filePath = `/pdfs/${file.name}`

        //Upload file to server
        const newBlob = await upload(filePath, file, {
            access: 'public',
            handleUploadUrl: '/api/upload',
        });

        // Create document in database
        //Made separate calls in order to get the document id for client side navigation
        const document = await createDocument(
            file.name, // Use filename as title
            newBlob.pathname // Store blob URL as key
        )
        
        return {
            documentId: document.id
        }
    }
    
    //Utilize useMutation from tanstack query to have access to API loading and error states
    const { mutateAsync, isPending, isError } = useMutation({
        mutationFn: uploadFile
    })

    return {
        uploadFile: mutateAsync,
        isLoading: isPending,
        isError
    }
}