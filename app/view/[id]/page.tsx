import dynamic from "next/dynamic"
import { getFileUrl } from "@/server/file"
import { Skeleton } from "@/components/ui/skeleton"
import PDFViewerLoading from "@/components/pdf-viewer-loading"

const PDFViewer = dynamic(() => import("@/components/pdf-viewer"), { 
  loading: () => (
    <PDFViewerLoading/>
  ),
  ssr: false 
})

if (typeof Promise.withResolvers === "undefined") {
  if (typeof window !== 'undefined') {
    // @ts-expect-error This does not exist outside of polyfill which this is doing
    window.Promise.withResolvers = function () {
      let resolve, reject
      const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })
      return { promise, resolve, reject }
    }
  } else {
    // @ts-expect-error This does not exist outside of polyfill which this is doing
    global.Promise.withResolvers = function () {
      let resolve, reject
      const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })
      return { promise, resolve, reject }
    }
  }
}


export default async function ViewPDF({ params }: { params: { id: string } }) {
  try {
    const { url } = await getFileUrl(params.id)

    return (
      <main className="flex min-h-screen flex-col items-center justify-center max-sm:px-0 p-12 bg-zinc-100/50">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">PDF Viewer</h1>
        <div className="rounded-sm max-md:px-4 w-full max-w-2xl">
          <PDFViewer fileUrl={url} />
        </div>
      </main>
    )
  } catch (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-100/50">
        <div className="bg-white p-8 rounded-sm border border-input">
          <h1 className="text-3xl font-bold mb-6 text-center text-red-500">Error</h1>
          <p className="text-center">Failed to load PDF. Please try again.</p>
        </div>
      </main>
    )
  }
}

