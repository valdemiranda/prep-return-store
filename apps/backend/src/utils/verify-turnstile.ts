/**
 * Verifica um token do Cloudflare Turnstile contra a API Siteverify.
 *
 * Usado tanto pelo middleware de captcha (rotas próprias /store/newsletter e
 * /store/order-tracking) quanto pela rota pública /store/captcha/verify, que a
 * storefront chama a partir de server actions (login, cadastro, checkout,
 * transfer). Assim o segredo (TURNSTILE_SECRET_KEY) vive só no backend.
 *
 * Graceful degradation: quando TURNSTILE_SECRET_KEY não está configurado, o
 * captcha é considerado desabilitado e a verificação passa (success: true) —
 * mesmo padrão dos módulos condicionais do medusa-config e do
 * revalidate-storefront. Erros de rede contra a Cloudflare são tratados como
 * falha (fail-closed) para não liberar silenciosamente o acesso.
 */

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export type TurnstileVerification = {
  success: boolean
  errors?: string[]
}

export function isTurnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY)
}

/**
 * Verifica o token retornado pelo widget. Retorna success quando o captcha
 * está desabilitado (sem secret); exige token válido quando habilitado.
 */
export async function verifyTurnstile(
  token?: string,
  remoteip?: string
): Promise<TurnstileVerification> {
  const secret = process.env.TURNSTILE_SECRET_KEY

  // Graceful: captcha desabilitado → sempre passa.
  if (!secret) {
    return { success: true }
  }

  // Habilitado mas sem token (widget ignorado/faltando) → rejeita.
  if (!token) {
    return { success: false, errors: ["missing-input-response"] }
  }

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token,
        ...(remoteip ? { remoteip } : {}),
      }),
    })

    const data = (await res.json()) as {
      success: boolean
      "error-codes"?: string[]
    }

    if (!data.success) {
      return { success: false, errors: data["error-codes"] }
    }

    return { success: true }
  } catch (err) {
    // Fail-closed: se não foi possível falar com a Cloudflare, não libera.
    console.error(
      `[verify-turnstile] Falha ao validar token contra a Cloudflare: ${
        err instanceof Error ? err.message : String(err)
      }`
    )
    return { success: false, errors: ["verification-unavailable"] }
  }
}
