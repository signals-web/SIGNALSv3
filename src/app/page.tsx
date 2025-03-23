'use client'

import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import Link from 'next/link'
import { DM_Sans } from 'next/font/google'
import Image from 'next/image'
import { useState } from 'react'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
})

function urlFor(source: any) {
  return builder.image(source).auto('format')
}

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['200', '400']
})

interface Project {
  _id: string
  title: string
  type: string
  isBook: boolean
  isSignage: boolean
  mainImage?: {
    asset: {
      _ref: string
    }
  }
  galleryImages: Array<{
    image: {
      asset: {
        _ref: string
        url: string
      }
    }
    caption: string
    altText: string
  }>
}

type FilterType = 'all' | 'book' | 'signage'

// Create a new client component for the interactive parts
function ProjectList({ projects: initialProjects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredProjects = initialProjects.filter(project => {
    if (filter === 'all') return true
    if (filter === 'book') return project.isBook
    if (filter === 'signage') return project.isSignage
    return true
  })

  return (
    <>
      <div className="flex gap-8 mb-12 relative z-10">
        <button 
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'opacity-100' : 'opacity-50 hover:opacity-75'}
        >
          <AllIcon size={48} />
        </button>
        <button 
          onClick={() => setFilter('book')}
          className={filter === 'book' ? 'opacity-100' : 'opacity-50 hover:opacity-75'}
        >
          <BookIcon size={48} />
        </button>
        <button 
          onClick={() => setFilter('signage')}
          className={filter === 'signage' ? 'opacity-100' : 'opacity-50 hover:opacity-75'}
        >
          <SignageIcon size={48} />
        </button>
      </div>
      
      <div className="text-4xl transition-all duration-700 ease-in-out relative" style={{ lineHeight: 2 }}>
        {filteredProjects?.map((project, index) => (
          <span key={project._id} className="inline opacity-0 animate-fade-in transition-opacity duration-700 ease-in-out">
            {index > 0 && <span className="mx-2">,</span>}
            <Link href={`/projects/${project._id}`} className="group relative inline-block">
              {project.mainImage?.asset && (
                <div className="absolute w-[87.5%] aspect-[4/3] left-1/2 -translate-x-1/2 -bottom-4 rounded-sm overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Image
                    src={urlFor(project.mainImage)
                      .width(800)
                      .height(600)
                      .quality(90)
                      .url()}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-[#da1f2c] mix-blend-multiply" />
                </div>
              )}
              <span className="relative z-[1]">
                {project.isBook ? <BookIcon size={32} /> : project.isSignage ? <SignageIcon size={32} /> : null}
                {' '}
                {project.title}
              </span>
            </Link>
          </span>
        ))}
        <span>.</span>
      </div>
    </>
  )
}

// Create the server component (default export)
export default async function Home() {
  const query = groq`*[_type == "project"] | order(title asc) {
    _id,
    title,
    type,
    "isBook": type == "book",
    "isSignage": type in ["wayfinding", "exhibition-design", "wayfinding---donor-signage"],
    mainImage {
      asset-> {
        _ref,
        _id
      }
    }
  }`
  
  const projects = await client.fetch(query)
  
  return (
    <main className={`min-h-screen bg-[#ee253d] text-white ${dmSans.className}`} style={{ fontWeight: 200 }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <Image 
            src="/signals-header.png" 
            alt="SIGNALS"
            width={375}
            height={75}
            priority
          />
          <nav className="text-4xl">
            <Link href="/about" className="mr-8">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>

        <ProjectList projects={projects} />

        <footer className="fixed bottom-0 left-0 right-0 bg-[#2c2d43] w-full">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-8 text-xl pb-8">
              <div className="bg-black/50 aspect-[6/1] rounded-sm flex items-center justify-center">
                Location
              </div>
              <div className="bg-black/50 aspect-[6/1] rounded-sm flex items-center justify-center">
                Socials
              </div>
              <div className="bg-black/50 aspect-[6/1] rounded-sm flex items-center justify-center">
                Graphics
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

function AllIcon({ size = 16 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" className="inline-block">
      <path fill="currentColor" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-6.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 0 0 0-13"/>
    </svg>
  )
}

function BookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" className="inline-block">
      <path fill="currentColor" d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.74 3.74 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324l.004-5.073l-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574M8.755 4.75l-.004 7.322a3.75 3.75 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25"/>
    </svg>
  )
}

function SignageIcon({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" className="inline-block">
      <path fill="currentColor" d="M7.75 0a.75.75 0 0 1 .75.75V3h3.634c.414 0 .814.147 1.13.414l2.07 1.75a1.75 1.75 0 0 1 0 2.672l-2.07 1.75a1.75 1.75 0 0 1-1.13.414H8.5v5.25a.75.75 0 0 1-1.5 0V10H2.75A1.75 1.75 0 0 1 1 8.25v-3.5C1 3.784 1.784 3 2.75 3H7V.75A.75.75 0 0 1 7.75 0m4.384 8.5a.25.25 0 0 0 .161-.06l2.07-1.75a.248.248 0 0 0 0-.38l-2.07-1.75a.25.25 0 0 0-.161-.06H2.75a.25.25 0 0 0-.25.25v3.5c0 .138.112.25.25.25z"/>
    </svg>
  )
}
