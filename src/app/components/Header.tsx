import Link from 'next/link'

export default function Header() {
  return (
    <header className="flex justify-between items-center mb-12">
      <Link href="/" className="text-2xl font-extralight">
        SIGNALS
      </Link>
      <nav className="flex gap-8">
        <Link href="/about" className="text-2xl font-extralight">
          About
        </Link>
        <Link href="/contact" className="text-2xl font-extralight">
          Contact
        </Link>
      </nav>
    </header>
  )
} 