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