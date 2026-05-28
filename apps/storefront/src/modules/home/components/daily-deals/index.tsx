import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowRight } from "lucide-react"
import DealCard from "./deal-card"

const DEALS_TO_SHOW = 4
const DEALS_FETCH_LIMIT = 100

type DailyDeal = {
  product: Awaited<ReturnType<typeof listProducts>>["response"]["products"][number]
  cheapestPrice: ReturnType<typeof getProductPrice>["cheapestPrice"]
}

type DiscountedDailyDeal = DailyDeal & {
  cheapestPrice: NonNullable<DailyDeal["cheapestPrice"]>
}

const hasDiscount = (item: DailyDeal): item is DiscountedDailyDeal =>
  item.cheapestPrice?.price_type === "sale" &&
  Number.parseInt(item.cheapestPrice.percentage_diff, 10) > 0

const selectRandomDeals = <T,>(items: T[], size: number) => {
  if (items.length <= size) {
    return items
  }

  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ]
  }

  return shuffled.slice(0, size)
}

export default async function DailyDeals({ countryCode }: { countryCode: string }) {
  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: {
      limit: DEALS_FETCH_LIMIT,
    },
  })

  if (!products || products.length === 0) {
    return null
  }

  const pricedProducts = products
    .map((product) => {
      const { cheapestPrice } = getProductPrice({ product })
      return { product, cheapestPrice }
    })
    .filter(hasDiscount)

  const selected = selectRandomDeals(pricedProducts, DEALS_TO_SHOW)

  if (selected.length === 0) {
    return null
  }

  return (
    <section className="py-stack-lg px-margin-mobile md:px-gutter max-w-container-max mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-headline text-headline-lg uppercase text-on-surface">Daily Deals</h2>
          <p className="text-on-surface-variant font-body-md text-body-md">
            Prices valid while supplies last
          </p>
        </div>
        <LocalizedClientLink
          className="text-primary font-label-bold flex items-center gap-2 hover:underline text-sm uppercase tracking-wider"
          href="/store"
        >
          View all <ArrowRight className="w-4 h-4" />
        </LocalizedClientLink>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-gutter h-auto">
        {selected.map(({ product, cheapestPrice }, index) => (
          <DealCard
            index={index}
            key={product.id}
            price={cheapestPrice}
            product={product}
            total={selected.length}
          />
        ))}
      </div>
    </section>
  )
}
