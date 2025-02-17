import { db } from "@/lib/db"

export async function getAllDocuments() {
    try {
        const documents = await db.document.findMany({
            orderBy: {
                created_at: 'desc'
            },
            select: {
                id: true,
                title: true,
                created_at: true
            }
        })
        
        return documents
    } catch (error) {
        console.error('Error fetching documents:', error)
        throw new Error('Failed to fetch documents')
    }
}

export async function getDocumentById(id: string) {
    try {
        const document = await db.document.findUnique({
            where: {
                id
            }
        })
        
        if (!document) {
            throw new Error('Document not found')
        }
        
        return document
    } catch (error) {
        console.error('Error fetching document:', error)
        throw new Error('Failed to fetch document')
    }
} 