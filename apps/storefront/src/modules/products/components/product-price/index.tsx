import { clx } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-surface-container animate-pulse rounded-sm" />
  }

  const isSale = selectedPrice.price_type === "sale"

  return (
    <div className="flex flex-col gap-1 text-on-surface">
      <div className="flex items-baseline gap-2 flex-wrap">
        {!variant && <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">From</span>}
        <span
          className={clx("font-headline font-black text-2xl md:text-3xl", {
            "text-primary": isSale,
            "text-on-surface": !isSale,
          })}
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
        {isSale && (
          <span className="bg-primary text-white text-[10px] font-black rounded-[2px] px-2 py-0.5 uppercase tracking-wider">
            -{selectedPrice.percentage_diff}% OFF
          </span>
        )}
      </div>

      {isSale && (
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <span>Original:</span>
          <span
            className="line-through"
            data-testid="original-product-price"
            data-value={selectedPrice.original_price_number}
          >
            {selectedPrice.original_price}
          </span>
        </div>
      )}
    </div>
  )
}
