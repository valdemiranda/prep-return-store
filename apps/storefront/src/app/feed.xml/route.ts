import { HttpTypes } from "@medusajs/types"
import { getBaseURL } from "@lib/util/env"
import { getPrimaryCountryCode } from "@lib/util/primary-country"
import { listProducts } from "@lib/data/products"
import { buildMerchantFeed } from "@lib/feed/google-merchant"

// Revalida junto do catálogo (fetch marcado com a tag "products").
export const revalidate = 3600

const FEED_FIELDS = [
  "handle,title,description,thumbnail,*images,*collection",
  "*variants.calculated_price,variants.sku,variants.barcode",
  "+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder",
  "+metadata",
].join(",")

export async function GET() {
  const baseUrl = getBaseURL()
  const country = await getPrimaryCountryCode()

  const products: HttpTypes.StoreProduct[] = []
  let page = 1

  // ponytail: cap de segurança em ~50k itens.
  while (page && page <= 500) {
    const { response, nextPage } = await listProducts({
      countryCode: country,
      pageParam: page,
      // Inclui indisponíveis para marcá-los como out_of_stock (não omitir).
      includeUnavailable: true,
      queryParams: { limit: 100, fields: FEED_FIELDS },
    })
    products.push(...response.products)
    page = nextPage ?? 0
  }

  const xml = buildMerchantFeed(products, { baseUrl, country })

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
}
