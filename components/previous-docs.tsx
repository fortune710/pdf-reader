"use client"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface PreviousDocsProps {
    documents: Array<{ id: string, title: string, created_at: Date }>
}

export default function PreviousDocs({ documents }: PreviousDocsProps) {
    
    const router = useRouter();

    const moveToViewPage = (id: string) => () => router.push(`/view/${id}?current_page=1`)
    
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 mt-3 gap-3">
            {
                documents.map((doc) => (
                    <Card 
                        className="cursor-pointer" 
                        onClick={moveToViewPage(doc.id)} 
                        key={doc.id}
                    >
                        <CardContent className="pt-3">
                            <h2 className="text-base font-medium font-mono">{doc.title.slice(0, 25) + "..."}</h2>
                            <p className="text-sm">
                                {doc.created_at.toDateString()}
                            </p>
                        </CardContent>
                    </Card>
                ))
            }
        </section>
    )

}