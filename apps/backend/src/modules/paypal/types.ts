import type { Logger } from "@medusajs/framework/types";
import type {
  OrdersController,
  PaymentsController,
} from "@paypal/paypal-server-sdk";

export type PayPalOptions = {
  client_id: string;
  client_secret: string;
  environment?: "sandbox" | "production";
  autoCapture?: boolean;
  webhook_id?: string;
};

export type InjectedDependencies = {
  logger: Logger;
};

export type PayPalActionDeps = {
  logger: Logger;
  options: Required<Pick<PayPalOptions, "environment" | "autoCapture">> &
    Omit<PayPalOptions, "environment" | "autoCapture">;
  ordersController: OrdersController;
  paymentsController: PaymentsController;
};
