"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

import { listProducts } from "./products"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export type InternalOrderStatus =
  | "Placed"
  | "Processing"
  | "Shipped"
  | "In transit"
  | "Delivered"

export type OrderTrackingEvent = {
  timestamp: string
  description: string
  detail: string | null
  location: string | null
  status: string
}

export type OrderTrackingItem = {
  id: string
  title: string
  quantity: number
  product_id: string | null
  product_handle: string | null
  category_ids: string[]
}

export type OrderTracking = {
  id: string
  order_number: string
  status: InternalOrderStatus
  placed_at: string | null
  items: OrderTrackingItem[]
  recommended_category_ids: string[]
  shipment_id: string | null
  latest_tracking_event: OrderTrackingEvent | null
}

export async function retrieveOrderTracking(orderid: string, email: string) {
  const params = new URLSearchParams({ orderid, email })
  const response = await fetch(
    `${MEDUSA_BACKEND_URL}/store/order-tracking?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  )

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Order tracking request failed: ${response.status}`)
  }

  const data = (await response.json()) as { order_tracking: OrderTracking }
  return data.order_tracking
}

export async function listTrackingRecommendations({
  countryCode,
  categoryIds,
  excludeProductIds = [],
}: {
  countryCode: string
  categoryIds?: string[]
  excludeProductIds?: string[]
}) {
  const queryParams: HttpTypes.StoreProductListParams = {
    limit: 8,
    fields: "*variants.calculated_price,*variants.images,+metadata,+tags",
  }

  if (categoryIds?.length) {
    queryParams.category_id = categoryIds
  }

  const {
    response: { products },
  } = await listProducts({ countryCode, queryParams }).catch(() => ({
    response: { products: [] as HttpTypes.StoreProduct[], count: 0 },
    nextPage: null,
  }))

  const filtered = products.filter(
    (product) => !excludeProductIds.includes(product.id),
  )

  if (filtered.length || !categoryIds?.length) {
    return filtered
  }

  const fallback = await listProducts({
    countryCode,
    queryParams: { ...queryParams, category_id: undefined },
  }).catch(() => ({
    response: { products: [] as HttpTypes.StoreProduct[], count: 0 },
    nextPage: null,
  }))

  return fallback.response.products.filter(
    (product) => !excludeProductIds.includes(product.id),
  )
}
