"use server"

import { HttpTypes } from "@medusajs/types"
import { filterProductsBySale } from "@lib/util/product-filters"
import { shuffle } from "@lib/util/shuffle"

import { listProducts } from "./products"

const RECOMMENDATION_COUNT = 4
const FETCH_LIMIT = 50
const PRODUCT_FIELDS = "*variants.calculated_price,*variants.images,+metadata,+tags"

type RecommendationOptions = {
  countryCode: string
  categoryIds?: string[]
  excludeProductIds?: string[]
}

function appendUniqueProducts({
  target,
  products,
  excludedIds,
}: {
  target: HttpTypes.StoreProduct[]
  products: HttpTypes.StoreProduct[]
  excludedIds: Set<string>
}) {
  for (const product of products) {
    if (target.length >= RECOMMENDATION_COUNT) {
      return
    }

    if (!product.id || excludedIds.has(product.id)) {
      continue
    }

    target.push(product)
    excludedIds.add(product.id)
  }
}

async function fetchProducts({
  countryCode,
  queryParams,
}: {
  countryCode: string
  queryParams?: HttpTypes.StoreProductListParams
}) {
  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: {
      limit: FETCH_LIMIT,
      fields: PRODUCT_FIELDS,
      ...queryParams,
    },
  }).catch(() => ({
    response: { products: [] as HttpTypes.StoreProduct[], count: 0 },
    nextPage: null,
  }))

  return products
}

export async function listTrackingRecommendations({
  countryCode,
  categoryIds,
  excludeProductIds = [],
}: RecommendationOptions) {
  const recommendations: HttpTypes.StoreProduct[] = []
  const excludedIds = new Set(excludeProductIds)
  const uniqueCategoryIds = Array.from(new Set(categoryIds ?? []))

  if (uniqueCategoryIds.length) {
    appendUniqueProducts({
      target: recommendations,
      products: shuffle(
        await fetchProducts({
          countryCode,
          queryParams: { category_id: uniqueCategoryIds },
        }),
      ),
      excludedIds,
    })
  }

  const catalogProducts =
    recommendations.length < RECOMMENDATION_COUNT
      ? await fetchProducts({ countryCode })
      : []

  if (recommendations.length < RECOMMENDATION_COUNT) {
    appendUniqueProducts({
      target: recommendations,
      products: shuffle(filterProductsBySale(catalogProducts, "true")),
      excludedIds,
    })
  }

  if (recommendations.length < RECOMMENDATION_COUNT) {
    appendUniqueProducts({
      target: recommendations,
      products: shuffle(catalogProducts),
      excludedIds,
    })
  }

  return recommendations
}
