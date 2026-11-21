import { HttpTypes } from "@medusajs/types"
import { stripHtml } from "./xml"
import { formatFeedMoney, normalizeValidGtin } from "./csv"

// Colunas em snake_case conforme o OpenAI Product Feed Schema + Ads Product Feeds.
export const OPENAI_ADS_FEED_COLUMNS = [
  "item_id",
  "group_id",
  "listing_has_variations",
  "variant_dict",
  "title",
  "description",
  "url",
  "brand",
  "image_url",
  "additional_image_urls",
  "price",
  "sale_price",
  "availability",
  "condition",
  "product_category",
  "gtin",
  "mpn",
  "material",
  "color",
  "size",
  "seller_name",
  "seller_url",
  "return_policy",
  "target_countries",
  "store_country",
  "is_eligible_search",
  "is_eligible_checkout",
  "is_ads_eligible",
] as const

export type OpenAiAdsFeedColumn = (typeof OPENAI_ADS_FEED_COLUMNS)[number]
export type OpenAiAdsFeedRow = Record<OpenAiAdsFeedColumn, string>

const DEFAULT_VARIANT_TITLE = /^default(\s+variant)?$/i

export const resolveVariantPrices = (
  variant: HttpTypes.StoreProductVariant,
): { price: string; salePrice: string } | null => {
  const calc = variant.calculated_price
  const calculated = calc?.calculated_amount
  const currency = calc?.currency_code?.trim()

  if (typeof calculated !== "number" || calculated <= 0 || !currency) {
    return null
  }

  const original = calc?.original_amount
  const hasSale = typeof original === "number" && original > calculated

  return {
    price: formatFeedMoney(hasSale ? original : calculated, currency),
    salePrice: hasSale ? formatFeedMoney(calculated, currency) : "",
  }
}

export const buildItemTitle = (
  productTitle: string,
  variantTitle: string | null | undefined,
  includeVariantTitle: boolean,
): string => {
  const cleanProduct = stripHtml(productTitle)
  if (!includeVariantTitle || !variantTitle) {
    return cleanProduct.slice(0, 150)
  }

  const cleanVariant = stripHtml(variantTitle)
  if (
    !cleanVariant ||
    DEFAULT_VARIANT_TITLE.test(cleanVariant) ||
    cleanProduct.toLowerCase().includes(cleanVariant.toLowerCase())
  ) {
    return cleanProduct.slice(0, 150)
  }

  return `${cleanProduct} — ${cleanVariant}`.slice(0, 150)
}

export const resolveUniqueItemId = (
  variant: HttpTypes.StoreProductVariant,
  groupId: string,
  seenItemIds: Set<string>,
): string => {
  const sku = variant.sku?.trim()
  const preferred = sku && sku !== groupId ? sku : variant.id
  const itemId = seenItemIds.has(preferred) ? variant.id : preferred
  seenItemIds.add(itemId)
  return itemId
}

export const resolveVariantGtin = (
  variant: HttpTypes.StoreProductVariant,
): string =>
  normalizeValidGtin(variant.barcode) ??
  normalizeValidGtin(variant.ean) ??
  normalizeValidGtin(variant.upc) ??
  ""
