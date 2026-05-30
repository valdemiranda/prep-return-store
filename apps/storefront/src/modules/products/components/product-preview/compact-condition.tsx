import { HttpTypes } from "@medusajs/types"
import { getProductCondition } from "@modules/products/utils/product-metadata"

type CompactConditionProps = {
  product: HttpTypes.StoreProduct
  className?: string
}

export default function CompactCondition({ product, className = "" }: CompactConditionProps) {
  const condition = getProductCondition(product)
  if (!condition) return null

  return (
    <p className={`text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ${className}`}>
      Condition: <span className="text-primary">{condition}</span>
    </p>
  )
}
