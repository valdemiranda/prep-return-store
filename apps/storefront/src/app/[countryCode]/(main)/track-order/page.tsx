import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import {
  OrderTracking,
  retrieveOrderTracking,
  listTrackingRecommendations,
} from "@lib/data/order-tracking"
import { HttpTypes } from "@medusajs/types"
import TrackingForm from "@modules/order-tracking/components/tracking-form"
import StatusSteps from "@modules/order-tracking/components/status-steps"
import TrackingDetails from "@modules/order-tracking/components/tracking-details"
import TrackingRecommendations from "@modules/order-tracking/components/tracking-recommendations"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { AlertCircle, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Order Tracking | One Stop Liquidation",
  description: "Track your order and view the latest delivery status.",
}

type TrackOrderProps = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ orderid?: string; email?: string }>
}

export default async function TrackOrderPage(props: TrackOrderProps) {
  const { countryCode } = await props.params
  const { orderid, email } = await props.searchParams

  let tracking: OrderTracking | null = null
  let errorMsg: string | null = null
  let recommendations: HttpTypes.StoreProduct[] = []
  let region: HttpTypes.StoreRegion | null = null

  if (orderid && email) {
    try {
      tracking = await retrieveOrderTracking(orderid, email)
      if (!tracking) {
        errorMsg = "Order not found. Please check the details and try again."
      } else {
        const categoryIds = tracking.items.flatMap((item) => item.category_ids)
        const excludeProductIds = tracking.items
          .map((item) => item.product_id)
          .filter((id): id is string => !!id)

        region = (await getRegion(countryCode).catch(() => null)) ?? null

        if (region) {
          recommendations = await listTrackingRecommendations({
            countryCode,
            categoryIds,
            excludeProductIds,
          })
        }
      }
    } catch {
      errorMsg =
        "We could not retrieve this order. Please check the details or try again later."
    }
  }

  if (!tracking || errorMsg) {
    return (
      <div className="content-container py-12 flex flex-col items-center min-h-[60vh] gap-8">
        <div className="w-full flex flex-col items-center gap-6">
          {errorMsg && (
            <div className="w-full max-w-md bg-primary/10 border border-primary text-primary p-4 rounded-sm flex items-center gap-3 text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          <TrackingForm defaultOrderId={orderid} defaultEmail={email} />
        </div>
      </div>
    )
  }

  const hasRecommendations = recommendations.length > 0

  return (
    <div className="content-container py-12 flex flex-col items-center min-h-[60vh] gap-8">
      <div className="w-full flex flex-col gap-8 max-w-5xl">
        {region && hasRecommendations && (
          <TrackingRecommendations products={recommendations} region={region} />
        )}

        <section
          className={
            hasRecommendations
              ? "border-t border-surface-container-highest pt-8"
              : undefined
          }
        >
          <div className="flex items-center justify-between border-b border-surface-container-highest pb-4 mb-8">
            <div>
              <h1 className="font-headline text-2xl font-extrabold uppercase text-on-surface">
                Track Order
              </h1>
              <p className="text-xs text-on-surface-variant mt-1">
                Order number:{" "}
                <span className="font-mono text-primary font-bold">
                  {tracking.order_number}
                </span>
              </p>
            </div>
            <LocalizedClientLink
              href="/track-order"
              className="text-xs font-bold text-secondary hover:text-primary transition-colors flex items-center gap-2 border border-outline-variant hover:bg-surface-container-low px-3 py-2 rounded-sm uppercase tracking-wide"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Track Another
            </LocalizedClientLink>
          </div>

          <div className="flex flex-col gap-8">
            <StatusSteps status={tracking.status} />
            <TrackingDetails tracking={tracking} />
          </div>
        </section>
      </div>
    </div>
  )
}
