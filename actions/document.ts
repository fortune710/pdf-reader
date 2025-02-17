'use server'

//I prefer to separate my server actions from other database calls
import { db } from "@/lib/db"

export async function createDocument(title: string, key: string) {
    try {
        const document = await db.document.create({
            data: {
                title,
                key,
            }
        })
        
        return {
            id: document.id,

            //Incase I need to return otehr properties in the fture
        }
    } catch (error) {
        console.error('Error creating document:', error)
        throw new Error('Failed to create document')
    }
}

export async function deleteDocument(id: string) {
    try {
        await db.document.delete({
            where: {
                id
            }
        })
        
        return { success: true }
    } catch (error) {
        console.error('Error deleting document:', error)
        throw new Error('Failed to delete document')
    }
}