import { HttpTypes } from "@medusajs/types"
import { getProductCondition } from "@modules/products/utils/product-metadata"
import { ShieldCheck } from "lucide-react"

type ProductConditionProps = {
  product: HttpTypes.StoreProduct
}

export default function ProductCondition({ product }: ProductConditionProps) {
  const condition = getProductCondition(product)

  if (!condition) {
    return null
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-surface-container border border-outline-variant text-sm font-sans text-on-surface">
      <ShieldCheck className="w-4 h-4 text-primary" />
      <span className="font-medium text-xs tracking-wide uppercase text-on-surface-variant">Condition:</span>
      <span className="font-bold text-xs uppercase tracking-wide text-primary">{condition}</span>
    </div>
  )
}
