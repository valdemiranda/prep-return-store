"use client"

import React, { useRef, useEffect, useState } from "react"

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

  return (
    <div
      ref={containerRef}
      className="flex-1 flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory scroll-smooth"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      {children}
    </div>
  )
}
