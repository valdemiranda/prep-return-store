import { createElement } from "react";
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { OrderPlacedEmail } from "../email-templates/order-placed";
import {
  formatDate,
  formatMoney,
  getCustomerEmail,
  getOrderNumber,
  getStoreUrl,
  toEmailAddress,
  toEmailItems,
} from "../email-templates/formatters";
import { fetchOrder } from "./email-data";
import { sendEmail } from "./send-email";

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve("query");
  const order = await fetchOrder(query, data.id);
  const to = getCustomerEmail(order);

  await sendEmail({
    container,
    to,
    subject: `Order confirmation #${getOrderNumber(order)}`,
    template: createElement(OrderPlacedEmail, {
      orderId: getOrderNumber(order),
      date: formatDate(order?.created_at),
      items: toEmailItems(order),
      shippingAddress: toEmailAddress(order?.shipping_address),
      subtotal: formatMoney(
        order?.item_total ?? order?.subtotal,
        order?.currency_code,
      ),
      shipping: formatMoney(order?.shipping_total, order?.currency_code),
      tax: formatMoney(order?.tax_total, order?.currency_code),
      total: formatMoney(order?.total, order?.currency_code),
      storeUrl: getStoreUrl(),
    }),
  });
}

export const config: SubscriberConfig = {
  event: "order.placed",
};
