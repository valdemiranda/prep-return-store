import { clx } from "@modules/common/components/ui"
import { VariantPrice } from "types/global"
import { HttpTypes } from "@medusajs/types"
import AmazonPrice from "@modules/products/components/amazon-price"

export default function PreviewPrice({
  price,
  product,
}: {
  price: VariantPrice
  product?: HttpTypes.StoreProduct
}) {
  if (!price) {
    return null
  }

  const isSale = price.price_type === "sale"

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      {isSale && (
        <span
          className="line-through text-xs text-on-surface-variant font-normal"
          data-testid="original-price"
        >
          {price.original_price}
        </span>
      )}
      <div className="flex items-baseline justify-center gap-1.5 flex-wrap">
        <span
          className={clx("font-headline font-extrabold text-base md:text-lg", {
            "text-primary": isSale,
            "text-on-surface": !isSale,
          })}
          data-testid="price"
        >
          {price.calculated_price}
        </span>
        {product && (
          <AmazonPrice
            product={product}
            selectedPriceNumber={price.calculated_price_number}
            currencyCode={price.currency_code}
          />
        )}
      </div>
    </div>
  )
}
