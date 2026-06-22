import { CatalogParams } from "./params"

export function getProductFilters(
  params: CatalogParams,
  productIds?: string[]
) {
  const filters: Record<string, any> = { status: "published" }

  if (productIds) {
    filters.id = productIds
  }

  if (params.q) {
    filters.q = params.q
  }

  if (params.categoryIds.length) {
    filters.categories = {
      id: params.categoryIds,
      is_internal: false,
      is_active: true,
    }
  }

  if (params.collectionIds.length) {
    filters.collection_id = params.collectionIds
  }

  return filters
}
