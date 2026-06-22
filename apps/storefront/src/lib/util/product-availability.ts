import { HttpTypes } from "@medusajs/types"

const AVAILABILITY_FIELDS = [
  "+variants.inventory_quantity",
  "+variants.manage_inventory",
  "+variants.allow_backorder",
]

export const PRODUCT_AVAILABILITY_FIELDS = AVAILABILITY_FIELDS.join(",")

export function withProductAvailabilityFields(fields?: string) {
  const baseFields = fields?.trim()

  if (!baseFields) {
    return PRODUCT_AVAILABILITY_FIELDS
  }

  return [baseFields, PRODUCT_AVAILABILITY_FIELDS].join(",")
}

export function hasAvailableStock(product: HttpTypes.StoreProduct) {
  const variants = product.variants ?? []

  return variants.some((variant) => {
    if (variant.allow_backorder || !variant.manage_inventory) {
      return true
    }

    return (variant.inventory_quantity ?? 0) > 0
  })
}
