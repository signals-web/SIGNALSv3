import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Initialize the Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false,
})

// Delete all books
async function deleteBooks() {
  try {
    // Query for all project documents that are books
    const query = '*[_type == "project" && type == "book"]'
    const books = await client.fetch(query)
    
    console.log(`Found ${books.length} books to delete`)
    
    // Delete each book
    for (const book of books) {
      await client.delete(book._id)
      console.log(`Deleted: ${book.title}`)
    }
    
    console.log('All books deleted successfully!')
  } catch (error) {
    console.error('Error deleting books:', error)
  }
}

deleteBooks() 