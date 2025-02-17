"use client"

import { useState, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Dot, Pause, Play } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs"
import { mergeTextItems } from "@/utils/functions";
import { Skeleton } from "./ui/skeleton";
import useTTS from "@/hooks/use-tts";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

//pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`



export default function PDFViewer({ fileUrl }: { fileUrl: string }) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useQueryState("current_page", parseAsInteger.withDefault(1))
  const [error, setError] = useState<string | null>(null);

  const [pageText, setPageText] = useState("");
  const { play, pause, isPlaying, isLoading, handleAudioPlayback } = useTTS({
    pageNumber,
    pageText,
    documentId: "1",
    voice: "s3://voice-cloning-zero-shot/baf1ef41-36b6-428c-9bdf-50ba54682bd8/original/manifest.json",
    tempertaure: 0
  })

  function compilePageText(textItems: Array<{ str: string }>) {
    const mergedText = mergeTextItems(textItems);
    return setPageText(mergedText);
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setError(null)
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF:", error)
    setError("Failed to load PDF. Please try again.")
  }



  // if (error) {
  //   return <div className="text-red-500">{error}</div>
  // }

  if (!fileUrl) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col items-center">
      <Document renderMode="none" className="w-full"  file={fileUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError}>
        <div className="h-[500px] overflow-y-auto border border-red-500 w-full mx-auto">
          <Page 
            className="w-full" 
            renderAnnotationLayer={false} 
            renderTextLayer 
            height={350}
            width={500}
            scale={1}
            //onLoadSuccess={removeTextLayerOffset}
            onGetTextSuccess={(content) => compilePageText(content.items as Array<{ str: string }>)} 
            pageNumber={pageNumber} 
          />
        </div>
      </Document>
      <section className="flex items-center justify-center mt-4 space-x-4">
        <Button 
          onClick={handleAudioPlayback} 
          disabled={isLoading}
          size="icon" 
          className="rounded-full"
        >
          {
            isLoading ? <Dot className="size-4"/> :
            isPlaying ? <Pause className="size-4" /> :
            <Play className="size-4"/>
          }
        </Button>

        <div className="flex items-center gap-4 px-2 py-1.5 bg-zinc-900 rounded-3xl text-white">
          <Button 
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))} disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {
            !numPages ? <Skeleton className="h-4 w-[80px]" /> :
            <p className="text-sm">
              Page {pageNumber} of {numPages}
            </p>
          }
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages || 1))}
            disabled={pageNumber >= (numPages || 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}

