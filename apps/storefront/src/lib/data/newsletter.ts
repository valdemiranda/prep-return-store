import { sdk } from "@lib/config"

export async function subscribeToNewsletter(
  email: string,
  captchaToken?: string
): Promise<{
  success: boolean
}> {
  return sdk.client
    .fetch<{ success: boolean }>("/store/newsletter", {
      method: "POST",
      body: { email, "cf-turnstile-response": captchaToken },
    })
    .then(({ success }) => ({ success: success ?? false }))
    .catch(() => {
      throw new Error("Failed to subscribe to the newsletter.")
    })
}
