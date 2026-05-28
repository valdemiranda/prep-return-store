"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  "data-testid"?: string
}

const sortOptions = [
  { value: "created_at", label: "Latest arrivals" },
  { value: "price_asc", label: "Lowest price" },
  { value: "price_desc", label: "Highest price" },
]

export default function SortProducts({ sortBy, "data-testid": dataTestId }: SortProductsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams)
    params.set("sortBy", e.target.value)
    params.set("page", "1") // reset to first page when sort changes
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-3 font-sans" data-testid={dataTestId}>
      <span className="text-sm text-on-surface-variant font-medium">Sort by:</span>
      <select
        value={sortBy}
        onChange={handleChange}
        className="bg-surface-container-low border border-outline-variant text-sm font-bold py-1 px-4 rounded-[4px] focus:ring-primary focus:border-primary text-on-surface cursor-pointer outline-none"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
