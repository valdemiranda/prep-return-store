"use server"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { getProductCondition } from "@modules/products/utils/product-metadata"
import { listProducts } from "./products"

export type SearchProductSuggestion = {
  id: string
  handle: string
  title: string
  thumbnail?: string | null
  price: string | null
  condition: string | null
}

export async function searchProducts({
  query,
  countryCode,
}: {
  query: string
  countryCode: string
}): Promise<SearchProductSuggestion[]> {
  const trimmedQuery = query.trim()

  if (trimmedQuery.length < 2) {
    return []
  }

  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: { q: trimmedQuery, limit: 5 },
  }).catch(() => ({ response: { products: [] as HttpTypes.StoreProduct[] } }))

  return products.map((product) => {
    const { cheapestPrice } = getProductPrice({ product })

    return {
      id: product.id,
      handle: product.handle,
      title: product.title,
      thumbnail: product.thumbnail,
      price: cheapestPrice?.calculated_price ?? null,
      condition: getProductCondition(product) ?? null,
    }
  })
}
