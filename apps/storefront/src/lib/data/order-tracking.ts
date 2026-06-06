"use server"

import { listTrackingRecommendations as retrieveTrackingRecommendations } from "./tracking-recommendations"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export type InternalOrderStatus =
  | "Placed"
  | "Processing"
  | "Shipped"
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
  delivered_at: string | null
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
      headers: MEDUSA_PUBLISHABLE_KEY
        ? { "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY }
        : {},
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

export async function listTrackingRecommendations(
  options: Parameters<typeof retrieveTrackingRecommendations>[0],
) {
  return retrieveTrackingRecommendations(options)
}
