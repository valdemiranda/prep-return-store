import type {
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
} from "@medusajs/framework/types";
import { BigNumber, MedusaError } from "@medusajs/framework/utils";
import { getPayPalErrorMessage } from "./errors";
import { getRequiredString, mapOrderStatus } from "./payment-data";
import type { PayPalActionDeps } from "./types";

export async function capturePayPalPayment(
  deps: PayPalActionDeps,
  input: CapturePaymentInput
): Promise<CapturePaymentOutput> {
  try {
    const authorizationId = getRequiredString(input.data, "authorization_id");
    const response = await deps.paymentsController.captureAuthorizedPayment({
      authorizationId,
      prefer: "return=representation",
    });

    return {
      data: { ...input.data, capture_id: response.result?.id },
    };
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to capture PayPal payment: ${getPayPalErrorMessage(error)}`
    );
  }
}

export async function refundPayPalPayment(
  deps: PayPalActionDeps,
  input: RefundPaymentInput
): Promise<RefundPaymentOutput> {
  try {
    const captureId = getRequiredString(input.data, "capture_id");
    const response = await deps.paymentsController.refundCapturedPayment({
      captureId,
      body: {
        amount: {
          currencyCode: String(input.data?.currency_code || "").toUpperCase(),
          value: new BigNumber(input.amount).numeric.toString(),
        },
      },
      prefer: "return=representation",
    });

    return {
      data: { ...input.data, refund_id: response.result?.id },
    };
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to refund PayPal payment: ${getPayPalErrorMessage(error)}`
    );
  }
}

export async function cancelPayPalPayment(
  deps: PayPalActionDeps,
  input: CancelPaymentInput
): Promise<CancelPaymentOutput> {
  try {
    const authorizationId = getRequiredString(input.data, "authorization_id");
    await deps.paymentsController.voidPayment({ authorizationId });

    return { data: input.data };
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to cancel PayPal payment: ${getPayPalErrorMessage(error)}`
    );
  }
}

export async function retrievePayPalPayment(
  deps: PayPalActionDeps,
  input: RetrievePaymentInput
): Promise<RetrievePaymentOutput> {
  try {
    const orderId = getRequiredString(input.data, "order_id");
    const response = await deps.ordersController.getOrder({ id: orderId });
    const order = response.result;

    return {
      data: { ...input.data, order_id: order?.id, status: order?.status },
    };
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to retrieve PayPal payment: ${getPayPalErrorMessage(error)}`
    );
  }
}

export async function getPayPalPaymentStatus(
  deps: PayPalActionDeps,
  input: GetPaymentStatusInput
): Promise<GetPaymentStatusOutput> {
  const orderId = input.data?.order_id;

  if (typeof orderId !== "string") {
    return { status: "pending" };
  }

  try {
    const response = await deps.ordersController.getOrder({ id: orderId });

    return { status: mapOrderStatus(response.result?.status) };
  } catch {
    return { status: "pending" };
  }
}

export async function deletePayPalPayment(
  input: DeletePaymentInput
): Promise<DeletePaymentOutput> {
  return { data: input.data };
}
