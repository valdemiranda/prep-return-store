const orderFields = [
  "id",
  "display_id",
  "email",
  "created_at",
  "currency_code",
  "subtotal",
  "item_total",
  "shipping_total",
  "tax_total",
  "total",
  "customer.email",
  "items.*",
  "items.variant.*",
  "items.variant.product.*",
  "shipping_address.*",
  "fulfillments.*",
  "fulfillments.items.*",
  "fulfillments.labels.*",
];

export async function fetchOrder(query: any, id: string) {
  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: orderFields,
    filters: { id },
  });

  return order;
}

export async function fetchOrderByFulfillment(query: any, fulfillmentId: string) {
  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: orderFields,
    filters: { "fulfillments.id": fulfillmentId },
  });

  return order;
}

export async function fetchOrderByShipment(query: any, shipmentId: string) {
  try {
    const {
      data: [shipment],
    } = await query.graph({
      entity: "shipment",
      fields: ["id", "order_id", "fulfillment_id"],
      filters: { id: shipmentId },
    });

    if (shipment?.order_id) {
      return fetchOrder(query, shipment.order_id);
    }

    if (shipment?.fulfillment_id) {
      return fetchOrderByFulfillment(query, shipment.fulfillment_id);
    }
  } catch {
    return fetchOrderByFulfillment(query, shipmentId);
  }

  return fetchOrderByFulfillment(query, shipmentId);
}

export function findFulfillment(order: any, fulfillmentId: string) {
  return (order?.fulfillments || []).find(
    (fulfillment: any) => fulfillment.id === fulfillmentId
  );
}

export function hasNotificationsDisabled(data: any) {
  return data?.no_notification === true;
}
