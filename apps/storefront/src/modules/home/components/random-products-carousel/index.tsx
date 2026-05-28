import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import RandomProductsCarouselClient from "./carousel-client"

export default async function RandomProductsCarousel({
  countryCode,
}: {
  countryCode: string
}) {
  const region = await getRegion(countryCode)
  if (!region) {
    return null
  }

  // Fetch 100 products to shuffle client-side
  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: {
      limit: 100,
    },
  }).catch(() => ({ response: { products: [] } }))

  if (products.length === 0) {
    return null
  }

  return (
    <RandomProductsCarouselClient
      products={products}
      region={region}
    />
  )
}
