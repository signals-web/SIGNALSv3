export function AllIcon({ size = 16 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" className="inline-block">
      <path fill="currentColor" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-6.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 0 0 0-13"/>
    </svg>
  )
}

interface IconProps {
  className?: string
  size?: number
}

export function BookIcon({ className, size = 24 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      className={className}
      fill="none" 
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

export function SignageIcon({ className, size = 24 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      className={className}
      fill="none" 
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 15h16M4 8h16" />
      <path d="M9 4v16M15 4v16" />
    </svg>
  )
}

export function ArrowLeft({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className} style={{ transform: 'rotate(180deg)' }}>
      <path fill="currentColor" d="M11.22 5.22a.75.75 0 0 1 1.06 0l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.749.749 0 1 1-1.06-1.06l4.969-4.97H1.75a.75.75 0 0 1 0-1.5h14.439L11.22 6.28a.75.75 0 0 1 0-1.06m10.03-1.47a.75.75 0 0 1 .75.75v15a.75.75 0 0 1-1.5 0v-15a.75.75 0 0 1 .75-.75"/>
    </svg>
  )
}

export function ArrowRight({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}>
      <path fill="currentColor" d="M11.22 5.22a.75.75 0 0 1 1.06 0l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.749.749 0 1 1-1.06-1.06l4.969-4.97H1.75a.75.75 0 0 1 0-1.5h14.439L11.22 6.28a.75.75 0 0 1 0-1.06m10.03-1.47a.75.75 0 0 1 .75.75v15a.75.75 0 0 1-1.5 0v-15a.75.75 0 0 1 .75-.75"/>
    </svg>
  )
} 