import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { verifyTurnstile } from "../../../../utils/verify-turnstile"

/**
 * Rota pública usada pelas server actions da storefront (login, cadastro,
 * checkout, transfer) para validar o token do Turnstile. Mantém o segredo
 * (TURNSTILE_SECRET_KEY) apenas no backend. Quando o captcha está desabilitado
 * (secret ausente), retorna success: true — ver graceful em verify-turnstile.
 *
 * O IP do visitante (remoteip) é lido best-effort do x-forwarded-for; é opcional
 * para a Siteverify e só melhora a análise de fraude da Cloudflare.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = (req.body ?? {}) as { token?: string; remoteip?: string }
  const forwardedFor = req.headers["x-forwarded-for"]

  const remoteip =
    body.remoteip ||
    (typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0]?.trim()
      : undefined)

  const result = await verifyTurnstile(body.token, remoteip)

  if (!result.success) {
    res.status(403).json({ success: false, errors: result.errors })
    return
  }

  res.json({ success: true })
}
