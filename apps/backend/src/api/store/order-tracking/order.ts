import { resolveInternalStatus } from "./status";
import { PublicOrderTracking, PublicTrackingItem } from "./types";

export const ORDER_FIELDS = [
  "id",
  "display_id",
  "email",
  "created_at",
  "status",
  "payment_status",
  "fulfillment_status",
  "metadata",
  "items.id",
  "items.title",
  "items.quantity",
  "items.fulfilled_quantity",
  "items.shipped_quantity",
  "items.detail.quantity",
  "items.detail.fulfilled_quantity",
  "items.detail.shipped_quantity",
  "items.product.id",
  "items.product.handle",
  "items.product.categories.id",
  "fulfillments.*",
];

const DELIVERY_METADATA_KEYS = [
  "veeqoDeliveredAt",
  "deliveredAt",
  "delivered_at",
];

export function getOrderFilters(orderId: string) {
  const normalized = orderId.replace(/^#/, "");
  const displayId = Number(normalized);

  if (Number.isInteger(displayId) && displayId > 0) {
    return { display_id: String(displayId) };
  }

  return { id: orderId };
}

export function getShipmentId(order: any) {
  const shipmentId = order.metadata?.veeqoShipmentId;
  return shipmentId ? String(shipmentId) : null;
}

function getDeliveryDateFromMetadata(metadata?: Record<string, unknown> | null) {
  if (!metadata) {
    return null;
  }

  for (const key of DELIVERY_METADATA_KEYS) {
    const deliveredAt = metadata[key];
    if (typeof deliveredAt === "string" && deliveredAt.trim()) {
      return deliveredAt;
    }
  }

  return null;
}

function getDeliveredAt(order: any) {
  const fulfillmentDeliveredAt = (order.fulfillments ?? []).find(
    (fulfillment: any) => fulfillment.delivered_at,
  )?.delivered_at;

  return fulfillmentDeliveredAt ?? getDeliveryDateFromMetadata(order.metadata);
}

function getNumber(...values: unknown[]) {
  for (const value of values) {
    const number = Number(value);

    if (Number.isFinite(number)) {
      return number;
    }
  }

  return 0;
}

function getItems(order: any): PublicTrackingItem[] {
  return (order.items ?? []).map((item: any) => {
    const categories = item.product?.categories ?? [];
    const categoryIds = categories
      .map((category: any) => category.id)
      .filter((id: unknown): id is string => typeof id === "string");

    return {
      id: item.id,
      title: item.title,
      quantity: getNumber(item.quantity, item.detail?.quantity),
      product_id: item.product?.id ?? null,
      product_handle: item.product?.handle ?? null,
      category_ids: categoryIds,
    };
  });
}

export function sanitizeOrder(order: any): PublicOrderTracking {
  const items = getItems(order);
  const categoryIds = new Set<string>(
    items.flatMap((item) => item.category_ids),
  );

  return {
    id: order.id,
    order_number: String(order.display_id),
    status: resolveInternalStatus(order),
    placed_at: order.created_at ?? null,
    delivered_at: getDeliveredAt(order) ?? null,
    items,
    recommended_category_ids: Array.from(categoryIds),
    shipment_id: getShipmentId(order),
    latest_tracking_event: null,
  };
}
