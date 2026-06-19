import { createElement } from "react";
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { DeliveryCreatedEmail } from "../email-templates/delivery-created";
import {
  formatDate,
  getCustomerEmail,
  getOrderNumber,
  getStoreUrl,
  getTracking,
  toEmailAddress,
} from "../email-templates/formatters";
import {
  fetchOrderByFulfillment,
  findFulfillment,
  hasNotificationsDisabled,
} from "./email-data";
import { sendEmail } from "./send-email";

type DeliveryEvent = {
  id: string;
  no_notification?: boolean;
};

export default async function deliveryCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<DeliveryEvent>) {
  if (hasNotificationsDisabled(data)) {
    return;
  }

  const query = container.resolve("query");
  const order = await fetchOrderByFulfillment(query, data.id);
  const fulfillment = findFulfillment(order, data.id);
  const tracking = getTracking(fulfillment);

  await sendEmail({
    container,
    to: getCustomerEmail(order),
    subject: `Order #${getOrderNumber(order)} was delivered`,
    template: createElement(DeliveryCreatedEmail, {
      orderId: getOrderNumber(order),
      deliveryDate: formatDate(fulfillment?.delivered_at || new Date()),
      shippingAddress: toEmailAddress(order?.shipping_address),
      carrier: tracking.carrier,
      trackingNumber: tracking.trackingNumber,
      storeUrl: getStoreUrl(),
    }),
  });
}

export const config: SubscriberConfig = {
  event: "delivery.created",
};
