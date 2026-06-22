import { sdk } from "@lib/config"

export type SupportRequestInput = {
  name: string
  email: string
  subject: string
  message: string
  captchaToken?: string
}

export async function submitSupportRequest({
  name,
  email,
  subject,
  message,
  captchaToken,
}: SupportRequestInput): Promise<{ success: boolean }> {
  return sdk.client
    .fetch<{ success: boolean }>("/store/support", {
      method: "POST",
      body: {
        name,
        email,
        subject,
        message,
        "cf-turnstile-response": captchaToken,
      },
    })
    .then(({ success }) => ({ success: success ?? false }))
    .catch(() => {
      throw new Error("Failed to send your support message.")
    })
}

