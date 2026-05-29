import type {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  PaymentSessionStatus,
} from "@medusajs/framework/types";
import type { PayPalActionDeps } from "./types";

export async function captureApprovedOrder(
  deps: PayPalActionDeps,
  orderId: string,
  input: AuthorizePaymentInput
): Promise<AuthorizePaymentOutput> {
  const response = await deps.ordersController.captureOrder({
    id: orderId,
    prefer: "return=representation",
  });
  const captureId = response.result?.purchaseUnits?.[0]?.payments?.captures?.[0]?.id;

  return {
    data: { ...input.data, capture_id: captureId, intent: "CAPTURE" },
    status: "captured" as PaymentSessionStatus,
  };
}

export async function authorizeApprovedOrder(
  deps: PayPalActionDeps,
  orderId: string,
  input: AuthorizePaymentInput
): Promise<AuthorizePaymentOutput> {
  const response = await deps.ordersController.authorizeOrder({
    id: orderId,
    prefer: "return=representation",
  });
  const authId =
    response.result?.purchaseUnits?.[0]?.payments?.authorizations?.[0]?.id;

  return {
    data: {
      order_id: orderId,
      authorization_id: authId,
      intent: "AUTHORIZE",
      currency_code: input.data?.currency_code,
    },
    status: "authorized" as PaymentSessionStatus,
  };
}
