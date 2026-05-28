import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import AddToCartButton from "./add-to-cart-button"

export default function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const cheapestVariant = product.variants
    ?.filter((v) => !!v.calculated_price)
    ?.sort((a, b) => {
      const aAmt = a.calculated_price?.calculated_amount ?? 0
      const bAmt = b.calculated_price?.calculated_amount ?? 0
      return aAmt - bAmt
    })?.[0] || product.variants?.[0]

  const isSale = cheapestPrice?.price_type === "sale"

  return (
    <div
      data-testid="product-wrapper"
      className="group relative bg-white border border-outline-variant rounded-sm p-4 flex flex-col justify-between h-full hover:shadow-md transition-all duration-200"
    >
      {isSale && (
        <span className="absolute top-2 left-2 z-10 bg-primary text-white font-bold px-2 py-0.5 rounded-[2px] text-[10px] uppercase tracking-wider">
          Sale
        </span>
      )}

      <LocalizedClientLink href={`/products/${product.handle}`} className="block">
        <div className="w-full aspect-square bg-surface-container-low shrink-0 overflow-hidden rounded-[2px]">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            isContain={true}
          />
        </div>
      </LocalizedClientLink>

      <div className="flex flex-col flex-grow justify-between mt-4">
        <div className="flex flex-col gap-1">
          {product.collection && (
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
              {product.collection.title}
            </span>
          )}
          <div className="flex flex-col gap-2">
            <LocalizedClientLink href={`/products/${product.handle}`} className="block w-full">
              <h3
                className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors break-words"
                data-testid="product-title"
              >
                {product.title}
              </h3>
            </LocalizedClientLink>
            {cheapestPrice && (
              <div className="flex justify-center">
                <PreviewPrice price={cheapestPrice} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {(product.variants?.length ?? 0) <= 1 && cheapestVariant?.id && (
            <AddToCartButton variantId={cheapestVariant.id} />
          )}
          <LocalizedClientLink href={`/products/${product.handle}`}>
            <span
              className="w-full block border border-outline text-on-surface hover:bg-surface-container font-bold py-2 text-center text-xs rounded-[4px] transition-colors uppercase tracking-wider"
            >
              Details
            </span>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
