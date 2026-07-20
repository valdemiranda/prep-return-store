"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions, getCartId } from "./cookies"

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string, fields?: string) {
  const id = cartId || (await getCartId())
  fields ??=
    "*items, *region, *items.product, *items.variant, +items.variant.manage_inventory, +items.variant.allow_backorder, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name"

  if (!id) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("carts")),
  }

  const cart = await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
      method: "GET",
      query: {
        fields,
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ cart }: { cart: HttpTypes.StoreCart }) => cart)
    .catch(() => null)

  // O endpoint do carrinho não calcula `inventory_quantity` nas variants, então
  // buscamos o estoque disponível separadamente e anexamos a cada line item.
  if (cart?.items?.length) {
    await attachVariantInventory(cart, headers)
  }

  return cart
}

/**
 * Anexa o estoque disponível (`inventory_quantity`) às variants dos itens do
 * carrinho. Esse campo é calculado e não é retornado pelo endpoint do carrinho,
 * então buscamos os produtos correspondentes (que o calculam) e mesclamos.
 */
async function attachVariantInventory(
  cart: HttpTypes.StoreCart,
  headers: Record<string, string>
) {
  const productIds = Array.from(
    new Set(
      (cart.items ?? [])
        .map((item) => item.product_id)
        .filter((id): id is string => Boolean(id))
    )
  )

  if (!productIds.length) {
    return
  }

  const next = {
    ...(await getCacheOptions("products", { global: true })),
  }

  const { products } = await sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
      method: "GET",
      query: {
        id: productIds,
        limit: productIds.length,
        fields:
          "id,variants.id,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder",
      },
      headers,
      next,
      cache: "force-cache",
    })
    .catch(() => ({ products: [] as HttpTypes.StoreProduct[] }))

  const inventoryByVariant = new Map<string, number | null | undefined>()
  for (const product of products ?? []) {
    for (const variant of product.variants ?? []) {
      if (variant.id) {
        inventoryByVariant.set(variant.id, variant.inventory_quantity)
      }
    }
  }

  for (const item of cart.items ?? []) {
    if (item.variant?.id && inventoryByVariant.has(item.variant.id)) {
      item.variant.inventory_quantity = inventoryByVariant.get(item.variant.id)
    }
  }
}
