"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollUp, setCanScrollUp] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)
  const railRef = useRef<HTMLDivElement>(null)

  const checkScroll = () => {
    const r = railRef.current
    if (r) {
      setCanScrollUp(r.scrollTop > 1.5)
      setCanScrollDown(r.scrollTop + r.clientHeight < r.scrollHeight - 1.5)
    }
  }

  useEffect(() => {
    const r = railRef.current
    if (!r) return
    const cb = () => checkScroll()
    r.addEventListener("scroll", cb)
    window.addEventListener("resize", cb)
    const t = setTimeout(cb, 100)
    return () => {
      r.removeEventListener("scroll", cb)
      window.removeEventListener("resize", cb)
      clearTimeout(t)
    }
  }, [images])

  const scrollRail = (dir: "up" | "down") => {
    const r = railRef.current
    if (r) {
      const amt = r.clientHeight * 0.75
      r.scrollTo({ top: r.scrollTop + (dir === "up" ? -amt : amt), behavior: "smooth" })
    }
  }

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-surface-container-low border border-outline-variant flex items-center justify-center rounded-sm">
        <span className="text-sm text-on-surface-variant font-medium">No image</span>
      </div>
    )
  }

  const activeImage = images[activeIndex] || images[0]

  return (
    <div className="grid grid-cols-1 small:grid-cols-6 gap-4 w-full font-sans">
      {/* Thumbnail Rail Wrapper */}
      <div className="small:col-span-1 order-2 small:order-1 relative w-full small:h-full min-h-[80px] small:min-h-0">
        {/* Top Fade Gradient */}
        <div
          className={`hidden small:block absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-background to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
            canScrollUp ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Up Arrow Control */}
        {canScrollUp && (
          <button
            onClick={() => scrollRail("up")}
            className="hidden small:flex absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-white/90 hover:bg-white text-on-surface border border-outline-variant rounded-full p-1.5 shadow-md transition-all hover:scale-105 active:scale-95 items-center justify-center cursor-pointer"
            aria-label="Scroll thumbnail rail up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        )}

        {/* Scrollable Rail Container */}
        <div
          ref={railRef}
          onScroll={checkScroll}
          className="flex small:flex-col gap-2 overflow-x-auto small:overflow-y-auto no-scrollbar py-1 small:absolute small:inset-0 scroll-smooth snap-x small:snap-y snap-mandatory"
        >
          {images.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => setActiveIndex(index)}
              className={`border-2 rounded-[4px] overflow-hidden transition-all aspect-square w-16 h-16 small:w-full small:h-auto shrink-0 relative snap-start ${
                index === activeIndex ? "border-primary" : "border-transparent hover:border-outline-variant"
              }`}
            >
              {!!image.url && (
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>

        {/* Down Arrow Control */}
        {canScrollDown && (
          <button
            onClick={() => scrollRail("down")}
            className="hidden small:flex absolute bottom-2 left-1/2 -translate-x-1/2 z-20 bg-white/90 hover:bg-white text-on-surface border border-outline-variant rounded-full p-1.5 shadow-md transition-all hover:scale-105 active:scale-95 items-center justify-center cursor-pointer"
            aria-label="Scroll thumbnail rail down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}

        {/* Bottom Fade Gradient */}
        <div
          className={`hidden small:block absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
            canScrollDown ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Main Image */}
      <div className="small:col-span-5 order-1 small:order-2 bg-white rounded-sm overflow-hidden border border-outline-variant relative aspect-square small:aspect-[4/3]">
        {!!activeImage?.url && (
          <Image
            src={activeImage.url}
            alt="Main Product Image"
            fill
            priority
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 800px"
          />
        )}
      </div>
    </div>
  )
}
