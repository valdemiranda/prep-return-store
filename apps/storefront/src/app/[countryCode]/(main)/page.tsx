import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import CategoryList from "@modules/home/components/category-list"
import DailyDeals from "@modules/home/components/daily-deals"
import RandomProductsCarousel from "@modules/home/components/random-products-carousel"
import PromotionalBannerCarousel from "@modules/home/components/promotional-banner-carousel"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { getStoreContent } from "@lib/data/store-content"

export const metadata: Metadata = {
  title: "One Stop Liquidation",
  description:
    "A premium liquidation outlet offering top-tier tech, home appliances, fashion, and furniture products at deep discounts.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const [{ collections }, storeContent] = await Promise.all([
    listCollections({
      fields: "id, handle, title",
    }),
    getStoreContent(),
  ])

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero
        content={storeContent.hero}
        benefitCards={storeContent.benefitCards}
      />
      <CategoryList countryCode={countryCode} />
      <DailyDeals countryCode={countryCode} />
      <RandomProductsCarousel countryCode={countryCode} />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
      <PromotionalBannerCarousel slides={storeContent.promotionalBanners} />
    </>
  )
}
