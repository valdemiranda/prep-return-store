import "server-only"

/**
 * Verifica um token do Turnstile delegando ao backend (POST /store/captcha/verify),
 * que é o único que conhece TURNSTILE_SECRET_KEY. Usado pelas server actions
 * (login, cadastro, checkout, transfer). Quando o captcha está desabilitado no
 * backend (secret ausente), a rota retorna success: true e nada é bloqueado.
 *
 * Fail-closed: se a chamada falhar (backend indisponível), considera inválido.
 */
const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export async function verifyCaptcha(token?: string): Promise<boolean> {
  try {
    const res = await fetch(`${MEDUSA_BACKEND_URL}/store/captcha/verify`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(MEDUSA_PUBLISHABLE_KEY
          ? { "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY }
          : {}),
      },
      body: JSON.stringify({ token }),
      cache: "no-store",
    })

    if (!res.ok) {
      return false
    }

    const data = (await res.json()) as { success?: boolean }
    return Boolean(data.success)
  } catch (err) {
    console.error(
      "[captcha] Falha ao verificar token no backend:",
      err instanceof Error ? err.message : String(err)
    )
    return false
  }
}
