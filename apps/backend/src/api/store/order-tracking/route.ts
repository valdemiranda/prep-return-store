import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { z } from "zod";

import { markOrderDeliveredFromVeeqoEvent } from "./delivery";
import { ORDER_FIELDS, getOrderFilters, sanitizeOrder } from "./order";
import { retrieveLatestVeeqoEvent } from "./veeqo";

const querySchema = z.object({
  orderid: z.string().trim().min(1),
  email: z.string().trim().email(),
});

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

  let tracking = sanitizeOrder(order);

  if (tracking.status === "Shipped" && tracking.shipment_id) {
    tracking.latest_tracking_event = await retrieveLatestVeeqoEvent(
      tracking.shipment_id,
    ).catch(() => null);

    if (
      await markOrderDeliveredFromVeeqoEvent(
        req.scope,
        order,
        tracking.latest_tracking_event,
      )
    ) {
      tracking.status = "Delivered";
      tracking.delivered_at =
        tracking.latest_tracking_event?.timestamp ?? new Date().toISOString();
      tracking.latest_tracking_event = null;
    }
  }

  res.json({ order_tracking: tracking });
}
