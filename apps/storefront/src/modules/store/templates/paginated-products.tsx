import { listProductsWithSort } from "@lib/data/products-with-sort"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import SortProducts from "@modules/store/components/refinement-list/sort-products"

const DEFAULT_PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  q?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  query,
  filterCategory,
  countryCode,
  price,
  sale,
  newArrivals,
  limit = DEFAULT_PRODUCT_LIMIT,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  query?: string
  filterCategory?: string
  countryCode: string
  price?: string
  sale?: string
  newArrivals?: string
  limit?: number
}) {
  const queryParams: PaginatedProductsParams = {
    limit,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  const activeCategoryId = filterCategory || categoryId

  if (activeCategoryId) {
    queryParams["category_id"] = [activeCategoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (newArrivals === "true" || sortBy === "created_at") {
    queryParams["order"] = "-created_at"
  }

  if (query) {
    queryParams["q"] = query
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
    price,
    sale,
    newArrivals,
  })

  const totalPages = Math.ceil(count / limit)
  const sort = sortBy || "created_at"

  return (
    <div className="space-y-6 font-sans">
      {/* Dynamic Results Count & Sort Dropdown */}
      <div className="flex flex-col xsmall:flex-row xsmall:items-center justify-between bg-white p-4 border border-outline-variant rounded-sm">
        <p className="text-sm font-bold mb-2 xsmall:mb-0 text-on-surface">
          <span className="text-primary">{count}</span> results found
        </p>
        <SortProducts sortBy={sort} />
      </div>

      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 xlarge:grid-cols-5 2xlarge:grid-cols-6 gap-x-3 gap-y-6 xsmall:gap-x-6 xsmall:gap-y-8"
        data-testid="products-list"
      >
        {products.map((p) => (
          <li key={p.id}>
            <ProductPreview product={p} region={region} />
          </li>
        ))}
      </ul>

      {products.length === 0 && (
        <div className="border border-outline-variant bg-white p-8 text-center rounded-sm">
          <p className="font-bold uppercase text-on-surface">
            No deals found
          </p>
          <p className="mt-2 text-sm text-on-surface-variant">
            Adjust your search or filters to see other available lots.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </div>
  )
}
