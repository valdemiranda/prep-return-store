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
    <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/80">
      {brand}
    </div>
  )
}
