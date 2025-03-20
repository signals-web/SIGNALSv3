import { createClient } from '@sanity/client'
import fs from 'fs'
import jsdom from 'jsdom'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const { JSDOM } = jsdom

// Initialize the Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false,
})

// Function to clean HTML and convert to plain text
function cleanHtml(html) {
  if (!html) return ''
  
  // Create a new JSDOM instance
  const dom = new JSDOM(html)
  const document = dom.window.document
  
  // Replace <br> and </p> tags with newlines
  const brs = document.querySelectorAll('br')
  brs.forEach(br => br.replaceWith('\n'))
  
  const paragraphs = document.querySelectorAll('p')
  paragraphs.forEach(p => {
    p.insertAdjacentText('afterend', '\n\n')
  })
  
  // Replace list items with bullet points
  const listItems = document.querySelectorAll('li')
  listItems.forEach(li => {
    li.insertAdjacentText('beforebegin', '• ')
    li.insertAdjacentText('afterend', '\n')
  })
  
  // Get the text content
  let text = document.body.textContent || ''
  
  // Convert common HTML entities
  text = text.replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
  
  // Clean up extra whitespace
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')
  
  return text
}

// Function to parse authors string into array of objects
function parseAuthors(authorString) {
  if (!authorString) return []
  return authorString.split(',').map(author => ({
    name: author.trim(),
    role: 'Author'
  }))
}

// Function to parse awards string into array
function parseAwards(awardsString) {
  if (!awardsString) return []
  return awardsString.split(',').map(award => award.trim())
}

// Function to parse CSV line considering quotes
function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  let lastChar = ''
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Double quotes inside quotes
        current += '"'
        i++
      } else if (inQuotes && (line[i + 1] === ',' || i === line.length - 1)) {
        // End of quoted field
        inQuotes = false
        if (i === line.length - 1) {
          result.push(current.trim())
        }
      } else if (!inQuotes && (lastChar === ',' || lastChar === '')) {
        // Start of quoted field
        inQuotes = true
      } else {
        // Quote within field
        current += char
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
    
    lastChar = char
  }
  
  if (current) {
    result.push(current.trim())
  }
  
  return result
}

// Function to parse date string
function parseDate(dateStr) {
  if (!dateStr) return undefined
  
  // Try parsing as a year
  if (/^\d{4}$/.test(dateStr)) {
    return new Date(parseInt(dateStr), 0, 1).toISOString()
  }
  
  // Try parsing as a full date
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? undefined : date.toISOString()
}

// Function to validate record
function isValidRecord(record, seenTitles) {
  // Basic validation
  if (!record.Title || 
      record.Title.startsWith('<') || 
      record.Title.startsWith('•') ||
      record.Title.length === 0) {
    return false
  }
  
  // Check for HTML content
  if (record.Title.includes('<p class=') ||
      record.Title.includes('<br>') ||
      record.Title.includes('<ul') ||
      record.Title.includes('<li')) {
    return false
  }

  // Check for description-like content
  if (record.Title.length > 50 ||  // Most book titles are under 50 chars
      record.Title.includes('is organized') ||
      record.Title.includes('illustrated') ||
      record.Title.toLowerCase().startsWith('the book') ||
      record.Title.includes('principles can be') ||
      /^[a-z]/.test(record.Title) || // Book titles should start with capital letters
      record.Title.endsWith('.')) {  // Book titles don't typically end with periods
    return false
  }
  
  // Check for duplicates
  if (seenTitles.has(record.Title)) {
    return false
  }
  
  // Valid record
  seenTitles.add(record.Title)
  return true
}

// Main import function
async function importBooks() {
  const csvFile = fs.readFileSync('data/books.csv', 'utf-8')
  const lines = csvFile.split('\n')
  
  // Get headers
  const headers = parseCSVLine(lines[0])
  
  // Track seen titles to prevent duplicates
  const seenTitles = new Set()
  
  // Process each line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    try {
      const values = parseCSVLine(line)
      const record = {}
      
      // Create record object
      headers.forEach((header, index) => {
        record[header] = values[index] || ''
      })
      
      // Skip invalid records
      if (!isValidRecord(record, seenTitles)) {
        continue
      }

      // Create a short description from the first paragraph of the description
      const cleanDescription = cleanHtml(record.Description)
      const shortDescription = cleanDescription.split('\n\n')[0]?.slice(0, 200)

      const document = {
        _type: 'project',
        title: record.Title,
        subtitle: record.Subtitle,
        type: 'book',
        kind: record.Kind.toLowerCase().replace(/[^\w-]/g, '-'),
        authors: parseAuthors(record.Author),
        publishDate: parseDate(record.Date),
        description: [{
          _type: 'block',
          style: 'normal',
          children: [{
            _type: 'span',
            text: cleanDescription
          }]
        }],
        shortDescription: shortDescription,
        designElements: record['Design Elements'] ? [{
          _type: 'block',
          style: 'normal',
          children: [{
            _type: 'span',
            text: cleanHtml(record['Design Elements'])
          }]
        }] : [],
        awards: parseAwards(record.Awards),
        slug: {
          _type: 'slug',
          current: record.Title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
        }
      }

      await client.create(document)
      console.log(`Imported: ${record.Title}`)
    } catch (error) {
      console.error(`Error importing line ${i + 1}:`, error)
    }
  }
  
  console.log('Import completed!')
}

importBooks() 