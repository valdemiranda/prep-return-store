import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ShipmentCreatedEmail } from "../email-templates/shipment-created";
import {
  getCustomerEmail,
  getOrderNumber,
  getTracking,
  toEmailItems,
} from "../email-templates/formatters";
import {
  fetchOrderByShipment,
  findFulfillment,
  hasNotificationsDisabled,
} from "./email-data";
import { sendEmail } from "./send-email";

type ShipmentEvent = {
  id: string;
  no_notification?: boolean;
};

export default async function shipmentCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<ShipmentEvent>) {
  if (hasNotificationsDisabled(data)) {
    return;
  }

  const query = container.resolve("query");
  const order = await fetchOrderByShipment(query, data.id);
  const fulfillment = findFulfillment(order, data.id) || order?.fulfillments?.[0];
  const tracking = getTracking(fulfillment);

  await sendEmail({
    container,
    to: getCustomerEmail(order),
    subject: `Order #OSL-${getOrderNumber(order)} has shipped`,
    template: (
      <ShipmentCreatedEmail
        orderId={getOrderNumber(order)}
        items={toEmailItems(order)}
        carrier={tracking.carrier}
        trackingNumber={tracking.trackingNumber}
        trackingUrl={tracking.trackingUrl}
      />
    ),
  });
}

export const config: SubscriberConfig = {
  event: "shipment.created",
};
