import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AddToCartButton from "@modules/products/components/product-preview/add-to-cart-button"
import CompactCondition from "@modules/products/components/product-preview/compact-condition"
import { VariantPrice } from "types/global"

type DealCardProps = {
  product: HttpTypes.StoreProduct
  price: VariantPrice
  index: number
  total: number
}

type ProductImageProps = {
  product: HttpTypes.StoreProduct
  className: string
}

const ProductImage = ({ product, className }: ProductImageProps) => (
  <div className={className}>
    <img
      alt={product.title || ""}
      className="w-full h-full object-contain transition-transform duration-500 scale-105 group-hover:scale-110"
      src={product.thumbnail || ""}
    />
  </div>
)

const getCheapestVariantId = (product: HttpTypes.StoreProduct) =>
  product.variants
    ?.filter((variant) => !!variant.calculated_price)
    ?.sort((a, b) => {
      const aAmount = a.calculated_price?.calculated_amount ?? 0
      const bAmount = b.calculated_price?.calculated_amount ?? 0
      return aAmount - bAmount
    })?.[0]?.id || product.variants?.[0]?.id

const discountLabel = (price: VariantPrice) => {
  const diff = Number.parseInt(price.percentage_diff)
  return diff > 0 ? `${price.percentage_diff}% OFF` : "FEATURED"
}

const DealCard = ({ product, price, index, total }: DealCardProps) => {
  const href = `/products/${product.handle}`
  const cheapestVariantId = getCheapestVariantId(product)
  const canDirectAddToCart = (product.variants?.length ?? 0) <= 1 && !!cheapestVariantId

  if (index === 0) {
    return (
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-soft border border-outline-variant bg-white p-4 sm:p-6 transition-all duration-200 hover:shadow-md sm:col-span-2 md:col-span-2 md:row-span-2">
        <span className="absolute left-4 top-4 z-20 rounded-[2px] bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
          {discountLabel(price)}
        </span>
        <LocalizedClientLink href={href}>
          <ProductImage product={product} className="flex h-56 sm:h-64 md:h-80 shrink-0 items-center justify-center overflow-hidden rounded-soft bg-surface-container-low" />
        </LocalizedClientLink>
        <div className="mt-4 flex flex-grow flex-col justify-end">
          <LocalizedClientLink href={href}>
            <h3 className="mb-2 break-words font-headline text-headline-md text-on-surface transition-colors group-hover:text-primary">
              {product.title}
            </h3>
          </LocalizedClientLink>
          <CompactCondition product={product} className="mb-2" />
          {price.price_type === "sale" && (
            <p className="mb-1 text-body-sm text-on-surface-variant line-through">
              From: {price.original_price}
            </p>
          )}
          <span className="mb-4 font-price text-price-lg text-primary">
            {price.calculated_price}
          </span>
          <div className="flex flex-col gap-2">
            {canDirectAddToCart && <AddToCartButton variantId={cheapestVariantId} />}
            <LocalizedClientLink
              href={href}
              className="block w-full rounded-[4px] bg-secondary py-3 text-center text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-secondary/90 min-h-[44px] flex items-center justify-center"
            >
              View product
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    )
  }

  if (index === 3 && total === 4) {
    return (
      <div className="group relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 overflow-hidden rounded-soft border border-outline-variant bg-surface-container-low p-4 sm:p-6 transition-all duration-200 hover:shadow-md sm:col-span-2 md:col-span-2">
        <LocalizedClientLink href={href} className="w-full sm:w-1/3 shrink-0">
          <ProductImage product={product} className="flex h-48 sm:h-32 md:h-40 items-center justify-center overflow-hidden rounded-soft bg-white" />
        </LocalizedClientLink>
        <div className="flex h-full min-w-0 flex-1 flex-col justify-between w-full mt-3 sm:mt-0">
          <div>
            <span className="mb-2 inline-block rounded-[2px] bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Limited stock
            </span>
            <LocalizedClientLink href={href}>
              <h3 className="mb-1 break-words font-headline text-lg text-on-surface transition-colors group-hover:text-primary md:text-xl">
                {product.title}
              </h3>
            </LocalizedClientLink>
            <CompactCondition product={product} className="mb-2" />
            <p className="mb-2 font-price text-xl font-extrabold text-primary">
              {price.calculated_price}
            </p>
            {product.description && (
              <p className="mb-4 line-clamp-2 text-body-sm text-on-surface-variant">
                {product.description}
              </p>
            )}
          </div>
          {canDirectAddToCart && <AddToCartButton variantId={cheapestVariantId} />}
        </div>
      </div>
    )
  }

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-soft border border-outline-variant bg-white p-4 sm:p-6 transition-all duration-200 hover:shadow-md">
      <span className="absolute left-4 top-4 z-20 rounded-[2px] bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
        {discountLabel(price)}
      </span>
      <LocalizedClientLink href={href}>
        <ProductImage product={product} className="flex h-48 sm:h-40 md:h-48 shrink-0 items-center justify-center overflow-hidden rounded-soft bg-surface-container-low" />
      </LocalizedClientLink>
      <div className="mt-4 flex flex-grow flex-col justify-end">
        <LocalizedClientLink href={href}>
          <h3 className="mb-1 w-full break-words text-sm font-bold text-on-surface transition-colors group-hover:text-primary">
            {product.title}
          </h3>
        </LocalizedClientLink>
        <CompactCondition product={product} className="mb-2" />
        <span className="mb-3 font-price text-lg font-extrabold text-primary">
          {price.calculated_price}
        </span>
        <div className="mt-2 flex flex-col gap-2">
          {canDirectAddToCart && <AddToCartButton variantId={cheapestVariantId} />}
          <LocalizedClientLink
            href={href}
            className="block w-full rounded-[4px] border border-secondary py-2 text-center text-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:bg-secondary/10 min-h-[36px] flex items-center justify-center"
          >
            Details
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default DealCard
