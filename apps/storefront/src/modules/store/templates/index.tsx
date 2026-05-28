import { Suspense } from "react"
import { ChevronRight } from "lucide-react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listCategoriesWithAvailableProducts } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { filterProductsBySale } from "@lib/util/product-filters"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  query,
  filterCategory,
  price,
  sale,
  newArrivals,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  query?: string
  filterCategory?: string
  price?: string
  sale?: string
  newArrivals?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const categories = await listCategoriesWithAvailableProducts({
    countryCode,
  }).catch(() => [])

  // Calculate actual min/max price for the active product set (excluding price filter itself)
  const queryParams: any = {
    limit: 100,
  }
  if (filterCategory) {
    queryParams["category_id"] = [filterCategory]
  }
  if (query) {
    queryParams["q"] = query
  }

  const baseResult = await listProducts({
    pageParam: 1,
    queryParams,
    countryCode,
  }).catch(() => null)

  const baseProducts = baseResult?.response?.products || []
  const filteredBaseProducts = filterProductsBySale(baseProducts, sale)

  const priceNumbers = filteredBaseProducts
    .map(
      (p) =>
        getProductPrice({ product: p }).cheapestPrice?.calculated_price_number,
    )
    .filter((p): p is number => p !== undefined)

  const minPrice =
    priceNumbers.length > 0 ? Math.floor(Math.min(...priceNumbers)) : 0
  const maxPrice =
    priceNumbers.length > 0 ? Math.ceil(Math.max(...priceNumbers)) : 1000

  const pageTitle = query
    ? `Results for "${query}"`
    : newArrivals === "true"
      ? "New Arrivals"
      : sale === "false"
        ? "Shop Deals"
        : "All deals"

  return (
    <div
      className="content-container py-8 font-sans"
      data-testid="store-container"
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
        <LocalizedClientLink
          href="/"
          className="hover:text-primary transition-colors"
        >
          Home
        </LocalizedClientLink>
        <ChevronRight className="w-4 h-4" />
        <span className="text-on-surface font-bold">{pageTitle}</span>
      </nav>

      {/* Main Side-by-side Layout */}
      <div className="flex flex-col small:flex-row small:items-start gap-gutter">
        <RefinementList
          categories={categories}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
        <div className="w-full">
          <div className="mb-6 border-b border-surface-container-highest pb-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
              Liquidation inventory
            </p>
            <h1
              className="font-headline text-3xl font-extrabold uppercase tracking-tight text-on-surface"
              data-testid="store-page-title"
            >
              {pageTitle}
            </h1>
          </div>
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              query={query}
              filterCategory={filterCategory}
              countryCode={countryCode}
              price={price}
              sale={sale}
              newArrivals={newArrivals}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
