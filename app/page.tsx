import PreviousDocs from "@/components/previous-docs";
import { getAllDocuments } from "@/server/documents";
import dynamic from "next/dynamic";

const FileUploader = dynamic(() => import("@/components/file-uploader"), { ssr: false });


export default async function Home() {
  const documents = await getAllDocuments();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">PDF Uploader</h1>
      <div className="">
        <FileUploader />
      </div>

      <div className="w-full max-w-xl mt-9 xl:mt-11">
        <h3 className="text-lg">Previous Documents</h3>
        <PreviousDocs documents={documents} />
      </div>
    </main>
  )
}

