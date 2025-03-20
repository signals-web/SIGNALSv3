import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import Link from 'next/link'

interface Project {
  _id: string
  title: string
  type: string
}

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path fill="currentColor" d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.74 3.74 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324l.004-5.073l-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574M8.755 4.75l-.004 7.322a3.75 3.75 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25"/>
  </svg>
)

const FlagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path fill="currentColor" d="M2 1.75C2 .784 2.784 0 3.75 0h8.5C13.216 0 14 .784 14 1.75v12.5A1.75 1.75 0 0 1 12.25 16h-8.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25Z"/>
  </svg>
)

async function getProjects(): Promise<Project[]> {
  const query = groq`*[_type == "project"] | order(title asc) {
    _id,
    title,
    type
  }`
  
  return client.fetch(query)
}

export default async function Home() {
  const projects = await getProjects()
  
  return (
    <main className="min-h-screen bg-[#FF0050] text-white p-8">
      <nav className="flex justify-between items-center mb-20">
        <h1 className="text-4xl font-bold">SIGNALS</h1>
        <div className="space-x-4">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </div>
      </nav>
      
      <div className="text-2xl leading-relaxed">
        {projects.map((project: Project, index: number) => (
          <span key={project._id}>
            {index > 0 && <span>, </span>}
            {project.type === 'book' ? <BookIcon /> : <FlagIcon />}
            {' '}
            <Link href={`/projects/${project._id}`} className="hover:underline">
              {project.title}
            </Link>
          </span>
        ))}
        .
      </div>
    </main>
  )
}
