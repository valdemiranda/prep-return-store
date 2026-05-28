import { getPercentageDiff } from "@lib/util/get-percentage-diff"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"

type LineItemPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  currencyCode: string
}

const LineItemPrice = ({
  item,
  style = "default",
  currencyCode,
}: LineItemPriceProps) => {
  const { total, original_total } = item
  const originalPrice = original_total ?? 0
  const currentPrice = total ?? 0
  const hasReducedPrice = currentPrice < originalPrice

  return (
    <div className="flex flex-col gap-x-2 text-on-surface items-end font-sans">
      <div className="text-right">
        {hasReducedPrice && (
          <>
            <p className="text-xs text-on-surface-variant">
              {style === "default" && (
                <span>Original: </span>
              )}
              <span
                className="line-through"
                data-testid="product-original-price"
              >
                {convertToLocale({
                  amount: originalPrice,
                  currency_code: currencyCode,
                })}
              </span>
            </p>
            {style === "default" && (
              <span className="bg-primary text-white text-[10px] font-black rounded-[2px] px-1.5 py-0.5 uppercase tracking-wider block mt-1 w-max ml-auto">
                -{getPercentageDiff(originalPrice, currentPrice || 0)}% OFF
              </span>
            )}
          </>
        )}
        <span
          className={clx("text-sm font-bold", {
            "text-primary font-headline text-base": hasReducedPrice,
          })}
          data-testid="product-price"
        >
          {convertToLocale({
            amount: currentPrice,
            currency_code: currencyCode,
          })}
        </span>
      </div>
    </div>
  )
}

export default LineItemPrice
