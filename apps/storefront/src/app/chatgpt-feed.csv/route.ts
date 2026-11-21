import { HttpTypes } from "@medusajs/types"
import { getBaseURL } from "@lib/util/env"
import { getPrimaryCountryCode } from "@lib/util/primary-country"
import { listProducts } from "@lib/data/products"
import { buildOpenAiAdsFeed } from "@lib/feed/openai-ads"

// Revalida junto do catálogo (fetch marcado com a tag "products").
export const revalidate = 3600

// Apenas prefixos "+" e "*" para preservar os campos padrão do Medusa
// (id, handle, title, description, thumbnail, material, *collection, *options,
// *images, *variants, *variants.options) e expandir o que o feed precisa.
const CHATGPT_FEED_FIELDS = [
  "*variants.calculated_price",
  "*variants.images",
  "+variants.inventory_quantity",
  "+variants.manage_inventory",
  "+variants.allow_backorder",
  "+metadata",
  "*categories",
  "*categories.parent_category",
  "*categories.parent_category.parent_category",
].join(",")

export async function GET() {
  const baseUrl = getBaseURL()
  const country = await getPrimaryCountryCode()

  const products: HttpTypes.StoreProduct[] = []
  let page = 1

  // Cap de segurança em ~50k produtos (mesmo limite do feed.xml).
  while (page && page <= 500) {
    const { response, nextPage } = await listProducts({
      countryCode: country,
      pageParam: page,
      // Inclui indisponíveis para marcá-los como out_of_stock (requisito da OpenAI).
      includeUnavailable: true,
      queryParams: { limit: 100, fields: CHATGPT_FEED_FIELDS },
    })
    products.push(...response.products)
    page = nextPage ?? 0
  }

  const csv = buildOpenAiAdsFeed(products, { baseUrl, country })

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'inline; filename="chatgpt-feed.csv"',
    },
  })
}
