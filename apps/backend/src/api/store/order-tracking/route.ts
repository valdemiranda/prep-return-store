import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { z } from "zod";

import { resolveInternalStatus } from "./status";
import { PublicOrderTracking, PublicTrackingItem } from "./types";
import { retrieveLatestVeeqoEvent } from "./veeqo";

const querySchema = z.object({
  orderid: z.string().trim().min(1),
  email: z.string().trim().email(),
});

const ORDER_FIELDS = [
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

function getOrderFilters(orderId: string) {
  const normalized = orderId.replace(/^#/, "");
  const displayId = Number(normalized);

  if (Number.isInteger(displayId) && displayId > 0) {
    return { display_id: String(displayId) };
  }

  return { id: orderId };
}

function getShipmentId(order: any) {
  const shipmentId = order.metadata?.veeqoShipmentId;
  return shipmentId ? String(shipmentId) : null;
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

function sanitizeOrder(order: any): PublicOrderTracking {
  const items = getItems(order);
  const categoryIds = new Set<string>(
    items.flatMap((item) => item.category_ids),
  );

  return {
    id: order.id,
    order_number: String(order.display_id),
    status: resolveInternalStatus(order),
    placed_at: order.created_at ?? null,
    items,
    recommended_category_ids: Array.from(categoryIds),
    shipment_id: getShipmentId(order),
    latest_tracking_event: null,
  };
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const parsed = querySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({ message: "Order number and email are required." });
    return;
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: "order",
    fields: ORDER_FIELDS,
    filters: getOrderFilters(parsed.data.orderid),
  });

  const email = parsed.data.email.toLowerCase();
  const order = data.find((entry: any) => entry.email?.toLowerCase() === email);

  if (!order) {
    res.status(404).json({ message: "Order not found." });
    return;
  }

  const tracking = sanitizeOrder(order);

  if (tracking.status === "In transit" && tracking.shipment_id) {
    tracking.latest_tracking_event = await retrieveLatestVeeqoEvent(
      tracking.shipment_id,
    ).catch(() => null);
  }

  res.json({ order_tracking: tracking });
}
