import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import CategoryList from "@modules/home/components/category-list"
import DailyDeals from "@modules/home/components/daily-deals"
import JustArrived from "@modules/home/components/just-arrived"
import RandomProductsCarousel from "@modules/home/components/random-products-carousel"
import PromotionalBannerCarousel from "@modules/home/components/promotional-banner-carousel"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { DEFAULT_STORE_CONTENT, getStoreContent } from "@lib/data/store-content"

export const metadata: Metadata = {
  title: { absolute: "One Stop Liquidation" },
  description:
    "A premium liquidation outlet offering top-tier tech, home appliances, fashion, and furniture products at deep discounts.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const [{ collections }, loadedStoreContent] = await Promise.all([
    listCollections({
      fields: "id, handle, title",
    }),
    getStoreContent(),
  ])

  if (!collections || !region) {
    return null
  }

  const storeContent = loadedStoreContent ?? DEFAULT_STORE_CONTENT

  return (
    <>
      <Hero content={storeContent.hero} />
      <CategoryList countryCode={countryCode} />
      <div className="content-container">
        <div className="flex flex-col xlarge:flex-row xlarge:items-start xlarge:gap-gutter">
          <div className="w-full mx-auto max-w-[1280px] xlarge:mx-0 xlarge:shrink-0">
            <DailyDeals countryCode={countryCode} />
            <PromotionalBannerCarousel
              slides={storeContent.promotionalBanners}
            />
          </div>
          <aside className="hidden min-w-0 flex-1 xlarge:block">
            <JustArrived countryCode={countryCode} region={region} />
          </aside>
        </div>
      </div>
      <RandomProductsCarousel countryCode={countryCode} />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
