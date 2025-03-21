import { DM_Sans } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['200', '400']
})

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`min-h-screen bg-[#ee253d] text-white ${dmSans.className}`} style={{ fontWeight: 200 }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <Link href="/">
            <Image 
              src="/signals-header.png" 
              alt="SIGNALS"
              width={375}
              height={75}
              priority
            />
          </Link>
          <nav className="text-4xl">
            <Link href="/about" className="mr-8">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>
        {children}
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
    </div>
  )
} 