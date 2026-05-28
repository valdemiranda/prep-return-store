"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { Filter, X } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import FilterSection from "./filter-section"
import PriceFilter from "./price-filter"

type RefinementListProps = {
  categories?: HttpTypes.StoreProductCategory[]
  minPrice?: number
  maxPrice?: number
  'data-testid'?: string
}

export default function RefinementList({
  categories = [],
  minPrice = 0,
  maxPrice = 1000,
  'data-testid': dataTestId,
}: RefinementListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const priceParam = searchParams.get("price")
  const saleParam = searchParams.get("sale") === "true"
  const categoryParam = searchParams.get("category")

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams)
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }
      return params.toString()
    },
    [searchParams]
  )

  const handlePriceRangeChange = (priceRange: string) => {
    const queryString = createQueryString({ price: priceRange, page: "1" })
    router.push(`${pathname}?${queryString}`)
  }

  const handleSaleChange = (checked: boolean) => {
    const queryString = createQueryString({ sale: checked ? "true" : null, page: "1" })
    router.push(`${pathname}?${queryString}`)
  }

  const handleCategoryChange = (id: string, checked: boolean) => {
    const queryString = createQueryString({ category: checked ? id : null, page: "1" })
    router.push(`${pathname}?${queryString}`)
  }

  const handleClearFilters = () => {
    const queryString = createQueryString({
      category: null,
      price: null,
      sale: null,
      page: "1",
    })
    router.push(`${pathname}?${queryString}`)
  }

  const categoryOptions = [...categories]
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
    .map((category) => ({
      label: category.name,
      value: category.id,
    }))

  return (
    <aside className="w-full small:w-64 small:flex-shrink-0 font-sans" data-testid={dataTestId}>
      {/* Mobile Toggle Header */}
      <div
        className="flex items-center justify-between p-4 border border-outline-variant bg-white small:hidden cursor-pointer mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-headline font-bold text-lg uppercase text-on-surface">Filters</span>
        {isOpen ? <X className="w-5 h-5 text-on-surface" /> : <Filter className="w-5 h-5 text-on-surface" />}
      </div>

      {/* Filter Body */}
      <div className={`${isOpen ? "block" : "hidden"} small:block space-y-6 bg-white border border-outline-variant p-5 rounded-sm`}>
        {categories.length > 0 && (
          <FilterSection
            maxHeight
            multiple={false}
            onChange={handleCategoryChange}
            options={categoryOptions}
            selected={categoryParam ? [categoryParam] : []}
            title="Category"
          />
        )}

        <div className="border-t border-surface-container-highest pt-4">
          <PriceFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            priceParam={priceParam}
            onChange={handlePriceRangeChange}
          />
        </div>

        <div className="border-t border-surface-container-highest pt-4">
          <FilterSection
            onChange={(_, checked) => handleSaleChange(checked)}
            options={[{ label: "Sale items only", value: "sale" }]}
            selected={saleParam ? ["sale"] : []}
            title="Deals"
          />
        </div>

        {/* Clear Filters Button */}
        {(priceParam || saleParam || categoryParam) && (
          <button
            onClick={handleClearFilters}
            className="w-full py-2.5 bg-secondary text-white font-bold rounded-[4px] hover:bg-opacity-90 transition-all active:scale-95 text-center text-xs uppercase tracking-wider font-sans"
          >
            Clear filters
          </button>
        )}
      </div>
    </aside>
  )
}
