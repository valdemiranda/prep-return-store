"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"

type CarouselClientProps = {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}

export default function RandomProductsCarouselClient({
  products,
  region,
}: CarouselClientProps) {
  const [randomProductsRow1, setRandomProductsRow1] = useState<HttpTypes.StoreProduct[]>([])
  const [randomProductsRow2, setRandomProductsRow2] = useState<HttpTypes.StoreProduct[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const scrollRef1 = useRef<HTMLDivElement>(null)
  const scrollRef2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Shuffle products array using Fisher-Yates and select distinct sets
    const shuffled = [...products]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    const maxProducts = shuffled.slice(0, 40)
    if (maxProducts.length >= 2) {
      const mid = Math.ceil(maxProducts.length / 2)
      setRandomProductsRow1(maxProducts.slice(0, mid))
      setRandomProductsRow2(maxProducts.slice(mid))
    } else {
      setRandomProductsRow1(maxProducts)
      setRandomProductsRow2([])
    }
  }, [products])

  const scrollRows = useCallback((direction: "left" | "right") => {
    const scroll = (ref: React.RefObject<HTMLDivElement | null>) => {
      if (ref.current) {
        const { scrollLeft, clientWidth, scrollWidth } = ref.current
        const amount = clientWidth * 0.8
        const maxScroll = scrollWidth - clientWidth
        if (maxScroll <= 0) return

        let newScrollLeft = direction === "right" ? scrollLeft + amount : scrollLeft - amount

        if (direction === "right" && scrollLeft >= maxScroll - 5) {
          newScrollLeft = 0
        } else if (direction === "left" && scrollLeft <= 5) {
          newScrollLeft = maxScroll
        }

        ref.current.scrollTo({
          left: newScrollLeft,
          behavior: "smooth",
        })
      }
    }
    scroll(scrollRef1)
    scroll(scrollRef2)
  }, [])

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      scrollRows("right")
    }, 4000)
    return () => clearInterval(interval)
  }, [isPaused, scrollRows])

  if (randomProductsRow1.length === 0) return null

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="py-12 border-t border-surface-container-highest bg-surface-container-low/30 font-sans"
    >
      <div className="content-container max-w-container-max mx-auto px-margin-mobile md:px-gutter">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="font-headline text-2xl sm:text-headline-lg uppercase text-on-surface leading-tight">Recommended for You</h2>
            <p className="text-on-surface-variant font-body-md text-sm sm:text-body-md mt-1">
              Handpicked liquidated stock selected at random
            </p>
          </div>
          <div className="flex gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => scrollRows("left")}
              className="p-2 border border-outline rounded-full hover:bg-surface-container transition-colors text-on-surface active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollRows("right")}
              className="p-2 border border-outline rounded-full hover:bg-surface-container transition-colors text-on-surface active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div
            ref={scrollRef1}
            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {randomProductsRow1.map((product) => (
              <div
                key={product.id}
                className="w-[210px] sm:w-[250px] md:w-[280px] shrink-0 snap-start"
              >
                <ProductPreview product={product} region={region} />
              </div>
            ))}
          </div>

          {randomProductsRow2.length > 0 && (
            <div
              ref={scrollRef2}
              className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-2"
              style={{ scrollbarWidth: "none" }}
            >
              {randomProductsRow2.map((product) => (
                <div
                  key={product.id}
                  className="w-[210px] sm:w-[250px] md:w-[280px] shrink-0 snap-start"
                >
                  <ProductPreview product={product} region={region} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
