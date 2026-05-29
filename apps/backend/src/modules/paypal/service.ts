import type {
  AuthorizePaymentInput,
  CancelPaymentInput,
  CapturePaymentInput,
  DeletePaymentInput,
  GetPaymentStatusInput,
  InitiatePaymentInput,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RetrievePaymentInput,
  UpdatePaymentInput,
} from "@medusajs/framework/types";
import {
  AbstractPaymentProvider,
  MedusaError,
} from "@medusajs/framework/utils";
import {
  Client,
  Environment,
  OrdersController,
  PaymentsController,
} from "@paypal/paypal-server-sdk";
import {
  authorizePayPalPayment,
  initiatePayPalPayment,
  updatePayPalPayment,
} from "./order-actions";
import {
  cancelPayPalPayment,
  capturePayPalPayment,
  deletePayPalPayment,
  getPayPalPaymentStatus,
  refundPayPalPayment,
  retrievePayPalPayment,
} from "./payment-actions";
import type { InjectedDependencies, PayPalActionDeps, PayPalOptions } from "./types";
import { getPayPalWebhookActionAndData } from "./webhook";

class PayPalPaymentProviderService extends AbstractPaymentProvider<PayPalOptions> {
  static identifier = "paypal";

  protected readonly deps_: PayPalActionDeps;

  constructor(container: InjectedDependencies, options: PayPalOptions) {
    super(container, options);

    const resolvedOptions = {
      environment: "sandbox" as const,
      autoCapture: false,
      ...options,
    };
    const client = new Client({
      environment:
        resolvedOptions.environment === "production"
          ? Environment.Production
          : Environment.Sandbox,
      clientCredentialsAuthCredentials: {
        oAuthClientId: resolvedOptions.client_id,
        oAuthClientSecret: resolvedOptions.client_secret,
      },
    });

    this.deps_ = {
      logger: container.logger,
      options: resolvedOptions,
      ordersController: new OrdersController(client),
      paymentsController: new PaymentsController(client),
    };
  }

  static validateOptions(options: Record<string, unknown>): void {
    if (!options.client_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PAYPAL_CLIENT_ID is required"
      );
    }

    if (!options.client_secret) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PAYPAL_CLIENT_SECRET is required"
      );
    }
  }

  initiatePayment(input: InitiatePaymentInput) {
    return initiatePayPalPayment(this.deps_, input);
  }

  authorizePayment(input: AuthorizePaymentInput) {
    return authorizePayPalPayment(this.deps_, input);
  }

  updatePayment(input: UpdatePaymentInput) {
    return updatePayPalPayment(this.deps_, input);
  }

  capturePayment(input: CapturePaymentInput) {
    return capturePayPalPayment(this.deps_, input);
  }

  refundPayment(input: RefundPaymentInput) {
    return refundPayPalPayment(this.deps_, input);
  }

  cancelPayment(input: CancelPaymentInput) {
    return cancelPayPalPayment(this.deps_, input);
  }

  retrievePayment(input: RetrievePaymentInput) {
    return retrievePayPalPayment(this.deps_, input);
  }

  getPaymentStatus(input: GetPaymentStatusInput) {
    return getPayPalPaymentStatus(this.deps_, input);
  }

  deletePayment(input: DeletePaymentInput) {
    return deletePayPalPayment(input);
  }

  getWebhookActionAndData(payload: ProviderWebhookPayload["payload"]) {
    return getPayPalWebhookActionAndData(this.deps_, payload);
  }
}

export default PayPalPaymentProviderService;
