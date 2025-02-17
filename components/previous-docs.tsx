"use client"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { deleteDocument } from "@/actions/document"

interface PreviousDocsProps {
    documents: Array<{ id: string, title: string, created_at: Date }>
}

export default function PreviousDocs({ documents }: PreviousDocsProps) {
    const router = useRouter()
    const { toast } = useToast()

    const moveToViewPage = (id: string) => () => router.push(`/view/${id}?current_page=1`)
    
    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation() // Prevent triggering the card click
        
        try {
            await deleteDocument(id)
            toast({
                title: "Success",
                description: "Document deleted successfully",
            })
            router.refresh() // Refresh the page to update the document list
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete document",
                variant: "destructive",
            })
        }
    }
    
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 mt-3 gap-3">
            {
                documents?.length === 0 ? <p>No documents have been uploaded before</p> :
                documents.map((doc) => (
                <Card 
                    className="cursor-pointer relative group" 
                    onClick={moveToViewPage(doc.id)} 
                    key={doc.id}
                >
                    <CardContent className="pt-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-base font-medium font-mono">
                                    {doc.title.slice(0, 25) + "..."}
                                </h2>
                                <p className="text-sm">
                                    {doc.created_at.toDateString()}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-12 h-12"
                                onClick={(e) => handleDelete(e, doc.id)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </section>
    )
}