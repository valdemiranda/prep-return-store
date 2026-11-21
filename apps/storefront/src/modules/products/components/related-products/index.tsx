import { getRegion } from "@lib/data/regions"
import { listRelatedProducts } from "@lib/data/related-products"
import { HttpTypes } from "@medusajs/types"
import { PRODUCT_GRID_COLUMNS } from "@modules/store/constants"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const products = await listRelatedProducts({ product, countryCode })

  if (!products.length) {
    return null
  }

  return (
    <section className="bg-surface-container-low">
      <div className="max-w-[1280px] w-full mx-auto px-margin-mobile md:px-gutter py-12 small:py-16">
        <div className="mb-8 small:mb-10">
          <h2 className="font-headline text-2xl font-extrabold uppercase tracking-tight text-on-surface border-l-4 border-primary pl-4">
            Related Products
          </h2>
          <p className="mt-2 pl-4 text-on-surface-variant text-sm font-sans">
            You might also want to check out these products.
          </p>
        </div>

        <ul
          className={`grid ${PRODUCT_GRID_COLUMNS} gap-x-6 gap-y-10 small:gap-y-12`}
        >
          {products.map((product) => (
            <li key={product.id}>
              <Product region={region} product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
