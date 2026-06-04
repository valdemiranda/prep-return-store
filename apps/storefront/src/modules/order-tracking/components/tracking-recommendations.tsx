import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"

export default function TrackingRecommendations({
  products,
  region,
}: {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="w-full mt-12 border-t border-surface-container-highest pt-12">
      <div className="flex justify-between mb-8 items-end border-b border-surface-container-highest pb-4">
        <h2 className="font-headline text-lg sm:text-xl font-extrabold text-on-surface uppercase tracking-tight">
          Recommended For You Today
        </h2>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-12">
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} />
          </li>
        ))}
      </ul>
    </div>
  )
}
