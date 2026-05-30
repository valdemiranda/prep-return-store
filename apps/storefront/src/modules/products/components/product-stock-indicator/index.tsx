import { HttpTypes } from "@medusajs/types"
import { getProductInventory } from "@modules/products/utils/product-metadata"
import { Flame } from "lucide-react"

type ProductStockIndicatorProps = {
  product: HttpTypes.StoreProduct
}

export default function ProductStockIndicator({ product }: ProductStockIndicatorProps) {
  const inventory = getProductInventory(product)

  if (inventory === null || inventory <= 0 || inventory > 9) {
    return null
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-red-50 border border-red-100/80 text-xs font-bold text-red-600 font-sans w-fit">
      <Flame className="w-4 h-4 text-red-600 fill-red-600 animate-pulse" />
      <span>Only {inventory} left in stock - order soon</span>
    </div>
  )
}
