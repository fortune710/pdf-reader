"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { useRouter } from "next/navigation"
import { Upload, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import useFileUpload from "@/hooks/use-file-upload"
import { useToast } from "@/hooks/use-toast"

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const { uploadFile, isLoading, isError } = useFileUpload();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  })

  const handleUpload = async () => {
    if (!file) return

    
    try {
      const { documentId } = await uploadFile(file)
      console.log({ file, documentId })
      return router.push(`/view/${documentId}`);
    } catch (error: any) {
      return toast({
        title: "Error Uploading File",
        description: error.message || "Failed to upload file. Please try again."
      })
    }
  }

  return (
    <div className="w-full max-w-md">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive ? "border-purple-400 bg-purple-100" : "border-gray-300 hover:border-purple-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Drag &amp; drop a PDF file here, or click to select one</p>
      </div>
      {file && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow flex items-center justify-between">
          <div className="flex items-center">
            <File className="h-6 w-6 text-purple-500 mr-2" />
            <span className="text-sm text-gray-600">{file.name}</span>
          </div>
          <Button onClick={handleUpload} disabled={isLoading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      )}
    </div>
  )
}

