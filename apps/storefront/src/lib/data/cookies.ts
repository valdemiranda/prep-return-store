import "server-only"
import { cookies as nextCookies } from "next/headers"

export const getAuthHeaders = async (): Promise<
  { authorization: string } | Record<string, never>
> => {
  try {
    const cookies = await nextCookies()
    const token = cookies.get("_medusa_jwt")?.value

    if (!token) {
      return {}
    }

    return { authorization: `Bearer ${token}` }
  } catch {
    return {}
  }
}

export const getCacheTag = async (tag: string): Promise<string> => {
  try {
    const cookies = await nextCookies()
    const cacheId = cookies.get("_medusa_cache_id")?.value

    if (!cacheId) {
      return ""
    }

    return `${tag}-${cacheId}`
  } catch {
    return ""
  }
}

/**
 * Tempo máximo (segundos) que dados públicos de catálogo (produtos, categorias,
 * coleções) podem ficar em cache antes de serem revalidados. Rede de segurança
 * caso o webhook de invalidação (backend) falhe.
 */
export const CATALOG_REVALIDATE_SECONDS = 300

export const getCacheOptions = async (
  tag: string,
  options?: { global?: boolean; revalidate?: number }
): Promise<
  { tags: string[]; revalidate?: number } | Record<string, never>
> => {
  if (typeof window !== "undefined") {
    return {}
  }

  // Dados públicos de catálogo são compartilhados por todos os visitantes, então
  // usam uma tag GLOBAL (sem o sufixo _medusa_cache_id). Assim o webhook do
  // backend invalida o cache de todos os visitantes de uma vez via
  // revalidateTag("products"). Carrinho/cliente/pedido continuam scoped.
  if (options?.global) {
    return {
      tags: [tag],
      revalidate: options.revalidate ?? CATALOG_REVALIDATE_SECONDS,
    }
  }

  const cacheTag = await getCacheTag(tag)

  if (!cacheTag) {
    return {}
  }

  return { tags: [cacheTag] }
}

export const setAuthToken = async (token: string) => {
  const cookies = await nextCookies()
  cookies.set("_medusa_jwt", token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeAuthToken = async () => {
  const cookies = await nextCookies()
  cookies.set("_medusa_jwt", "", {
    maxAge: -1,
  })
}

export const getCartId = async () => {
  const cookies = await nextCookies()
  return cookies.get("_medusa_cart_id")?.value
}

export const setCartId = async (cartId: string) => {
  const cookies = await nextCookies()
  cookies.set("_medusa_cart_id", cartId, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeCartId = async () => {
  const cookies = await nextCookies()
  cookies.set("_medusa_cart_id", "", {
    maxAge: -1,
  })
}

// Session cookie (no maxAge) storing the id of the cart whose "Unlock Free
// Shipping" popup the user dismissed. Set client-side by the popup's close
// button; read server-side by the (main) layout to avoid re-rendering it.
export const getFreeShippingDismissal = async (): Promise<string | null> => {
  try {
    const cookies = await nextCookies()
    const value = cookies.get("_medusa_freeship_nudge")?.value

    if (!value) {
      return null
    }

    return decodeURIComponent(value)
  } catch {
    return null
  }
}
