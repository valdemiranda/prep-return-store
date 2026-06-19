import type { Address, OrderItem } from "./theme";

type MaybeRecord = Record<string, any> | null | undefined;

export function getStoreUrl() {
  const corsUrl = process.env.STORE_CORS?.split(",")[0];

  return process.env.STORE_URL || corsUrl || "http://localhost:8000";
}

export function getOrderNumber(order: MaybeRecord) {
  return String(order?.display_id || order?.id || "").replace(/^order_/, "");
}

export function getCustomerEmail(order: MaybeRecord) {
  return order?.email || order?.customer?.email || "";
}

export function formatDate(value: unknown) {
  if (!value) {
    return "today";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(String(value)));
}

export function formatMoney(amount: unknown, currencyCode?: string) {
  const value = typeof amount === "number" ? amount : Number(amount || 0);

  if (!currencyCode) {
    return value.toString();
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}

export function toEmailAddress(address: MaybeRecord): Address {
  return {
    first_name: address?.first_name || "",
    last_name: address?.last_name || "",
    address_1: address?.address_1 || "",
    address_2: address?.address_2 || undefined,
    city: address?.city || "",
    province: address?.province || "",
    postal_code: address?.postal_code || "",
    country: address?.country || address?.country_code?.toUpperCase() || "",
  };
}

export function toEmailItems(order: MaybeRecord, items = order?.items): OrderItem[] {
  const currencyCode = order?.currency_code;

  return (items || []).map((item: MaybeRecord) => {
    const title = [item?.product_title || item?.title, item?.variant_title]
      .filter(Boolean)
      .join(" - ");

    return {
      id: item?.id || title,
      title: title || "Order item",
      quantity: Number(item?.quantity || item?.detail?.quantity || 1),
      thumbnail: item?.thumbnail || item?.variant?.product?.thumbnail,
      price: formatMoney(item?.total ?? item?.unit_price ?? 0, currencyCode),
    };
  });
}

export function getFulfillmentLabels(fulfillment: MaybeRecord) {
  return fulfillment?.labels || fulfillment?.data?.labels || [];
}

export function getTracking(fulfillment: MaybeRecord) {
  const label = getFulfillmentLabels(fulfillment)[0] || {};

  return {
    carrier: fulfillment?.provider_id || fulfillment?.provider?.identifier || "Carrier",
    trackingNumber: label.tracking_number || "Pending carrier scan",
    trackingUrl: label.tracking_url || getStoreUrl(),
  };
}
