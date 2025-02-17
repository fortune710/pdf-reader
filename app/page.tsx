import dynamic from "next/dynamic";

const FileUploader = dynamic(() => import("@/components/file-uploader"), { ssr: false });


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <h1 className="text-4xl font-bold text-white mb-8">PDF Uploader</h1>
      <FileUploader />
    </main>
  )
}

