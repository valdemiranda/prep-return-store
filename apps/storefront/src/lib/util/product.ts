import { HttpTypes } from "@medusajs/types"

export const isSimpleProduct = (product: HttpTypes.StoreProduct): boolean => {
  return (
    product.options?.length === 1 && product.options[0].values?.length === 1
  )
}

export const isVariantAvailable = (
  variant: HttpTypes.StoreProductVariant,
): boolean => {
  if (!variant.manage_inventory) return true
  if (variant.allow_backorder) return true
  if (variant.inventory_quantity && variant.inventory_quantity > 0) return true
  return false
}

export const isProductAvailable = (
  product: HttpTypes.StoreProduct,
): boolean => {
  return !!product.variants?.some(isVariantAvailable)
}
