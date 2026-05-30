"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"

interface CategoryCarouselProps {
  children: React.ReactNode
}

export default function CategoryCarousel({ children }: CategoryCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      const container = containerRef.current
      if (!container) return

      const childrenArr = Array.from(container.children) as HTMLElement[]
      if (childrenArr.length <= 1) return

      const firstChild = childrenArr[0]
      const secondChild = childrenArr[1]
      const itemWidth = secondChild.offsetLeft - firstChild.offsetLeft

      const maxScroll = container.scrollWidth - container.clientWidth
      if (maxScroll <= 0 || itemWidth <= 0) return

      if (container.scrollLeft >= maxScroll - 5) {
        container.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        const nextScroll =
          Math.ceil(container.scrollLeft / itemWidth) * itemWidth + itemWidth
        container.scrollTo({
          left: Math.min(nextScroll, maxScroll),
          behavior: "smooth",
        })
      }
    }, 5500)

    return () => clearInterval(interval)
  }, [isPaused])

  const pause = () => setIsPaused(true)
  const resume = () => setIsPaused(false)

  const handlePrev = () => {
    pause()
    const container = containerRef.current
    if (!container) return

    const childrenArr = Array.from(container.children) as HTMLElement[]
    if (childrenArr.length <= 1) return

    const firstChild = childrenArr[0]
    const secondChild = childrenArr[1]
    const itemWidth = secondChild.offsetLeft - firstChild.offsetLeft

    const nextScroll =
      Math.floor(container.scrollLeft / itemWidth) * itemWidth - itemWidth
    container.scrollTo({
      left: Math.max(nextScroll, 0),
      behavior: "smooth",
    })
    setTimeout(resume, 2000)
  }

  const handleNext = () => {
    pause()
    const container = containerRef.current
    if (!container) return

    const childrenArr = Array.from(container.children) as HTMLElement[]
    if (childrenArr.length <= 1) return

    const firstChild = childrenArr[0]
    const secondChild = childrenArr[1]
    const itemWidth = secondChild.offsetLeft - firstChild.offsetLeft

    const maxScroll = container.scrollWidth - container.clientWidth
    const nextScroll =
      Math.ceil(container.scrollLeft / itemWidth) * itemWidth + itemWidth
    container.scrollTo({
      left: Math.min(nextScroll, maxScroll),
      behavior: "smooth",
    })
    setTimeout(resume, 2000)
  }

  return (
    <div className="flex-1 relative flex items-center min-w-0">
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-outline-variant shadow-sm flex items-center justify-center text-on-surface hover:bg-surface-container hover:text-primary transition-all duration-200"
        aria-label="Previous categories"
        type="button"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div
        ref={containerRef}
        className="flex-1 flex gap-4 overflow-x-auto px-1 pb-4 no-scrollbar snap-x snap-mandatory scroll-smooth"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocus={pause}
        onBlur={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
      >
        {children}
      </div>

      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-outline-variant shadow-sm flex items-center justify-center text-on-surface hover:bg-surface-container hover:text-primary transition-all duration-200"
        aria-label="Next categories"
        type="button"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
