import {
  defineMiddlewares,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { verifyTurnstile } from "../utils/verify-turnstile"

/**
 * Extrai o token do Turnstile do corpo (POST) ou da query (GET). O widget da
 * storefront injeta um input hidden chamado "cf-turnstile-response".
 */
function getTurnstileToken(req: MedusaRequest): string | undefined {
  const fromBody = (req.body as Record<string, unknown> | undefined)?.[
    "cf-turnstile-response"
  ]
  const fromQuery = (req.query as Record<string, unknown> | undefined)?.[
    "cf-turnstile-response"
  ]

  const raw = fromBody ?? fromQuery
  return Array.isArray(raw) ? (raw[0] as string) : (raw as string)
}

/**
 * Middleware de captcha aplicado às rotas próprias públicas. Rejeita (403)
 * quando o token é inválido; passa adiante em caso de sucesso — inclusive
 * quando o captcha está desabilitado (secret ausente), ver verify-turnstile.
 */
async function verifyCaptcha(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const token = getTurnstileToken(req)
  const forwardedFor = req.headers["x-forwarded-for"]
  const remoteip =
    typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0]?.trim()
      : undefined

  const result = await verifyTurnstile(token, remoteip)

  if (!result.success) {
    res.status(403).json({ message: "Captcha verification failed." })
    return
  }

  next()
}

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/newsletter",
      methods: ["POST"],
      middlewares: [verifyCaptcha],
    },
    {
      matcher: "/store/order-tracking",
      methods: ["GET"],
      middlewares: [verifyCaptcha],
    },
  ],
})
