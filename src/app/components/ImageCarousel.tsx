'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from '@/app/icons'

interface ImageCarouselProps {
  images: string[]
  description?: string
}

const colors = ['#da1f2c', '#eb4b5f', '#ee253d', '#2c2d43', '#8e9aae', '#eef2f4']

export default function ImageCarousel({ images, description }: ImageCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cursorType, setCursorType] = useState<'default' | 'left' | 'right'>('default')
  const [showDescription, setShowDescription] = useState(true)
  const [colorSequence, setColorSequence] = useState<string[]>(() => {
    // Start with da1f2c, then shuffle remaining colors
    const remainingColors = colors.filter(c => c !== '#da1f2c')
    const shuffled = [...remainingColors]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return ['#da1f2c', ...shuffled]
  })

  // Function to get next color ensuring no repeats
  const getNextColor = (currentColor: string) => {
    const currentIndex = colorSequence.indexOf(currentColor)
    const nextIndex = (currentIndex + 1) % colorSequence.length
    
    // If we're at the end, reshuffle the sequence except for the first color
    if (nextIndex === 0) {
      const remainingColors = colors.filter(c => c !== '#da1f2c')
      const shuffled = [...remainingColors]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      setColorSequence(['#da1f2c', ...shuffled])
      return shuffled[0]
    }
    
    return colorSequence[nextIndex]
  }

  // Update cursor type based on mouse position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    
    const { left, width } = containerRef.current.getBoundingClientRect()
    const x = e.clientX - left
    
    if (x < width * 0.4) {
      setCursorType('left')
    } else if (x > width * 0.6) {
      setCursorType('right')
    } else {
      setCursorType('default')
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const container = containerRef.current
    const { left, width } = container.getBoundingClientRect()
    const clickX = e.clientX - left
    const isRightHalf = clickX > width / 2

    const scrollAmount = width
    const newScrollLeft = isRightHalf 
      ? container.scrollLeft + scrollAmount 
      : container.scrollLeft - scrollAmount

    // Update current index
    const newIndex = isRightHalf 
      ? Math.min(currentIndex + 1, images.length - 1)
      : Math.max(currentIndex - 1, 0)
    setCurrentIndex(newIndex)

    // Smooth scroll with easing
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    })

    // Update arrow visibility
    const maxScroll = container.scrollWidth - container.clientWidth
    setShowLeftArrow(newScrollLeft > 0)
    setShowRightArrow(newScrollLeft < maxScroll)

    // Update background color
    const parentContainer = document.querySelector('.min-h-screen')
    if (parentContainer) {
      const computedStyle = getComputedStyle(parentContainer)
      const currentColor = computedStyle.backgroundColor
      const nextColor = getNextColor(currentColor || colors[0])
      parentContainer.setAttribute('style', `
        background-color: ${nextColor};
        transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      `)
    }
  }

  // Custom cursor styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .cursor-chevron-left {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath fill='%232c2d43' d='M15.28 5.22a.75.75 0 0 1 0 1.06L9.56 12l5.72 5.72a.749.749 0 0 1-.326 1.275a.75.75 0 0 1-.734-.215l-6.25-6.25a.75.75 0 0 1 0-1.06l6.25-6.25a.75.75 0 0 1 1.06 0'/%3E%3C/svg%3E") 24 24, pointer;
      }
      .cursor-chevron-right {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath fill='%232c2d43' d='M8.72 18.78a.75.75 0 0 1 0-1.06L14.44 12L8.72 6.28a.75.75 0 0 1 .018-1.042a.75.75 0 0 1 1.042-.018l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0'/%3E%3C/svg%3E") 24 24, pointer;
      }
    `
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  // Initialize background color and transition
  useEffect(() => {
    const container = document.querySelector('.min-h-screen')
    if (!container) return
    
    container.setAttribute('style', `
      background-color: ${colors[0]};
      transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    `)
    
    return () => {
      container.removeAttribute('style')
    }
  }, [])

  return (
    <div className="relative -mx-8 mb-8">
      <div 
        ref={containerRef}
        className={`flex overflow-x-auto snap-x snap-mandatory scrollbar-hide transition-all duration-800 ease-in-out
          ${cursorType === 'left' ? 'cursor-chevron-left' : 
            cursorType === 'right' ? 'cursor-chevron-right' : 
            'cursor-default'}`}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setCursorType('default')}
        style={{ scrollBehavior: 'smooth' }}
      >
        {images.map((img, i) => (
          <div key={i} className="flex-none w-full snap-center">
            <div className="aspect-[16/9] relative bg-white">
              <Image
                src={img}
                alt={`Project image ${i + 1}`}
                fill
                className="object-contain"
                priority={i === 0}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      {showLeftArrow && (
        <button 
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full transition-opacity duration-300"
          onClick={(e) => {
            e.stopPropagation()
            handleClick({ clientX: 0 } as React.MouseEvent<HTMLDivElement>)
          }}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}
      {showRightArrow && (
        <button 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full transition-opacity duration-300"
          onClick={(e) => {
            e.stopPropagation()
            handleClick({ clientX: containerRef.current?.getBoundingClientRect().width || 0 } as React.MouseEvent<HTMLDivElement>)
          }}
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      )}

      {/* Description Panel */}
      {description && showDescription && (
        <div className="absolute bottom-4 left-4 bg-black/80 text-white p-4 rounded max-w-md">
          <button 
            onClick={() => setShowDescription(false)}
            className="absolute top-2 right-2 text-white/80 hover:text-white"
          >
            ×
          </button>
          <p className="text-sm">{description}</p>
        </div>
      )}
    </div>
  )
} 