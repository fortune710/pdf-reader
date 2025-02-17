import { Skeleton } from "@/components/ui/skeleton";

export default function PDFViewerLoading() {
    return (
        <div className="border border-input w-4/5 h-[500px]">
            <Skeleton className="w-4/5 h-[500px] rounded-sm mx-auto" />
        </div>
    )
}