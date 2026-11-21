"use server"

import { sdk } from "@lib/config"
import {
  hasAvailableStock,
  withProductAvailabilityFields,
} from "@lib/util/product-availability"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

export type ProductListQueryParams = HttpTypes.FindParams &
  HttpTypes.StoreProductListParams

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
  includeUnavailable = false,
  cache = "force-cache",
}: {
  pageParam?: number
  queryParams?: ProductListQueryParams
  countryCode?: string
  regionId?: string
  includeUnavailable?: boolean
  // "no-store" para consultas cuja combinação de parâmetros muda a cada request
  // (ex.: IDs sorteados): cacheá-las só acumularia entradas que não se repetem.
  cache?: "force-cache" | "no-store"
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: ProductListQueryParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next =
    cache === "no-store"
      ? undefined
      : { ...(await getCacheOptions("products", { global: true })) }

  const fields = includeUnavailable
    ? (queryParams?.fields ??
      "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,")
    : withProductAvailabilityFields(
        queryParams?.fields ??
          "*variants.calculated_price,*variants.images,+metadata,+tags,",
      )

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          ...queryParams,
          fields,
        },
        headers,
        next,
        cache,
      },
    )
    .then(({ products, count }) => {
      const visibleProducts = includeUnavailable
        ? products
        : products.filter(hasAvailableStock)
      const visibleCount = includeUnavailable ? count : visibleProducts.length
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products: visibleProducts,
          count: visibleCount,
        },
        nextPage,
        queryParams,
      }
    })
}
