import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
        <div className="flex flex-col gap-y-2 lg:max-w-[500px] mx-auto">
          <div className="flex items-start">
            <span className="bg-primary text-white text-[10px] font-black rounded-[2px] px-2.5 py-1 uppercase tracking-wider">
              Stock Liquidation
            </span>
          </div>
          {product.collection && (
            <LocalizedClientLink
              href={`/collections/${product.collection.handle}`}
              className="text-xs text-on-surface-variant hover:text-primary transition-colors font-bold uppercase tracking-wider mt-1"
            >
              {product.collection.title}
            </LocalizedClientLink>
          )}
          <Heading
            level="h2"
            className="font-headline text-3xl font-extrabold uppercase text-on-surface tracking-tight"
            data-testid="product-title"
          >
            {product.title}
          </Heading>

        <Text
          className="text-medium text-ui-fg-subtle whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
