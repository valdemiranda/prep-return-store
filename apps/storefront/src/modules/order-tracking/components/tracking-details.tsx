import { OrderTracking } from "@lib/data/order-tracking"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { MapPin, Calendar, Clipboard, Package2 } from "lucide-react"

function getQuantity(value: number) {
  return Number.isFinite(value) ? value : 0
}

export default function TrackingDetails({
  tracking,
}: {
  tracking: OrderTracking
}) {
  const event = tracking.latest_tracking_event
  const totalItems = tracking.items.reduce(
    (acc, curr) => acc + getQuantity(curr.quantity),
    0,
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <div className="bg-white border border-outline-variant p-6 rounded-sm shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase text-on-surface mb-4 tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Latest Tracking Event
          </h3>

          {event ? (
            <div className="flex flex-col gap-3">
              <div className="bg-surface-container-low p-3 rounded-[4px] border border-outline-variant/50">
                <p className="font-bold text-sm text-on-surface">
                  {event.description}
                </p>
                {event.detail && (
                  <p className="text-xs text-on-surface-variant mt-1">
                    {event.detail}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 text-xs text-on-surface-variant/80">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 shrink-0 text-secondary" />
                  <span>
                    {new Date(event.timestamp).toLocaleString("en-US", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-secondary" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant/70 italic">
              No detailed tracking information is available yet.
            </p>
          )}
        </div>

        <div className="border-t border-surface-container-highest mt-6 pt-4 text-[11px] text-on-surface-variant/70 flex flex-col gap-1">
          <p>
            <span className="font-bold">Order Number:</span>{" "}
            {tracking.order_number}
          </p>
          {tracking.shipment_id && (
            <p>
              <span className="font-bold">Shipment ID:</span>{" "}
              {tracking.shipment_id}
            </p>
          )}
          {tracking.placed_at && (
            <p>
              <span className="font-bold">Placed on:</span>{" "}
              {new Date(tracking.placed_at).toLocaleDateString("en-US")}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white border border-outline-variant p-6 rounded-sm shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase text-on-surface mb-4 tracking-wider flex items-center gap-2">
            <Clipboard className="w-4 h-4 text-primary" />
            Order Items
          </h3>

          <div className="max-h-60 overflow-y-auto pr-1 flex flex-col gap-3">
            {tracking.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between border-b border-surface-container-highest pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-col gap-0.5">
                  {item.product_handle ? (
                    <LocalizedClientLink
                      href={`/products/${item.product_handle}`}
                      className="text-xs font-bold text-secondary hover:text-primary transition-colors hover:underline"
                    >
                      {item.title}
                    </LocalizedClientLink>
                  ) : (
                    <span className="text-xs font-bold text-on-surface">
                      {item.title}
                    </span>
                  )}
                  <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                    <Package2 className="w-3 h-3 text-on-surface-variant/40" />
                    Qty: {getQuantity(item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-surface-container-highest mt-6 pt-4 text-[11px] text-on-surface-variant/70 flex items-center justify-between">
          <span>Total Items</span>
          <span className="font-bold text-on-surface text-xs">
            {totalItems}
          </span>
        </div>
      </div>
    </div>
  )
}
