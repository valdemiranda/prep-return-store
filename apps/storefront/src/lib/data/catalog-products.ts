"use server"

import { sdk } from "@lib/config"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import { getCacheOptions } from "./cookies"
import { type ProductListQueryParams } from "./products"
import { getRegion } from "./regions"

export type CatalogProductsResult = {
  product_ids: string[]
  count: number
  offset: number
  limit: number
  price_bounds: { min: number; max: number } | null
}

type ListCatalogProductsInput = {
  page?: number
  queryParams?: ProductListQueryParams
  sortBy?: SortOptions
  countryCode: string
  price?: string
  sale?: string
  newArrivals?: string
  includeStats?: boolean
}

const getQueryValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
  }

  return value || undefined
}

export const listCatalogProducts = async ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
  price,
  sale,
  newArrivals,
  includeStats,
}: ListCatalogProductsInput): Promise<CatalogProductsResult> => {
  const region = await getRegion(countryCode)
  const limit = queryParams?.limit || 12
  const pageNumber = Math.max(page, 1)
  const offset = (pageNumber - 1) * limit
  const next = {
    ...(await getCacheOptions("products", { global: true })),
  }

  if (!region) {
    return {
      product_ids: [],
      count: 0,
      offset,
      limit,
      price_bounds: null,
    }
  }

  const { catalog_products } = await sdk.client.fetch<{
    catalog_products: CatalogProductsResult
  }>("/store/catalog-products", {
    method: "GET",
    query: {
      limit,
      offset,
      sortBy,
      q: getQueryValue(queryParams?.q),
      category_id: getQueryValue(queryParams?.category_id),
      collection_id: getQueryValue(queryParams?.collection_id),
      price,
      sale,
      new_arrivals: newArrivals,
      region_id: region.id,
      include_stats: includeStats ? "true" : undefined,
    },
    next,
    cache: "force-cache",
  })

  return catalog_products
}
