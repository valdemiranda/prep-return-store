import { HttpTypes } from "@medusajs/types"
import { getProductFeatures } from "@modules/products/utils/product-metadata"
import { CheckCircle2 } from "lucide-react"

type ProductKeyFeaturesProps = {
  product: HttpTypes.StoreProduct
}

export default function ProductKeyFeatures({ product }: ProductKeyFeaturesProps) {
  const features = getProductFeatures(product)

  if (!features || features.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <h2 className="border-l-4 border-primary pl-4 font-headline text-2xl font-bold uppercase tracking-tight text-on-surface">
        Key Features
      </h2>
      <div className="overflow-hidden rounded-sm border border-outline-variant bg-white text-sm divide-y divide-outline-variant font-sans">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3 p-4 text-on-surface">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="leading-normal">{feature}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
