import type {
  ProviderWebhookPayload,
  WebhookActionResult,
} from "@medusajs/framework/types";
import { BigNumber } from "@medusajs/framework/utils";
import type { PayPalActionDeps } from "./types";

type PayPalWebhookResource = {
  custom_id?: string;
  customId?: string;
  amount?: { value?: string | number };
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{ amount?: { value?: string | number } }>;
      authorizations?: Array<{ amount?: { value?: string | number } }>;
    };
  }>;
};

export async function getPayPalWebhookActionAndData(
  deps: PayPalActionDeps,
  payload: ProviderWebhookPayload["payload"]
): Promise<WebhookActionResult> {
  const { data, rawData, headers } = payload;

  if (!(await verifyWebhookSignature(deps, headers || {}, data, rawData))) {
    deps.logger.error("Invalid PayPal webhook signature");
    return failedWebhookResult();
  }

  const eventType = String((data as Record<string, unknown>)?.event_type || "");
  const resource = (data as { resource?: PayPalWebhookResource }).resource;
  const sessionId = resource?.custom_id || resource?.customId;

  if (!eventType || !sessionId) {
    return { action: "not_supported", data: emptyWebhookData() };
  }

  const amount = new BigNumber(getResourceAmount(resource));

  switch (eventType) {
    case "PAYMENT.AUTHORIZATION.CREATED":
      return { action: "authorized", data: { session_id: sessionId, amount } };
    case "PAYMENT.CAPTURE.COMPLETED":
      return { action: "captured", data: { session_id: sessionId, amount } };
    case "PAYMENT.CAPTURE.DENIED":
      return { action: "failed", data: { session_id: sessionId, amount } };
    case "PAYMENT.AUTHORIZATION.VOIDED":
      return { action: "canceled", data: { session_id: sessionId, amount } };
    default:
      deps.logger.info(`Unhandled PayPal webhook event: ${eventType}`);
      return { action: "not_supported", data: { session_id: sessionId, amount } };
  }
}

async function verifyWebhookSignature(
  deps: PayPalActionDeps,
  headers: Record<string, unknown>,
  body: unknown,
  rawBody?: string | Buffer
): Promise<boolean> {
  try {
    if (!deps.options.webhook_id) {
      deps.logger.warn("PAYPAL_WEBHOOK_ID not configured; skipping verification.");
      return true;
    }

    const baseUrl =
      deps.options.environment === "production"
        ? "https://api.paypal.com"
        : "https://api.sandbox.paypal.com";
    const token = await getAccessToken(deps, baseUrl);
    const response = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transmission_id: headers["paypal-transmission-id"],
        transmission_time: headers["paypal-transmission-time"],
        cert_url: headers["paypal-cert-url"],
        auth_algo: headers["paypal-auth-algo"],
        transmission_sig: headers["paypal-transmission-sig"],
        webhook_id: deps.options.webhook_id,
        webhook_event: parseWebhookEvent(body, rawBody),
      }),
    }
    );
    const result = (await response.json()) as { verification_status?: string };

    return response.ok && result.verification_status === "SUCCESS";
  } catch (error) {
    deps.logger.error("PayPal webhook verification failed", error);
    return false;
  }
}

async function getAccessToken(
  deps: PayPalActionDeps,
  baseUrl: string
): Promise<string> {
  const credentials = Buffer.from(
    `${deps.options.client_id}:${deps.options.client_secret}`
  ).toString("base64");
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = (await response.json()) as { access_token?: string };

  return data.access_token || "";
}

function parseWebhookEvent(body: unknown, rawBody?: string | Buffer): unknown {
  if (!rawBody) {
    return body;
  }

  try {
    return JSON.parse(
      typeof rawBody === "string" ? rawBody : rawBody.toString("utf8")
    );
  } catch {
    return body;
  }
}

function getResourceAmount(resource?: PayPalWebhookResource): string | number {
  return (
    resource?.amount?.value ||
    resource?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value ||
    resource?.purchase_units?.[0]?.payments?.authorizations?.[0]?.amount
      ?.value ||
    0
  );
}

function failedWebhookResult(): WebhookActionResult {
  return { action: "failed", data: emptyWebhookData() };
}

function emptyWebhookData() {
  return { session_id: "", amount: new BigNumber(0) };
}
