import { HttpTypes } from "@medusajs/types"

/**
 * Safe accessors for the optional, free-form product `metadata` keys that the
 * backend may populate (`brand`, `condition`, `features`). Every field is
 * optional, so each accessor degrades gracefully to `undefined`/`[]`.
 */

const asString = (value: unknown): string | undefined => {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim()
  }
  return undefined
}

export const getProductBrand = (
  product: HttpTypes.StoreProduct
): string | undefined => asString(product.metadata?.brand)

export const getProductCondition = (
  product: HttpTypes.StoreProduct
): string | undefined => asString(product.metadata?.condition)

export const getProductFeatures = (
  product: HttpTypes.StoreProduct
): string[] => {
  const raw = product.metadata?.keepaFeatures

  if (Array.isArray(raw)) {
    return raw
      .map((item) => asString(item))
      .filter((item): item is string => Boolean(item))
  }

  const str = asString(raw)
  if (!str) {
    return []
  }

  // Tolerate a JSON-encoded array stored as a string.
  try {
    const parsed = JSON.parse(str)
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => asString(item))
        .filter((item): item is string => Boolean(item))
    }
  } catch {
    // Not JSON: fall back to delimiter splitting below.
  }

  return str
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

/**
 * Total purchasable inventory across managed variants.
 * Returns `null` when stock is effectively unlimited (backorder/unmanaged),
 * so the UI knows to hide scarcity messaging.
 */
export const getProductInventory = (
  product: HttpTypes.StoreProduct
): number | null => {
  const variants = product.variants ?? []
  if (variants.length === 0) {
    return null
  }

  let total = 0
  let hasManaged = false

  for (const variant of variants) {
    if (variant.allow_backorder) {
      return null
    }
    if (variant.manage_inventory) {
      hasManaged = true
      total += variant.inventory_quantity ?? 0
    }
  }

  return hasManaged ? total : null
}
