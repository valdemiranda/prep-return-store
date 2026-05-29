import type { PaymentSessionStatus } from "@medusajs/framework/types";
import { MedusaError } from "@medusajs/framework/utils";
import { OrderStatus } from "@paypal/paypal-server-sdk";

export function getRequiredString(
  data: Record<string, unknown> | undefined,
  key: string
): string {
  const value = data?.[key];

  if (typeof value !== "string") {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `PayPal ${key} is required`
    );
  }

  return value;
}

export function mapOrderStatus(status?: OrderStatus): PaymentSessionStatus {
  switch (status) {
    case OrderStatus.Approved:
    case OrderStatus.Completed:
      return "authorized";
    case OrderStatus.Voided:
      return "canceled";
    default:
      return "pending";
  }
}
