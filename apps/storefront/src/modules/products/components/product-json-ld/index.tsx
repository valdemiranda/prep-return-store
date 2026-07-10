import { HttpTypes } from "@medusajs/types"
import { getBaseURL } from "@lib/util/env"
import { getPrimaryCountryCode } from "@lib/util/primary-country"
import { buildProductSchema } from "@lib/seo/product-schema"

type Props = { product: HttpTypes.StoreProduct }

export default async function ProductJsonLd({ product }: Props) {
  const country = await getPrimaryCountryCode()
  const url = `${getBaseURL()}/${country}/products/${product.handle}`
  const schema = buildProductSchema(product, url)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
