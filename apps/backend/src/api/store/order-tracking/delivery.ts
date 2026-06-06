import { IOrderModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

import { VeeqoTrackingEvent } from "./types";

function isDeliveredEvent(event: VeeqoTrackingEvent | null) {
  return event?.status?.trim().toLowerCase() === "delivered";
}

export async function markOrderDeliveredFromVeeqoEvent(
  reqScope: any,
  order: any,
  event: VeeqoTrackingEvent | null,
) {
  if (!isDeliveredEvent(event)) {
    return false;
  }

  const deliveredAt = event?.timestamp ?? new Date().toISOString();
  const metadata = {
    ...(order.metadata ?? {}),
    internalStatus: "Delivered",
    trackingStatus: "Delivered",
    veeqoDeliveredAt: deliveredAt,
  };

  const orderModuleService: IOrderModuleService = reqScope.resolve(
    Modules.ORDER,
  );

  await orderModuleService.updateOrders(order.id, { metadata });

  return true;
}
