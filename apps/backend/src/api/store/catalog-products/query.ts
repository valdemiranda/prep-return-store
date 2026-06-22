import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, QueryContext } from "@medusajs/framework/utils"

import { getProductFilters } from "./filters"
import { CatalogParams } from "./params"
import {
  getPriceBounds,
  matchesPrice,
  matchesSale,
  ProductSummary,
  sortSummaries,
  summarizeProduct,
} from "./pricing"
import { listSalesChannelProductIds } from "./sales-channels"

const INDEX_BATCH_SIZE = 500
const NEW_ARRIVALS_LIMIT = 50

const INDEX_FIELDS = ["id", "created_at", "variants.calculated_price.*"]

type CatalogResult = {
  product_ids: string[]
  count: number
  offset: number
  limit: number
  price_bounds: { min: number; max: number } | null
}

async function getPricingContext(query: any, regionId?: string) {
  if (!regionId) {
    return
  }

  const { data } = await query.graph(
    {
      entity: "region",
      fields: ["id", "currency_code"],
      filters: { id: regionId },
      pagination: { take: 1, skip: 0 },
    },
    { cache: { enable: true } }
  )

  const region = data[0]
  return region
    ? { region_id: region.id, currency_code: region.currency_code }
    : undefined
}

async function listDirect(query: any, filters: any, params: CatalogParams) {
  const { data, metadata } = await query.graph(
    {
      entity: "product",
      fields: ["id"],
      filters,
      pagination: {
        take: params.limit,
        skip: params.offset,
        order: { created_at: "DESC" },
      },
    },
    { cache: { enable: true } }
  )

  return {
    product_ids: data.map((product: any) => product.id),
    count: metadata?.count ?? data.length,
    offset: metadata?.skip ?? params.offset,
    limit: metadata?.take ?? params.limit,
    price_bounds: null,
  }
}

async function listIndexed(query: any, filters: any, params: CatalogParams) {
  const pricingContext = await getPricingContext(query, params.regionId)
  const context = pricingContext
    ? { variants: { calculated_price: QueryContext(pricingContext) } }
    : undefined
  const summaries: ProductSummary[] = []
  const maxScan = params.newArrivals ? NEW_ARRIVALS_LIMIT : Infinity
  let skip = 0
  let count = 0

  do {
    const take = Math.min(INDEX_BATCH_SIZE, maxScan - summaries.length)
    const { data, metadata } = await query.graph(
      {
        entity: "product",
        fields: INDEX_FIELDS,
        filters,
        pagination: { take, skip, order: { created_at: "DESC" } },
        context,
      },
      { cache: { enable: true } }
    )

    count = metadata?.count ?? 0
    summaries.push(...data.map(summarizeProduct))
    skip += take
  } while (skip < count && summaries.length < maxScan)

  const saleMatched = summaries.filter((product) =>
    matchesSale(product, params.sale)
  )
  const priceMatched = saleMatched.filter((product) =>
    matchesPrice(product, params.price)
  )
  const sorted = sortSummaries(priceMatched, params.sortBy)

  return {
    product_ids: sorted
      .slice(params.offset, params.offset + params.limit)
      .map((product) => product.id),
    count: sorted.length,
    offset: params.offset,
    limit: params.limit,
    price_bounds: getPriceBounds(saleMatched),
  }
}

export async function listCatalogProducts(
  container: MedusaContainer,
  params: CatalogParams,
  salesChannelIds: string[]
): Promise<CatalogResult> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const productIds = await listSalesChannelProductIds(query, salesChannelIds)
  const filters = getProductFilters(params, productIds)
  const needsIndex =
    params.includeStats ||
    params.newArrivals ||
    !!params.price ||
    !!params.sale ||
    params.sortBy !== "created_at"

  return needsIndex
    ? listIndexed(query, filters, params)
    : listDirect(query, filters, params)
}
