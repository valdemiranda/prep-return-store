import { InternalOrderStatus } from "./types";

const METADATA_STATUS_KEYS = [
  "internalStatus",
  "internal_status",
  "orderStatus",
  "order_status",
  "trackingStatus",
  "tracking_status",
  "status",
];

const STATUS_BY_VALUE: Record<string, InternalOrderStatus> = {
  placed: "Placed",
  pending: "Placed",
  processing: "Processing",
  shipped: "Shipped",
  fulfilled: "Shipped",
  intransit: "In transit",
  in_transit: "In transit",
  partially_delivered: "In transit",
  delivered: "Delivered",
};

function normalizeStatus(value: unknown): InternalOrderStatus | null {
  if (typeof value !== "string") {
    return null;
  }

  const key = value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  return STATUS_BY_VALUE[key] ?? STATUS_BY_VALUE[key.replace(/_/g, "")] ?? null;
}

function statusFromMetadata(metadata?: Record<string, unknown> | null) {
  if (!metadata) {
    return null;
  }

  for (const key of METADATA_STATUS_KEYS) {
    const status = normalizeStatus(metadata[key]);
    if (status) {
      return status;
    }
  }

  return null;
}

export function resolveInternalStatus(order: any): InternalOrderStatus {
  const metadataStatus = statusFromMetadata(order.metadata);
  if (metadataStatus) {
    return metadataStatus;
  }

  const fulfillmentStatus = normalizeStatus(order.fulfillment_status);
  if (fulfillmentStatus) {
    return fulfillmentStatus;
  }

  if (
    ["captured", "authorized", "partially_refunded"].includes(
      order.payment_status,
    )
  ) {
    return "Processing";
  }

  return "Placed";
}
