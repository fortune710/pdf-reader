"use client"

import { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Dot, Pause, Play } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs"
import { mergeTextItems } from "@/utils/functions";
import { Skeleton } from "@/components/ui/skeleton";
import useTTS from "@/hooks/use-tts";
import PDFViewerLoading from "@/components/pdf-viewer-loading";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import LoadingSpinner from "./loading-spinner";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();


export default function PDFViewer({ fileUrl }: { fileUrl: string }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  //Stored page number as query param to ensure user stays on page even after page refresh
  const [pageNumber, setPageNumber] = useQueryState("current_page", parseAsInteger.withDefault(1))

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


  //If there is an error rendering PDF, display it
  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  //If PDF is still loading URL
  if (!fileUrl) {
    return <PDFViewerLoading/>
  }

  return (
    <div className="flex flex-col items-center">
      <Document 
        renderMode="none" 
        className="w-full"  
        file={fileUrl} 
        loading={<PDFViewerLoading/>}
        onLoadSuccess={onDocumentLoadSuccess} 
        onLoadError={onDocumentLoadError}
      >
        {/* Added container div to ensure PDF has max height and is scrollable */}
        <div className="h-[500px] overflow-y-auto border border-input rounded-sm w-4/5 mx-auto">
          <Page 
            className="w-full" 
            renderAnnotationLayer={false} 
            renderTextLayer 
            height={350}
            width={500}
            scale={1}
            onGetTextSuccess={(content) => compilePageText(content.items as Array<{ str: string }>)} 
            pageNumber={pageNumber} 
          />
        </div>
      </Document>


      <section className="flex items-center justify-center mt-4 space-x-4 bg-white w-4/5 px-3 py-2.5 border-input border rounded-md">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={handleAudioPlayback} 
            disabled={isLoading}
            size="icon" 
            className="rounded-full w-12 h-12"
          >
            {
              isLoading ? <LoadingSpinner/> :
              isPlaying ? <Pause className="size-4" /> :
              <Play className="size-4"/>
            }
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {
            isPlaying ? <p>Pause</p> :
            <p>Play</p>
          }
        </TooltipContent>
      </Tooltip>

        <div className="flex items-center gap-4 px-2 py-1.5 bg-zinc-900 rounded-3xl text-white">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon"
                variant="ghost"
                className="rounded-full"
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))} disabled={pageNumber <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Previous</p>
            </TooltipContent>
          </Tooltip>
          {
            !numPages ? <Skeleton className="h-4 w-[80px]" /> :
            <p className="text-sm">
              Page {pageNumber} of {numPages}
            </p>
          }

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full"
                onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages || 1))}
                disabled={pageNumber >= (numPages || 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>

            <TooltipContent>
              <p>Next</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </section>
    </div>
  )
}

