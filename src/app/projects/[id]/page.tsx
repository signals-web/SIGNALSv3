import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import ProjectContent from './ProjectContent'
import { notFound } from 'next/navigation'

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
    "imageUrl": mainImage.asset->url,
    "images": gallery[].asset->url,
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
  const project = await getProject(params.id)
  
  if (!project) {
    notFound()
  }

  return <ProjectContent project={project} />
} 