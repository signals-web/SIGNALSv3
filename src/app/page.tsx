import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import Link from 'next/link'
import { DM_Sans } from 'next/font/google'

const dmSans = DM_Sans({ subsets: ['latin'] })

interface Project {
  _id: string
  title: string
  type: string
}

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="inline-block">
    <path fill="currentColor" d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-8.05A2.25 2.25 0 0 0 4.75 2H2v9h3.258a3.75 3.75 0 0 1 1.993.574ZM8.75 2.001v8.05c.149-.03.302-.046.459-.046H12V2H9.008a2.25 2.25 0 0 0-.258 0Z"/>
  </svg>
)

const SignageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="inline-block">
    <path fill="currentColor" d="M7.75 0a.75.75 0 0 1 .75.75V3h3.634c.414 0 .814.147 1.13.414l2.07 1.75a1.75 1.75 0 0 1 0 2.672l-2.07 1.75a1.75 1.75 0 0 1-1.13.414H8.5v5.25a.75.75 0 0 1-1.5 0V10H2.75A1.75 1.75 0 0 1 1 8.25v-3.5C1 3.784 1.784 3 2.75 3H7V.75A.75.75 0 0 1 7.75 0m4.384 8.5a.25.25 0 0 0 .161-.06l2.07-1.75a.248.248 0 0 0 0-.38l-2.07-1.75a.25.25 0 0 0-.161-.06H2.75a.25.25 0 0 0-.25.25v3.5c0 .138.112.25.25.25z"/>
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
    <main className={`min-h-screen bg-[#FF0050] text-white ${dmSans.className}`} style={{ fontWeight: 200 }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-20">
          <h1 className="text-5xl">SIGNALS</h1>
          <nav>
            <Link href="/about" className="mr-4">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>
        
        <div className="text-2xl leading-relaxed">
          {projects.map((project, index) => (
            <span key={project._id}>
              {index > 0 && <span className="mx-2">,</span>}
              {project.type === 'book' ? <BookIcon /> : <SignageIcon />}
              {' '}
              <Link href={`/projects/${project._id}`} className="hover:underline">
                {project.title}
              </Link>
            </span>
          ))}
          <span>.</span>
        </div>
      </div>
    </main>
  )
}
