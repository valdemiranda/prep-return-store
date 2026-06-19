import { convertToLocale } from "@lib/util/money"
import { clx } from "@modules/common/components/ui"
import { getProductAmazonPrice } from "@modules/products/utils/product-metadata"
import { HttpTypes } from "@medusajs/types"

type AmazonPriceProps = {
  product: HttpTypes.StoreProduct
  selectedPriceNumber: number
  currencyCode: string
  className?: string
}

export default function AmazonPrice({
  product,
  selectedPriceNumber,
  currencyCode,
  className,
}: AmazonPriceProps) {
  const amazonPrice = getProductAmazonPrice(product)

  if (amazonPrice === undefined || amazonPrice <= selectedPriceNumber) {
    return null
  }

  return (
    <span
      className={clx(
        "line-through text-xs text-on-surface-variant font-normal whitespace-nowrap",
        className
      )}
      data-testid="amazon-price"
      data-value={amazonPrice}
    >
      Amazon:{" "}
      {convertToLocale({ amount: amazonPrice, currency_code: currencyCode })}
    </span>
  )
}
