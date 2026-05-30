"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PromotionalBanner } from "@lib/data/store-content"

export default function PromotionalBannerCarousel({
  slides,
}: {
  slides: PromotionalBanner[]
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (!isPlaying || !slides.length) return
    const timer = setInterval(handleNext, 5000)
    return () => clearInterval(timer)
  }, [isPlaying, slides.length, handleNext])

  if (!slides.length) {
    return null
  }

  return (
    <section
      className="relative w-full mb-16 font-sans group/carousel"
      aria-roledescription="carousel"
      aria-label="Promotional banner carousel"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onFocus={() => setIsPlaying(false)}
      onBlur={() => setIsPlaying(true)}
    >
      <div className="relative aspect-[2.5/1] w-full overflow-hidden border border-outline-variant rounded-soft bg-surface-container-low shadow-sm">
        {slides.map((slide, idx) => {
          const isActive = idx === activeIndex

          return (
            <div
              key={slide.image}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${idx + 1} of ${slides.length}`}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <LocalizedClientLink
                href={slide.ctaLink}
                className="block w-full h-full cursor-pointer"
                aria-label={slide.accessibilityLabel}
              >
                <img
                  src={slide.image}
                  alt={slide.accessibilityLabel}
                  className="w-full h-full object-contain select-none"
                />
              </LocalizedClientLink>
            </div>
          )
        })}

        <button
          onClick={handlePrev}
          aria-label="Previous promotional slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-surface-container/80 backdrop-blur-md text-on-surface border border-outline-variant/50 hover:border-outline rounded-full shadow-md transition-all hover:scale-105 active:scale-95 opacity-0 group-hover/carousel:opacity-100 group-focus-within:opacity-100 duration-300 pointer-events-none group-hover/carousel:pointer-events-auto group-focus-within:pointer-events-auto hidden md:flex"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next promotional slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-surface-container/80 backdrop-blur-md text-on-surface border border-outline-variant/50 hover:border-outline rounded-full shadow-md transition-all hover:scale-105 active:scale-95 opacity-0 group-hover/carousel:opacity-100 group-focus-within:opacity-100 duration-300 pointer-events-none group-hover/carousel:pointer-events-auto group-focus-within:pointer-events-auto hidden md:flex"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-surface-container/80 backdrop-blur-md px-3 py-1.5 border border-outline-variant/50 rounded-full shadow-sm opacity-60 group-hover/carousel:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={
              isPlaying
                ? "Pause automatic slide rotation"
                : "Play automatic slide rotation"
            }
            className="text-on-surface-variant hover:text-on-surface p-0.5 rounded-full transition-colors focus:ring-1 focus:ring-primary"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
          </button>

          <div className="w-[1px] h-3 bg-surface-container-highest" />

          <div className="flex gap-1.5" role="tablist" aria-label="Slides">
            {slides.map((_, idx) => (
              <button
                key={idx}
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setActiveIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === activeIndex
                    ? "bg-primary w-4"
                    : "bg-surface-container-highest hover:bg-outline-variant"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
