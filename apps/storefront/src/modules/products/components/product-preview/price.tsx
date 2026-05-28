import { clx } from "@modules/common/components/ui"
import { VariantPrice } from "types/global"

export default function PreviewPrice({ price }: { price: VariantPrice }) {
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
      <span
        className={clx("font-headline font-extrabold text-base md:text-lg", {
          "text-primary": isSale,
          "text-on-surface": !isSale,
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </span>
    </div>
  )
}
