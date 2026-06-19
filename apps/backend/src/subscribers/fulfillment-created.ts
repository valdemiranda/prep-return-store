import { createElement } from "react";
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { FulfillmentCreatedEmail } from "../email-templates/fulfillment-created";
import {
  getCustomerEmail,
  getOrderNumber,
  getStoreUrl,
  getTracking,
  toEmailItems,
} from "../email-templates/formatters";
import {
  fetchOrder,
  findFulfillment,
  hasNotificationsDisabled,
} from "./email-data";
import { sendEmail } from "./send-email";

type FulfillmentEvent = {
  order_id: string;
  fulfillment_id: string;
  no_notification?: boolean;
};

export default async function fulfillmentCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<FulfillmentEvent>) {
  if (hasNotificationsDisabled(data)) {
    return;
  }

  const query = container.resolve("query");
  const order = await fetchOrder(query, data.order_id);
  const fulfillment = findFulfillment(order, data.fulfillment_id);
  const tracking = getTracking(fulfillment);

  await sendEmail({
    container,
    to: getCustomerEmail(order),
    subject: `Order #${getOrderNumber(order)} is being prepared`,
    template: createElement(FulfillmentCreatedEmail, {
      orderId: getOrderNumber(order),
      fulfillmentId: data.fulfillment_id,
      items: toEmailItems(order),
      carrier: tracking.carrier,
      trackingNumber: tracking.trackingNumber,
      trackingUrl: tracking.trackingUrl,
      storeUrl: getStoreUrl(),
    }),
  });
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
};
