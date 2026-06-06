import { HttpTypes } from "@medusajs/types"
import { getProductBrand } from "@modules/products/utils/product-metadata"

type ProductBrandProps = {
  product: HttpTypes.StoreProduct
}

export default function ProductBrand({ product }: ProductBrandProps) {
  const brand = getProductBrand(product)

  if (!brand) {
    return null
  }

  return (
    <div className="flex items-center gap-1 text-xs tracking-wide text-on-surface-variant">
      <span className="font-semibold">Brand:</span>
      <span className="font-bold text-on-surface">{brand}</span>
    </div>
  )
}
