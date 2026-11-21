/**
 * Como `Promise.all(items.map(fn))`, mas nunca roda mais de `limit` chamadas
 * ao mesmo tempo. Disparar tudo de uma vez em trabalho que consulta o banco
 * esgotaria o pool de conexões do Postgres; rodar em série desperdiça latência.
 *
 * Os resultados mantêm a ordem de `items`. A primeira rejeição rejeita a
 * chamada inteira, como no `Promise.all`.
 */
export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let nextIndex = 0

  const worker = async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++
      results[index] = await fn(items[index], index)
    }
  }

  const workers = Math.max(1, Math.min(limit, items.length))
  await Promise.all(Array.from({ length: workers }, worker))

  return results
}
