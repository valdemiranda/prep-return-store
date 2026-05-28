import { listCategoriesWithAvailableProducts } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  Grid,
  Laptop,
  Armchair,
  Refrigerator,
  Shirt,
  ToyBrick,
  Tag,
} from "lucide-react"
import CategoryCarousel from "./category-carousel"

const iconMap: Record<string, any> = {
  electronics: Laptop,
  eletronicos: Laptop,
  furniture: Armchair,
  moveis: Armchair,
  appliances: Refrigerator,
  eletrodomesticos: Refrigerator,
  fashion: Shirt,
  moda: Shirt,
  toys: ToyBrick,
  brinquedos: ToyBrick,
}

function getHashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash
}

export default async function CategoryList({
  countryCode,
}: {
  countryCode?: string
}) {
  const categories = await listCategoriesWithAvailableProducts({ countryCode })
  const sortedCategories = [...(categories || [])].sort((a, b) =>
    (a.name || "").localeCompare(b.name || "")
  )

  return (
    <section className="py-stack-lg bg-surface-container-low px-margin-mobile md:px-gutter max-w-container-max mx-auto mt-6 rounded-soft">
      <div className="flex gap-4 overflow-hidden items-stretch">
        <LocalizedClientLink
          href="/store"
          className="group flex flex-col items-center justify-center p-6 bg-white rounded-soft shadow-sm hover:shadow-md hover:border-primary border border-outline-variant transition-all w-40 shrink-0 text-center"
        >
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
            <Grid className="w-8 h-8 shrink-0 text-on-surface group-hover:text-white" />
          </div>
          <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
            Browse all
          </span>
        </LocalizedClientLink>

        <CategoryCarousel>
          {sortedCategories?.map((c) => {
            const Icon = iconMap[c.handle] || Tag

            let categoryImage: string | undefined = undefined
            if (c.products && c.products.length > 0) {
              const hash = getHashCode(c.id || c.handle || "")
              const index = Math.abs(hash) % c.products.length
              const product = c.products[index]
              categoryImage =
                product.thumbnail || product.images?.[0]?.url || undefined
            }

            return (
              <LocalizedClientLink
                key={c.id}
                href={`/categories/${c.handle}`}
                className="group flex flex-col items-center justify-center p-6 bg-white rounded-soft shadow-sm hover:shadow-md hover:border-primary border border-outline-variant transition-all w-40 shrink-0 text-center snap-start"
              >
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4 overflow-hidden relative shrink-0 group-hover:border-primary border border-transparent transition-all">
                  {categoryImage ? (
                    <img
                      src={categoryImage}
                      alt={c.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="w-8 h-8 shrink-0 text-on-surface group-hover:text-white" />
                    </div>
                  )}
                </div>
                <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors truncate w-full">
                  {c.name}
                </span>
              </LocalizedClientLink>
            )
          })}
        </CategoryCarousel>
      </div>
    </section>
  )
}
