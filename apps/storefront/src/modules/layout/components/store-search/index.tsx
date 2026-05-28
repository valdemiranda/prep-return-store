"use client"

import { Search, Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { FormEvent, useState, useEffect, useRef } from "react"
import {
  searchProducts,
  SearchProductSuggestion,
} from "@lib/data/search"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const StoreSearch = () => {
  const router = useRouter()
  const params = useParams<{ countryCode?: string }>()
  const countryCode = params?.countryCode || "us"
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchProductSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const containerRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  useEffect(() => {
    if (query.trim().length <= 1) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const delayDebounce = setTimeout(async () => {
      try {
        const products = await searchProducts({ query, countryCode })
        setSuggestions(products)
      } catch (err) {
        console.error(err)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [query, countryCode])

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = query.trim()
    const prefix = `/${countryCode}`
    setIsOpen(false)
    router.push(
      value ? `${prefix}/store?q=${encodeURIComponent(value)}` : `${prefix}/store`
    )
  }

  return (
    <form ref={containerRef} className="relative w-full max-w-md md:max-w-lg" onSubmit={submitSearch}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
        <input
          className="h-10 w-full rounded-full border-none bg-surface-container py-2 pl-9 pr-10 text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary"
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search deals..."
          type="search"
          value={query}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-primary" />
        )}
      </div>

      {isOpen && query.trim().length > 1 && (
        <div className="absolute left-0 right-0 mt-2 z-50 bg-white border border-outline-variant rounded-sm shadow-lg max-h-[380px] overflow-y-auto divide-y divide-surface-container-highest">
          {isLoading && suggestions.length === 0 ? (
            <div className="p-4 text-center text-xs text-on-surface-variant">
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((product) => (
                <LocalizedClientLink
                  key={product.id}
                  href={`/products/${product.handle}`}
                  onClick={() => {
                    setQuery("")
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-surface-container transition-colors"
                >
                  <div className="w-10 h-10 shrink-0 bg-surface-container-low rounded-sm overflow-hidden flex items-center justify-center">
                    {product.thumbnail && (
                      <img
                        alt={product.title ?? ""}
                        className="max-h-full max-w-full object-contain"
                        src={product.thumbnail}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-on-surface truncate">
                      {product.title}
                    </p>
                    {product.price && (
                      <p className="text-[10px] text-primary font-price font-extrabold mt-0.5">
                        {product.price}
                      </p>
                    )}
                  </div>
                </LocalizedClientLink>
              ))}
              <button
                type="submit"
                className="w-full p-2.5 text-center text-xs font-bold text-secondary bg-surface-container-low hover:bg-surface-container transition-colors uppercase tracking-wider block"
              >
                View all results for "{query}"
              </button>
            </>
          ) : (
            <div className="p-4 text-center text-xs text-on-surface-variant">
              No results found
            </div>
          )}
        </div>
      )}
    </form>
  )
}
export default StoreSearch
