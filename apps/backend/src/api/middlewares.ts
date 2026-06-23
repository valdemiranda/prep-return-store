import {
  defineMiddlewares,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  adminBatchProductSlugMiddleware,
  adminCategorySlugMiddleware,
  adminProductSlugMiddleware,
} from "./admin/catalog-slug-middlewares"
import { getClientIp } from "../utils/client-ip"
import { rateLimit } from "../utils/rate-limit"
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
  const remoteip = getClientIp(req)

  const result = await verifyTurnstile(token, remoteip)

  if (!result.success) {
    res.status(403).json({ message: "Captcha verification failed." })
    return
  }

  next()
}

/** Limite de tentativas de login do admin por IP, por janela. */
const ADMIN_LOGIN_LIMIT = 10
const ADMIN_LOGIN_WINDOW_MS = 60_000 // 1 minuto

/**
 * Rate-limit no login do admin (POST /auth/user/emailpass) por IP. Barrando o
 * volume de tentativas, mitiga brute-force/credential stuffing — mesmo
 * objetivo de um captcha, sem depender do frontend do core do admin. Retorna
 * 429 com `Retry-After` quando excedido.
 */
async function adminLoginRateLimit(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const ip = getClientIp(req) ?? "unknown"
  const { allowed, retryAfter } = rateLimit(
    `login:admin:${ip}`,
    ADMIN_LOGIN_LIMIT,
    ADMIN_LOGIN_WINDOW_MS
  )

  if (!allowed) {
    res.setHeader("Retry-After", String(retryAfter))
    res
      .status(429)
      .json({ message: "Too many login attempts. Try again later." })
    return
  }

  next()
}

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/products",
      methods: ["POST"],
      middlewares: [adminProductSlugMiddleware],
    },
    {
      matcher: "/admin/products/batch",
      methods: ["POST"],
      middlewares: [adminBatchProductSlugMiddleware],
    },
    {
      matcher: "/admin/product-categories",
      methods: ["POST"],
      middlewares: [adminCategorySlugMiddleware],
    },
    {
      matcher: "/store/newsletter",
      methods: ["POST"],
      middlewares: [verifyCaptcha],
    },
    {
      matcher: "/store/support",
      methods: ["POST"],
      middlewares: [verifyCaptcha],
    },
    {
      matcher: "/store/order-tracking",
      methods: ["GET"],
      middlewares: [verifyCaptcha],
    },
    {
      matcher: "/auth/user/emailpass",
      methods: ["POST"],
      middlewares: [adminLoginRateLimit],
    },
  ],
})
