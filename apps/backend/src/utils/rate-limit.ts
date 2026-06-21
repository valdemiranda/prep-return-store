/**
 * Rate limiter em memória (sliding window por chave, tipicamente o IP).
 *
 * Mantém os timestamps das requisições dentro da janela e rejeita quando o
 * contador atinge o limite. Limpeza preguiçosa: entradas sem timestamps na
 * janela atual são removidas no próximo acesso, evitando crescimento
 * descontrolado do Map.
 *
 * Limitação: o estado é por-instância. Em deploys com múltiplas instâncias do
 * backend, o limite efetivo por IP é multiplicado pelo número de instâncias
 * (cada uma aplica seu próprio contador). Para scale-out, evoluir para uma
 * implementação com Redis — o `REDIS_URL` já está configurado no projeto para
 * caching/event-bus. Suficiente como primeira camada contra brute-force em
 * deploys de poucas instâncias, que é o caso típico deste DTC starter.
 */
const buckets = new Map<string, number[]>()

export type RateLimitResult = {
  allowed: boolean
  /** Segundos até a próxima tentativa ser permitida (0 quando allowed). */
  retryAfter: number
}

/**
 * Registra uma tentativa para `key` e indica se foi permitida dentro do
 * `limit`/`windowMs`. Não incrementa quando já excedido — o contador só cresce
 * com tentativas permitidas.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const windowStart = now - windowMs

  const recent = (buckets.get(key) ?? []).filter((t) => t > windowStart)

  if (recent.length >= limit) {
    const oldest = recent[0]
    const retryAfter = Math.max(
      Math.ceil((oldest + windowMs - now) / 1000),
      1
    )
    buckets.set(key, recent)
    return { allowed: false, retryAfter }
  }

  recent.push(now)
  buckets.set(key, recent)
  return { allowed: true, retryAfter: 0 }
}
