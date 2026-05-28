import { notFound } from "next/navigation"
import { Suspense } from "react"
import { ChevronRight } from "lucide-react"
import { listCategoriesWithAvailableProducts } from "@lib/data/categories"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  filterCategory,
  price,
  sale,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
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

  const activeIds = new Set(categories.map((c) => c.id))
  const filteredChildren =
    category.category_children?.filter((c) => activeIds.has(c.id)) || []

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (cat: HttpTypes.StoreProductCategory) => {
    if (cat.parent_category) {
      parents.push(cat.parent_category)
      getParents(cat.parent_category)
    }
  }

  getParents(category)
  parents.reverse() // show top-level first

  return (
    <div
      className="content-container py-8 font-sans"
      data-testid="category-container"
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
        {parents.map((parent) => (
          <span key={parent.id} className="flex items-center gap-2">
            <LocalizedClientLink
              href={`/categories/${parent.handle}`}
              className="hover:text-primary transition-colors"
            >
              {parent.name}
            </LocalizedClientLink>
            <ChevronRight className="w-4 h-4" />
          </span>
        ))}
        <span className="text-on-surface font-bold">{category.name}</span>
      </nav>

      {/* Main Side-by-side Layout */}
      <div className="flex flex-col small:flex-row small:items-start gap-gutter">
        <RefinementList categories={categories} />
        <div className="w-full">
          <div className="mb-6 flex flex-col gap-2 border-b border-surface-container-highest pb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Department
            </p>
            <h1
              className="font-headline text-3xl font-extrabold uppercase tracking-tight text-on-surface"
              data-testid="category-page-title"
            >
              {category.name}
            </h1>
          </div>
          {category.description && (
            <div className="mb-6 max-w-3xl text-sm text-on-surface-variant leading-relaxed">
              <p>{category.description}</p>
            </div>
          )}
          {filteredChildren && filteredChildren.length > 0 && (
            <div className="mb-6">
              <ul className="grid grid-cols-1 gap-3 xsmall:grid-cols-2 medium:grid-cols-3">
                {filteredChildren.map((c) => (
                  <li
                    className="border border-outline-variant bg-white p-4 transition-colors hover:border-primary rounded-sm"
                    key={c.id}
                  >
                    <InteractiveLink href={`/categories/${c.handle}`}>
                      {c.name}
                    </InteractiveLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={category.products?.length ?? 8}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={filterCategory || category.id}
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
