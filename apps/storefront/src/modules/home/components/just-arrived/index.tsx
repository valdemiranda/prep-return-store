import { listProducts } from "@lib/data/products"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import SectionHeader from "../section-header"

const PRODUCTS_TO_SHOW = 6

const JustArrived = async ({
  countryCode,
  region,
}: {
  countryCode: string
  region: HttpTypes.StoreRegion
}) => {
  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: {
      limit: 24,
      fields: "*variants.calculated_price",
    },
  })

  const latest = sortProducts(products, "created_at").slice(0, PRODUCTS_TO_SHOW)

  if (latest.length === 0) {
    return null
  }

  return (
    <div className="pt-stack-lg">
      <SectionHeader
        title="Just Arrived"
        subtitle="Fresh stock, just landed"
        viewAllHref="/store?sortBy=created_at"
      />

      <ul className="grid grid-cols-2 gap-4">
        {latest.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default JustArrived
