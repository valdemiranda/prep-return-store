import { Suspense } from "react"
import { ChevronRight } from "lucide-react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { listCategoriesWithAvailableProducts } from "@lib/data/categories"

export default async function CollectionTemplate({
  sortBy,
  collection,
  page,
  filterCategory,
  price,
  sale,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  filterCategory?: string
  price?: string
  sale?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const categories = await listCategoriesWithAvailableProducts({
    countryCode,
  }).catch(() => [])

  return (
    <div
      className="content-container py-8 font-sans"
      data-testid="collection-container"
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
        <span className="text-on-surface font-bold">{collection.title}</span>
      </nav>

      {/* Main Side-by-side Layout */}
      <div className="flex flex-col small:flex-row small:items-start gap-gutter">
        <RefinementList categories={categories} />
        <div className="w-full">
          <div className="mb-6 border-b border-surface-container-highest pb-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
              Selected collection
            </p>
            <h1 className="font-headline text-3xl font-extrabold uppercase tracking-tight text-on-surface">
              {collection.title}
            </h1>
          </div>
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={collection.products?.length}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              collectionId={collection.id}
              filterCategory={filterCategory}
              countryCode={countryCode}
              price={price}
              sale={sale}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
