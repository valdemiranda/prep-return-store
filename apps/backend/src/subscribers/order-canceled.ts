import { createElement } from "react";
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { OrderCanceledEmail } from "../email-templates/order-canceled";
import {
  getCustomerEmail,
  getOrderNumber,
  getStoreUrl,
  toEmailItems,
} from "../email-templates/formatters";
import { fetchOrder } from "./email-data";
import { sendEmail } from "./send-email";

export default async function orderCanceledHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve("query");
  const order = await fetchOrder(query, data.id);

  await sendEmail({
    container,
    to: getCustomerEmail(order),
    subject: `Order canceled #OSL-${getOrderNumber(order)}`,
    template: createElement(OrderCanceledEmail, {
      orderId: getOrderNumber(order),
      cancellationReason:
        "Your order was canceled. If payment was captured, the refund will be processed to the original payment method.",
      refundStatus:
        "Refund timing depends on the original payment method and your bank.",
      items: toEmailItems(order),
      storeUrl: getStoreUrl(),
    }),
  });
}

export const config: SubscriberConfig = {
  event: "order.canceled",
};
