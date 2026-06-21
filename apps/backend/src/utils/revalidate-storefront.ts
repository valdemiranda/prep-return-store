/**
 * Resolve a URL pública da storefront para chamadas server-to-server. Reutiliza
 * o mesmo padrão de STORE_URL/STORE_CORS de src/email-templates/formatters.ts.
 */
function getStorefrontUrl(): string | null {
  const storeUrl = process.env.STORE_URL
  if (storeUrl) {
    return storeUrl.replace(/\/$/, "")
  }

  const corsFirst = process.env.STORE_CORS?.split(",")[0]?.trim()
  if (corsFirst) {
    return corsFirst.replace(/\/$/, "")
  }

  return null
}

/**
 * Notifica a storefront para invalidar (revalidateTag) as tags de cache
 * informadas. Chamado pelos subscribers de catálogo quando produtos/categorias/
 * coleções mudam. No-op seguro se não configurado; erros são capturados para
 * nunca derrubar o evento que o originou.
 */
export async function revalidateStorefront(tags: string[]): Promise<void> {
  if (!tags.length) {
    return
  }

  const url = getStorefrontUrl()
  const secret = process.env.STOREFRONT_REVALIDATE_SECRET

  if (!url || !secret) {
    console.warn(
      "[revalidate-storefront] STOREFRONT_REVALIDATE_SECRET ou STORE_URL/STORE_CORS ausentes; cache da storefront não será invalidado."
    )
    return
  }

  try {
    const res = await fetch(`${url}/api/revalidate`, {
      method: "POST",
      headers: {
        "x-revalidate-secret": secret,
        "content-type": "application/json",
      },
      body: JSON.stringify({ tags }),
    })

    if (!res.ok) {
      console.warn(
        `[revalidate-storefront] Storefront respondeu ${res.status} ao invalidar tags: ${tags.join(", ")}`
      )
    }
  } catch (err) {
    console.warn(
      `[revalidate-storefront] Falha ao chamar webhook de revalidação: ${
        err instanceof Error ? err.message : String(err)
      }`
    )
  }
}
