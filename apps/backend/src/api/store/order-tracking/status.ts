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
  intransit: "Shipped",
  in_transit: "Shipped",
  partially_delivered: "Shipped",
  delivered: "Delivered",
};
const STATUS_RANK: Record<InternalOrderStatus, number> = {
  Placed: 0,
  Processing: 1,
  Shipped: 2,
  Delivered: 3,
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

function getNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function statusFromFulfillments(order: any): InternalOrderStatus | null {
  const fulfillments = order.fulfillments ?? [];

  if (fulfillments.some((fulfillment: any) => fulfillment.delivered_at)) {
    return "Delivered";
  }

  if (fulfillments.some((fulfillment: any) => fulfillment.shipped_at)) {
    return "Shipped";
  }

  return null;
}

function statusFromItemQuantities(order: any): InternalOrderStatus | null {
  const items = order.items ?? [];

  if (!items.length) {
    return null;
  }

  const totalQuantity = items.reduce(
    (total: number, item: any) =>
      total + getNumber(item.quantity ?? item.detail?.quantity),
    0,
  );
  const shippedQuantity = items.reduce(
    (total: number, item: any) =>
      total + getNumber(item.shipped_quantity ?? item.detail?.shipped_quantity),
    0,
  );
  const fulfilledQuantity = items.reduce(
    (total: number, item: any) =>
      total +
      getNumber(item.fulfilled_quantity ?? item.detail?.fulfilled_quantity),
    0,
  );

  if (totalQuantity > 0 && shippedQuantity >= totalQuantity) {
    return "Shipped";
  }

  if (fulfilledQuantity > 0 || shippedQuantity > 0) {
    return "Processing";
  }

  return null;
}

export function resolveInternalStatus(order: any): InternalOrderStatus {
  const statuses = [
    statusFromMetadata(order.metadata),
    normalizeStatus(order.fulfillment_status),
    statusFromFulfillments(order),
    statusFromItemQuantities(order),
  ].filter((status): status is InternalOrderStatus => !!status);

  if (statuses.length) {
    return statuses.reduce((latest, status) =>
      STATUS_RANK[status] > STATUS_RANK[latest] ? status : latest,
    );
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
