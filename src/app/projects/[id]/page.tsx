import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import ImageCarousel from '@/app/components/ImageCarousel'
import { notFound } from 'next/navigation'
import ProjectContent from './ProjectContent'

interface ProjectProps {
  params: {
    id: string
  }
}

async function getProject(id: string) {
  const query = groq`*[_type == "project" && _id == $id][0] {
    _id,
    title,
    type,
    year,
    author,
    description,
    "imageUrl": image.asset->url,
    "next": *[_type == "project" && ^.title < title] | order(title asc)[0] {
      _id,
      title
    },
    "prev": *[_type == "project" && ^.title > title] | order(title desc)[0] {
      _id,
      title
    }
  }`
  
  return client.fetch(query, { id })
}

export default async function ProjectPage({ params }: ProjectProps) {
  const searchParams = { id: params.id }
  const project = await getProject(searchParams.id)
  
  if (!project) {
    notFound()
  }

  return <ProjectContent project={project} />
} 