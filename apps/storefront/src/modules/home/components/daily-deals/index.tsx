import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowRight } from "lucide-react"
import DealCard from "./deal-card"

export default async function DailyDeals({ countryCode }: { countryCode: string }) {
  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: {
      limit: 40,
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
    .filter((item) => !!item.cheapestPrice)

  const saleProducts = pricedProducts.filter(
    (item) => item.cheapestPrice?.price_type === "sale"
  )
  const otherProducts = pricedProducts.filter(
    (item) => item.cheapestPrice?.price_type !== "sale"
  )

  const selected = [...saleProducts, ...otherProducts].slice(0, 4)

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter h-auto">
        {selected.map(({ product, cheapestPrice }, index) =>
          cheapestPrice ? (
            <DealCard
              index={index}
              key={product.id}
              price={cheapestPrice}
              product={product}
              total={selected.length}
            />
          ) : null
        )}
      </div>
    </section>
  )
}
