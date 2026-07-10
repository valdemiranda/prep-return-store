import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import { hasAvailableStock } from "@lib/util/product-availability"
import {
  getProductBrand,
  getProductCondition,
} from "@modules/products/utils/product-metadata"
import { SITE_NAME, SITE_DESCRIPTION } from "@lib/constants/site"
import { formatPrice, mapCondition, stripHtml, xmlTag } from "./xml"

export type FeedContext = { baseUrl: string; country: string }

// Um <item> por produto (variante mais barata). Retorna null quando não há
// preço/handle — Google rejeita itens sem link ou preço.
export const buildFeedItem = (
  product: HttpTypes.StoreProduct,
  ctx: FeedContext,
): string | null => {
  const { cheapestPrice } = getProductPrice({ product })
  if (!product.handle || !cheapestPrice) {
    return null
  }

  const variant = product.variants?.[0]
  const gtin = variant?.barcode || undefined
  const mpn = variant?.sku || undefined
  const image = product.thumbnail || product.images?.[0]?.url

  const parts = [
    xmlTag("g:id", mpn || product.id),
    xmlTag("g:title", product.title?.slice(0, 150)),
    xmlTag("g:description", stripHtml(product.description || product.title || "").slice(0, 5000)),
    xmlTag("g:link", `${ctx.baseUrl}/${ctx.country}/products/${product.handle}`),
    xmlTag("g:image_link", image),
    xmlTag("g:availability", hasAvailableStock(product) ? "in_stock" : "out_of_stock"),
    xmlTag(
      "g:price",
      formatPrice(cheapestPrice.calculated_price_number, cheapestPrice.currency_code),
    ),
    xmlTag("g:condition", mapCondition(getProductCondition(product))),
    xmlTag("g:brand", getProductBrand(product) || SITE_NAME),
    xmlTag("g:gtin", gtin),
    xmlTag("g:mpn", mpn),
    // Sem GTIN/MPN, avisa o Google que não há identificadores únicos.
    !gtin && !mpn ? xmlTag("g:identifier_exists", "no") : "",
    xmlTag("g:product_type", product.collection?.title),
  ]

  return `<item>${parts.filter(Boolean).join("")}</item>`
}

export const buildMerchantFeed = (
  products: HttpTypes.StoreProduct[],
  ctx: FeedContext,
): string => {
  const items = products
    .map((p) => buildFeedItem(p, ctx))
    .filter((i): i is string => i !== null)
    .join("")

  const channel =
    xmlTag("title", SITE_NAME) +
    xmlTag("link", ctx.baseUrl) +
    xmlTag("description", SITE_DESCRIPTION) +
    items

  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel>${channel}</channel></rss>`
}
