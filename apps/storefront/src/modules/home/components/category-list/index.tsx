import { listCategoriesWithAvailableProducts } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  Armchair,
  Grid,
  Laptop,
  LucideIcon,
  Refrigerator,
  Shirt,
  Tag,
  ToyBrick,
} from "lucide-react"
import CategoryCarousel from "./category-carousel"

const iconMap: Record<string, LucideIcon> = {
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
    <section className="py-6 md:py-8 bg-surface-container-low px-4 md:px-8 max-w-container-max mx-auto mt-6 rounded-[4px] overflow-hidden">
      <div className="flex gap-4 items-stretch w-full">
        <LocalizedClientLink
          href="/store"
          className="group flex flex-col items-center justify-center p-4 sm:p-6 bg-white rounded-[2px] shadow-sm hover:shadow-md hover:border-primary border border-outline-variant transition-all w-32 sm:w-40 shrink-0 text-center"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-surface-container rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
            <Grid className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 text-on-surface group-hover:text-white" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-on-surface group-hover:text-primary transition-colors">
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
                className="group flex flex-col items-center justify-center p-4 sm:p-6 bg-white rounded-[2px] shadow-sm hover:shadow-md hover:border-primary border border-outline-variant transition-all w-32 sm:w-40 shrink-0 text-center snap-start"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-surface-container rounded-full flex items-center justify-center mb-3 sm:mb-4 overflow-hidden relative shrink-0 group-hover:border-primary border border-transparent transition-all">
                  {categoryImage ? (
                    <img
                      src={categoryImage}
                      alt={c.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 text-on-surface group-hover:text-white" />
                    </div>
                  )}
                </div>
                <span className="font-bold text-xs sm:text-sm text-on-surface group-hover:text-primary transition-colors truncate w-full">
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
