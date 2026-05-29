import type {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
} from "@medusajs/framework/types";
import { BigNumber, MedusaError } from "@medusajs/framework/utils";
import {
  CheckoutPaymentIntent,
  OrderApplicationContextLandingPage,
  OrderApplicationContextUserAction,
  type OrderRequest,
  PatchOp,
} from "@paypal/paypal-server-sdk";
import { getPayPalErrorMessage } from "./errors";
import {
  authorizeApprovedOrder,
  captureApprovedOrder,
} from "./authorize-actions";
import type { PayPalActionDeps } from "./types";

export async function initiatePayPalPayment(
  deps: PayPalActionDeps,
  input: InitiatePaymentInput
): Promise<InitiatePaymentOutput> {
  try {
    const intent = deps.options.autoCapture
      ? CheckoutPaymentIntent.Capture
      : CheckoutPaymentIntent.Authorize;
    const orderRequest: OrderRequest = {
      intent,
      purchaseUnits: [
        {
          amount: {
            currencyCode: input.currency_code.toUpperCase(),
            value: input.amount.toString(),
          },
          description: "Order payment",
          customId: input.data?.session_id as string | undefined,
        },
      ],
      applicationContext: {
        brandName: "Store",
        landingPage: OrderApplicationContextLandingPage.NoPreference,
        userAction: OrderApplicationContextUserAction.PayNow,
      },
    };
    const response = await deps.ordersController.createOrder({
      body: orderRequest,
      prefer: "return=representation",
    });
    const order = response.result;

    if (!order?.id) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Failed to create PayPal order"
      );
    }

    return {
      id: order.id,
      data: {
        order_id: order.id,
        intent,
        status: order.status,
        approval_url: order.links?.find((link) => link.rel === "approve")?.href,
        session_id: input.data?.session_id,
        currency_code: input.currency_code,
      },
    };
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to initiate PayPal payment: ${getPayPalErrorMessage(error)}`
    );
  }
}

export async function authorizePayPalPayment(
  deps: PayPalActionDeps,
  input: AuthorizePaymentInput
): Promise<AuthorizePaymentOutput> {
  try {
    const orderId = input.data?.order_id;

    if (typeof orderId !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayPal order ID is required"
      );
    }

    return deps.options.autoCapture
      ? captureApprovedOrder(deps, orderId, input)
      : authorizeApprovedOrder(deps, orderId, input);
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to authorize PayPal payment: ${getPayPalErrorMessage(error)}`
    );
  }
}

export async function updatePayPalPayment(
  deps: PayPalActionDeps,
  input: UpdatePaymentInput
): Promise<UpdatePaymentOutput> {
  try {
    const orderId = input.data?.order_id;

    if (typeof orderId !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayPal order ID is required"
      );
    }

    await deps.ordersController.patchOrder({
      id: orderId,
      body: [
        {
          op: PatchOp.Replace,
          path: "/purchase_units/@reference_id=='default'/amount/value",
          value: new BigNumber(input.amount).numeric.toString(),
        },
      ],
    });

    return {
      data: { ...input.data, currency_code: input.currency_code },
    };
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to update PayPal payment: ${getPayPalErrorMessage(error)}`
    );
  }
}
