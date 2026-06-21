import { MedusaRequest } from "@medusajs/framework/http"

/**
 * Extrai o IP do visitante do header `x-forwarded-for` (presente atrás de
 * proxies/reverse proxies, o caso em produção). Trata tanto o formato string
 * ("ip1, ip2") quanto array. Retorna `undefined` quando não há IP
 * identificável — o caller decide o fallback:
 *  - rate-limit: usa `?? "unknown"` (todos sem IP compartilham um bucket,
 *    o que é restritivo, não permissivo);
 *  - Turnstile remoteip: repassa `undefined` (não enviar "unknown" como IP à
 *    Siteverify — o campo é opcional).
 */
export function getClientIp(req: MedusaRequest): string | undefined {
  const forwardedFor = req.headers["x-forwarded-for"]

  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0]?.trim() || undefined
  }

  if (typeof forwardedFor === "string") {
    return forwardedFor.split(",")[0]?.trim() || undefined
  }

  return undefined
}
