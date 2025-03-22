'use client'

import Link from 'next/link'
import ImageCarousel from '@/app/components/ImageCarousel'

interface Project {
  _id: string
  title: string
  type: string
  year: string
  author: string
  description: string
  imageUrl: string
  images: string[]
  next: { _id: string; title: string }
  prev: { _id: string; title: string }
}

export default function ProjectContent({ project }: { project: Project }) {
  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extralight">{project.title}</h1>
            </div>
            <div className="text-xl font-extralight">{project.year}</div>
          </div>
          <div className="space-y-2 text-right">
            <div className="text-2xl font-extralight">
              {project.type}
            </div>
            <div className="text-2xl font-extralight">{project.type}</div>
          </div>
        </header>

        <ImageCarousel images={project.images || [project.imageUrl]} />

        <div className="flex justify-between items-center mt-8">
          <Link href="/projects" className="flex items-center gap-2 text-2xl font-extralight">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="rotate-180">
              <path fill="currentColor" d="M22 4.25a.75.75 0 0 0-1.5 0v15a.75.75 0 0 0 1.5 0zm-9.72 14.28a.75.75 0 1 1-1.06-1.06l4.97-4.97H1.75a.75.75 0 0 1 0-1.5h14.44l-4.97-4.97a.75.75 0 0 1 1.06-1.06l6.25 6.25a.75.75 0 0 1 0 1.06z"/>
            </svg>
            Back to Projects
          </Link>
          <div className="flex items-center gap-8">
            {project.prev && (
              <Link href={`/projects/${project.prev._id}`} className="rotate-180 text-2xl font-extralight">
                {project.prev.title}
              </Link>
            )}
            {project.next && (
              <Link href={`/projects/${project.next._id}`} className="text-2xl font-extralight flex items-center">
                {project.next.title}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="ml-2">
                  <path fill="currentColor" d="M22 4.25a.75.75 0 0 0-1.5 0v15a.75.75 0 0 0 1.5 0zm-9.72 14.28a.75.75 0 1 1-1.06-1.06l4.97-4.97H1.75a.75.75 0 0 1 0-1.5h14.44l-4.97-4.97a.75.75 0 0 1 1.06-1.06l6.25 6.25a.75.75 0 0 1 0 1.06z"/>
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 