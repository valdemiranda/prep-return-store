import { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"
import { getPrimaryCountryCode } from "@lib/util/primary-country"
import { listProducts } from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"

// Revalida junto do catálogo (tags "products"/"categories"/"collections").
export const revalidate = 3600

type Entry = { handle?: string | null; updated_at?: string | null }

const toEntries = (
  base: string,
  segment: string,
  items: Entry[],
): MetadataRoute.Sitemap =>
  items
    .filter((i) => i.handle)
    .map((i) => ({
      url: `${base}/${segment}/${i.handle}`,
      lastModified: i.updated_at ? new Date(i.updated_at) : undefined,
    }))

const listAllProducts = async (countryCode: string): Promise<Entry[]> => {
  const products: Entry[] = []
  let page: number | null = 1

  // ponytail: cap em ~50k URLs (limite do protocolo de sitemap).
  while (page && page <= 500) {
    const { response, nextPage } = await listProducts({
      countryCode,
      pageParam: page,
      queryParams: { limit: 100, fields: "handle,updated_at" },
    })
    products.push(...response.products)
    page = nextPage
  }

  return products
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseURL()
  const country = await getPrimaryCountryCode()
  const prefix = `${base}/${country}`

  const [products, categories, { collections }] = await Promise.all([
    listAllProducts(country),
    listCategories().catch(() => []),
    listCollections().catch(() => ({ collections: [], count: 0 })),
  ])

  return [
    { url: prefix, changeFrequency: "daily" as const, priority: 1 },
    { url: `${prefix}/store`, changeFrequency: "daily" as const },
    { url: `${prefix}/support` },
    ...toEntries(prefix, "products", products),
    ...toEntries(prefix, "categories", categories),
    ...toEntries(prefix, "collections", collections),
  ]
}
